import { useState, useRef, useEffect } from 'react';
import './App.css';
import OpenAI from 'openai';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import p5 from 'p5';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentCode, setCurrentCode] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const renderRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<any>(null);

  const messagesRef = collection(db, 'messages');

  useEffect(() => {
    const q = query(messagesRef, orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
      } as Message));
      setMessages(msgs);
    });
    return unsubscribe;
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: 'user', content: input, timestamp: new Date() };
    setInput('');
    await addDoc(messagesRef, userMessage);

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a p5.js code generator. Generate only the p5.js sketch code as a function(p) { ... } without any markdown or explanation.' },
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: input },
        ],
      });
      const code = response.choices[0].message.content || '';
      const cleanedCode = code.replace(/```javascript\n?/g, '').replace(/```\n?/g, '').trim();
      setCurrentCode(cleanedCode);
      const assistantMessage: Message = { role: 'assistant', content: cleanedCode, timestamp: new Date() };
      await addDoc(messagesRef, assistantMessage);
    } catch (error) {
      console.error('Error generating code:', error);
    }
  };

  useEffect(() => {
    if (p5Instance.current) {
      p5Instance.current.remove();
    }
    if (currentCode && renderRef.current) {
      try {
        const sketch = new Function('p', `(${currentCode})`) as (p: p5) => void;
        p5Instance.current = new p5(sketch, renderRef.current);
      } catch (error) {
        console.error('Error creating p5 sketch:', error);
      }
    }
  }, [currentCode]);

  return (
    <div className="app">
      <div className="panel chat-panel">
        <h2>Chat</h2>
        <div className="messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <strong>{msg.role}:</strong> {msg.content}
            </div>
          ))}
        </div>
        <div className="input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Describe the p5.js sketch..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
      <div className="panel code-panel">
        <h2>Code</h2>
        <pre>{currentCode}</pre>
      </div>
      <div className="panel render-panel">
        <h2>Render</h2>
        <div ref={renderRef} className="p5-container"></div>
      </div>
    </div>
  );
}

export default App;
