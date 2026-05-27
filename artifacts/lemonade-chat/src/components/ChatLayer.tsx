import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ChatLayer() {
  const { messages, sendMessage, isSending, setOverlayOpen } = useChat();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className="fixed inset-0 z-0 flex flex-col pt-16 circuit-bg">
      {/* Ambient gold glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-[rgba(201,151,58,0.04)] blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-[rgba(201,151,58,0.06)] blur-[160px] rounded-full" />
        <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] bg-[rgba(80,100,220,0.04)] blur-[100px] rounded-full" />
      </div>

      {/* Message thread */}
      <div className="flex-1 overflow-y-auto px-6 py-8 pb-32">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.filter(m => !m.hidden).map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                  msg.role === 'user'
                    ? 'bg-[rgba(201,151,58,0.12)] text-[#f0ece0] border border-[rgba(201,151,58,0.25)]'
                    : 'bg-[rgba(20,15,8,0.8)] text-[#f0ece0] border border-[rgba(201,151,58,0.12)]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 opacity-70 text-xs uppercase tracking-wider text-[#8a7f6e]">
                  {msg.role === 'assistant' && <Sparkles className="w-3 h-3 text-[#c9973a]" />}
                  {msg.role === 'user' ? 'You' : '60 Watts AI'}
                </div>
                <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl px-5 py-3 bg-[rgba(20,15,8,0.8)] border border-[rgba(201,151,58,0.12)] text-[#f0ece0] flex gap-2 items-center">
                <Sparkles className="w-3 h-3 text-[#c9973a] animate-pulse" />
                <span className="text-sm text-[#8a7f6e]">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input Bar — ALWAYS VISIBLE */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-[#0d0b08] via-[rgba(13,11,8,0.92)] to-transparent z-[50]">
        <div className="max-w-3xl mx-auto relative">
          <div
            className="absolute -inset-1 rounded-full opacity-40"
            style={{ background: 'radial-gradient(ellipse at center, rgba(201,151,58,0.25), transparent 70%)', filter: 'blur(12px)' }}
          />
          <form
            onSubmit={handleSubmit}
            className="relative flex items-center rounded-full p-2 shadow-2xl focus-within:border-[rgba(201,151,58,0.6)] transition-colors"
            style={{
              background: 'rgba(20, 15, 8, 0.9)',
              border: '1px solid rgba(201, 151, 58, 0.28)',
            }}
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything or click a tile to explore..."
              className="flex-1 bg-transparent border-none text-[#f0ece0] focus-visible:ring-0 px-4 text-base placeholder:text-[#5a5040] h-12"
              onFocus={() => setOverlayOpen(false)}
            />
            <Button
              type="submit"
              size="icon"
              className="rounded-full h-12 w-12 shrink-0 transition-transform active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #e0b050, #c9973a)',
                color: '#0d0b08',
              }}
              disabled={!inputValue.trim() || isSending}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
