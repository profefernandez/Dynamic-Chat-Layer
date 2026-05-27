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
    <div className="fixed inset-0 z-0 bg-[#0a0a0f] flex flex-col pt-16">
      {/* Background visual effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[150px] rounded-full" />
      </div>

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
                    ? 'bg-primary/10 text-primary-foreground border border-primary/20'
                    : 'bg-white/5 text-foreground border border-white/10'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 opacity-70 text-xs uppercase tracking-wider">
                  {msg.role === 'assistant' && <Sparkles className="w-3 h-3 text-primary" />}
                  {msg.role === 'user' ? 'You' : 'Lemonade AI'}
                </div>
                <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl px-5 py-3 bg-white/5 border border-white/10 text-foreground flex gap-2 items-center">
                <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                <span className="text-sm opacity-70">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input Bar - ALWAYS VISIBLE AT BOTTOM */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/90 to-transparent z-[50]">
        <div className="max-w-3xl mx-auto relative">
          <div className="absolute -inset-1 bg-primary/20 blur-xl rounded-full opacity-50 transition-opacity duration-500" />
          <form 
            onSubmit={handleSubmit}
            className="relative flex items-center bg-[#15151c] border border-primary/30 rounded-full p-2 shadow-2xl focus-within:border-primary/60 transition-colors"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything or click a tile to explore..."
              className="flex-1 bg-transparent border-none text-white focus-visible:ring-0 px-4 text-base placeholder:text-white/30 h-12"
              onFocus={() => setOverlayOpen(false)}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="rounded-full bg-primary hover:bg-primary/80 text-primary-foreground h-12 w-12 shrink-0 transition-transform active:scale-95"
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
