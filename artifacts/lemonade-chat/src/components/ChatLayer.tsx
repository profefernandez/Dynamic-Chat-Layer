import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { useAdmin } from '../context/AdminContext';
import { useGetSiteSettings, useUpdateSiteSettings, getGetSiteSettingsQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Send, Sparkles, Pencil, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ChatLayer() {
  const { messages, sendMessage, isSending, setOverlayOpen } = useChat();
  const { editMode } = useAdmin();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: settings } = useGetSiteSettings();
  const placeholder = settings?.chatPlaceholder ?? 'Ask anything or click a tile to explore...';

  const queryClient = useQueryClient();
  const { mutate: updateSettings } = useUpdateSiteSettings();
  const [editingPlaceholder, setEditingPlaceholder] = useState(false);
  const [draftPlaceholder, setDraftPlaceholder] = useState(placeholder);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setDraftPlaceholder(placeholder);
  }, [placeholder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  const savePlaceholder = () => {
    if (draftPlaceholder !== placeholder) {
      updateSettings(
        { data: { chatPlaceholder: draftPlaceholder } },
        {
          onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetSiteSettingsQueryKey() }),
        },
      );
    }
    setEditingPlaceholder(false);
  };

  return (
    <div className="fixed inset-0 z-0 flex flex-col pt-16" style={{ background: '#121317' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="bg-pattern absolute inset-0 opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[100px]" style={{ background: 'rgba(242,202,80,0.1)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[100px]" style={{ background: 'rgba(191,205,255,0.1)' }} />
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 pb-44 relative z-10">
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

      <div
        className="absolute bottom-12 left-0 right-0 px-3 pt-1 pb-2 md:px-4 md:pt-1 md:pb-3 z-50"
        style={{ background: 'linear-gradient(to top, #121317 60%, transparent)' }}
      >
        <div className="max-w-3xl mx-auto relative">
          {editMode && (
            <div className="flex justify-end mb-2 text-xs">
              {editingPlaceholder ? (
                <div className="flex items-center gap-2 bg-[#1e1f23] border border-primary/40 rounded px-2 py-1">
                  <span className="text-on-surface-variant">Placeholder:</span>
                  <input
                    autoFocus
                    value={draftPlaceholder}
                    onChange={(e) => setDraftPlaceholder(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') savePlaceholder();
                      if (e.key === 'Escape') { setDraftPlaceholder(placeholder); setEditingPlaceholder(false); }
                    }}
                    className="bg-[#121317] border border-white/10 rounded px-2 py-0.5 text-on-surface min-w-[260px]"
                  />
                  <button onClick={savePlaceholder} className="text-primary"><Check className="w-3 h-3" /></button>
                  <button onClick={() => { setDraftPlaceholder(placeholder); setEditingPlaceholder(false); }}>
                    <X className="w-3 h-3 text-on-surface-variant" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingPlaceholder(true)}
                  className="flex items-center gap-1 text-on-surface-variant hover:text-primary"
                  title="Edit chat placeholder"
                >
                  <Pencil className="w-3 h-3" /> Edit chat placeholder
                </button>
              )}
            </div>
          )}
          <div
            className="absolute -inset-1 rounded-full opacity-40 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(242,202,80,0.2), transparent 70%)', filter: 'blur(12px)' }}
          />
          <form
            onSubmit={handleSubmit}
            className="relative flex items-center rounded-full p-1 shadow-2xl transition-colors"
            style={{
              background: 'rgba(30, 31, 35, 0.95)',
              border: '1px solid rgba(242, 202, 80, 0.28)',
            }}
          >
            <Input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent border-none text-on-surface focus-visible:ring-0 px-4 text-sm placeholder:text-outline h-10 font-body-md"
              onFocus={() => setOverlayOpen(false)}
            />
            <Button
              type="submit"
              size="icon"
              className="rounded-full h-10 w-10 shrink-0 transition-transform active:scale-95 hover:shadow-[0_0_15px_rgba(242,202,80,0.5)]"
              style={{ background: '#f2ca50', color: '#3c2f00' }}
              disabled={!inputValue.trim() || isSending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
