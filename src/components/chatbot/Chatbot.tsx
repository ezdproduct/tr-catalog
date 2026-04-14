'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { MessageSquare, Send, X, Bot, User } from 'lucide-react';
import { getChatResponse } from '@/lib/gemini';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chatbot({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const t = useTranslations('chat');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: t('greeting') }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [guestCount, setGuestCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedCount = localStorage.getItem('chat_guest_count');
    if (savedCount) setGuestCount(parseInt(savedCount));
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!isLoggedIn && guestCount >= 2) {
      setMessages(prev => [...prev, { role: 'user', text: input }, { role: 'bot', text: t('limitReached') }]);
      setInput('');
      return;
    }

    const userMessage = { role: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    if (!isLoggedIn) {
      const newCount = guestCount + 1;
      setGuestCount(newCount);
      localStorage.setItem('chat_guest_count', newCount.toString());
    }

    try {
      // Format for Gemini history
      const history = newMessages.map(m => ({
        role: m.role === 'bot' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const botResponse = await getChatResponse(input, history);
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'bot', text: "Error connecting to AI." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 2000 }}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="btn-primary"
        style={{ 
          width: '60px', height: '60px', borderRadius: '50%', 
          boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="glass-effect"
            style={{ 
              position: 'absolute', bottom: '80px', right: 0, 
              width: '350px', height: '500px', borderRadius: '20px',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)'
            }}
          >
            <div style={{ 
              padding: '1.5rem', background: 'var(--primary)', color: 'white',
              display: 'flex', alignItems: 'center', gap: '0.8rem'
            }}>
              <Bot size={24} />
              <span style={{ fontWeight: 'bold' }}>{t('title')}</span>
            </div>

            <div 
              ref={scrollRef}
              style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {messages.map((m, i) => (
                <div key={i} style={{ 
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%', padding: '0.8rem 1rem', borderRadius: '15px',
                  background: m.role === 'user' ? 'var(--primary)' : '#f1f5f9',
                  color: m.role === 'user' ? 'white' : 'var(--foreground)',
                  fontSize: '0.9rem'
                }}>
                  {m.text}
                </div>
              ))}
              {isLoading && <div style={{ opacity: 0.5, fontSize: '0.8rem' }}>Typing...</div>}
            </div>

            <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('placeholder')}
                className="form-input"
                style={{ borderRadius: '25px' }}
              />
              <button 
                onClick={handleSend}
                className="btn-primary"
                style={{ width: '40px', height: '40px', borderRadius: '50%', padding: 0 }}
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
