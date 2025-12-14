import { useState, useEffect } from 'react';
import './App.css';
import OpenAI from 'openai';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { type Message } from './types';
import ChatPanel from './components/ChatPanel';
import CodePanel from './components/CodePanel';
import RenderPanel from './components/RenderPanel';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentCode, setCurrentCode] = useState<string>('');
  const [input, setInput] = useState<string>('');

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

  return (
    <div className="app">
      <ChatPanel messages={messages} input={input} setInput={setInput} sendMessage={sendMessage} />
      <CodePanel currentCode={currentCode} onCodeChange={setCurrentCode} />
      <RenderPanel currentCode={currentCode} />
    </div>
  );
};

export default App;
