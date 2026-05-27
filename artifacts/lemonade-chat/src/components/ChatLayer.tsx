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
    <div className="fixed inset-0 z-0 flex flex-col pt-16" style={{ background: '#121317' }}>
      {/* Ambient glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="bg-pattern absolute inset-0 opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[100px]" style={{ background: 'rgba(242,202,80,0.1)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[100px]" style={{ background: 'rgba(191,205,255,0.1)' }} />
      </div>

      {/* Message thread */}
      <div className="flex-1 overflow-y-auto px-6 py-8 pb-32 relative z-10">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.filter(m => !m.hidden).map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-xl px-5 py-3 ${
                  msg.role === 'user'
                    ? 'bg-primary/15 text-on-surface border border-primary/25'
                    : 'glass-card text-on-surface'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 text-xs uppercase tracking-wider text-on-surface-variant opacity-70">
                  {msg.role === 'assistant' && <Sparkles className="w-3 h-3 text-primary" />}
                  {msg.role === 'user' ? 'You' : '60 Watts AI'}
                </div>
                <div className="font-body-md text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex justify-start">
              <div className="glass-card rounded-xl px-5 py-3 text-on-surface flex gap-2 items-center">
                <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                <span className="text-sm text-on-surface-variant">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Chat Input Bar — NEVER COVERED, NEVER CHANGED ── */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-50"
        style={{ background: 'linear-gradient(to top, #121317 60%, transparent)' }}
      >
        <div className="max-w-3xl mx-auto relative">
          <div
            className="absolute -inset-1 rounded-full opacity-40 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(242,202,80,0.2), transparent 70%)', filter: 'blur(12px)' }}
          />
          <form
            onSubmit={handleSubmit}
            className="relative flex items-center rounded-full p-2 shadow-2xl transition-colors"
            style={{
              background: 'rgba(30, 31, 35, 0.95)',
              border: '1px solid rgba(242, 202, 80, 0.28)',
            }}
          >
            <Input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Ask anything or click a tile to explore..."
              className="flex-1 bg-transparent border-none text-on-surface focus-visible:ring-0 px-4 text-base placeholder:text-outline h-12 font-body-md"
              onFocus={() => setOverlayOpen(false)}
            />
            <Button
              type="submit"
              size="icon"
              className="rounded-full h-12 w-12 shrink-0 transition-transform active:scale-95 hover:shadow-[0_0_15px_rgba(242,202,80,0.5)]"
              style={{ background: '#f2ca50', color: '#3c2f00' }}
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
