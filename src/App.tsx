import { useState, useEffect } from 'react';
import './App.css';
import OpenAI from 'openai';
import { collection, addDoc, onSnapshot, query, orderBy, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { type Message } from './types';
import ChatPanel from './components/ChatPanel';
import PreviousCodePanel from './components/PreviousCodePanel';
import CurrentCodePanel from './components/CurrentCodePanel';
import RenderPanel from './components/RenderPanel';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [previousCode, setPreviousCode] = useState<string>('');
  const [currentCode, setCurrentCode] = useState<string>('');
  const [activeCode, setActiveCode] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const [loaded, setLoaded] = useState<boolean>(false);
  const [transitionEnabled, setTransitionEnabled] = useState<boolean>(false);

  const messagesRef = collection(db, 'messages');
  const codesRef = doc(db, 'codes', 'main');

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

  useEffect(() => {
    const loadCodes = async () => {
      try {
        const snap = await getDoc(codesRef);
        if (snap.exists()) {
          const data = snap.data();
          setPreviousCode(data.previousCode || '');
          setCurrentCode(data.currentCode || '');
          setActiveCode(data.activeCode || data.currentCode || '');
        }
      } catch (error) {
        console.error('Error loading codes:', error);
      } finally {
        setLoaded(true);
      }
    };
    loadCodes();
  }, []);

  useEffect(() => {
    if (loaded) {
      setDoc(codesRef, { previousCode, currentCode, activeCode });
    }
  }, [previousCode, currentCode, activeCode, loaded]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: 'user', content: input, timestamp: new Date() };
    setInput('');
    await addDoc(messagesRef, userMessage);

    try {
      const systemPrompt = transitionEnabled && previousCode
        ? `Generate p5.js code that creates a smooth 10-second transition animation from the previous code to the new code. Previous code: ${previousCode}. New description: ${input}. Generate only the p5.js sketch code as a function(p) { ... } without any markdown or explanation.`
        : 'You are a p5.js code generator. Generate only the p5.js sketch code as a function(p) { ... } without any markdown or explanation.';
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: input },
        ],
      });
      const code = response.choices[0].message.content || '';
      const cleanedCode = code.replace(/```javascript\n?/g, '').replace(/```\n?/g, '').trim();
      setPreviousCode(currentCode);
      setCurrentCode(cleanedCode);
      setActiveCode(cleanedCode);
      const assistantMessage: Message = { role: 'assistant', content: cleanedCode, timestamp: new Date() };
      await addDoc(messagesRef, assistantMessage);
    } catch (error) {
      console.error('Error generating code:', error);
    }
  };

  return (
    <div className="app">
      <ChatPanel messages={messages} input={input} setInput={setInput} sendMessage={sendMessage} />
      <PreviousCodePanel previousCode={previousCode} onRun={setActiveCode} />
      <CurrentCodePanel currentCode={currentCode} onRun={setActiveCode} onTransitionToggle={setTransitionEnabled} />
      <RenderPanel currentCode={activeCode} />
    </div>
  );
};

export default App;
