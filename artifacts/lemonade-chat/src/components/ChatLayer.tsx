import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { useAdmin } from '../context/AdminContext';
import { useAdminUI } from '../context/AdminUIContext';
import { useGetSiteSettings, useUpdateSiteSettings, getGetSiteSettingsQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Send,
  Sparkles,
  Pencil,
  Check,
  X,
  Accessibility,
  Mic,
  Paperclip,
  Languages,
  GraduationCap,
  Globe,
  HeartHandshake,
  Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InlineTileCard } from './InlineTileCard';

import type { ChatSuggestion } from '@workspace/api-client-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  Globe,
  HeartHandshake,
  Briefcase,
  Sparkles,
  Languages,
};
const ICON_NAMES = Object.keys(ICON_MAP);
const iconFor = (name: string) => ICON_MAP[name] ?? Sparkles;

const DEFAULT_SUGGESTIONS: ChatSuggestion[] = [
  { icon: 'GraduationCap', label: 'Take AI Lesson', prompt: "I'd like to take an AI lesson. Can you teach me about AI in plain language and walk me through getting started?" },
  { icon: 'Globe', label: 'Website and Development', prompt: 'Tell me about your website and development services — how can you help me build a website?' },
  { icon: 'HeartHandshake', label: 'What is social work and AI', prompt: 'What is the connection between social work and AI? How does AI fit into social work?' },
  { icon: 'Briefcase', label: 'AI consultation', prompt: 'I am interested in AI consultation. What does your consultation cover and how does it work?' },
];

export function ChatLayer() {
  const { messages, sendMessage, isSending, setOverlayOpen } = useChat();
  const { editMode } = useAdmin();
  const { railWidth, openChatChipsToken } = useAdminUI();
  const leftOffset = editMode ? railWidth : 0;
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: settings } = useGetSiteSettings();
  const placeholder = settings?.chatPlaceholder ?? 'Ask anything or click a tile to explore...';

  const queryClient = useQueryClient();
  const { mutate: updateSettings } = useUpdateSiteSettings();
  const [editingPlaceholder, setEditingPlaceholder] = useState(false);
  const [draftPlaceholder, setDraftPlaceholder] = useState(placeholder);

  const suggestions: ChatSuggestion[] = settings?.chatSuggestions?.length
    ? settings.chatSuggestions
    : DEFAULT_SUGGESTIONS;
  const [editingChip, setEditingChip] = useState<number | null>(null);
  const [chipDraft, setChipDraft] = useState<ChatSuggestion>({ icon: 'Sparkles', label: '', prompt: '' });

  const saveSuggestions = (next: ChatSuggestion[]) => {
    updateSettings(
      { data: { chatSuggestions: next } },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetSiteSettingsQueryKey() }) },
    );
  };
  const commitChip = () => {
    if (editingChip === null) return;
    const next = suggestions.map((s, i) => (i === editingChip ? chipDraft : s));
    saveSuggestions(next);
    setEditingChip(null);
  };
  const addChip = () => {
    const next = [...suggestions, { icon: 'Sparkles', label: 'New chip', prompt: 'Ask me about...' }];
    saveSuggestions(next);
    setChipDraft(next[next.length - 1]);
    setEditingChip(next.length - 1);
  };
  const deleteChip = (index: number) => {
    saveSuggestions(suggestions.filter((_, i) => i !== index));
    setEditingChip(null);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setDraftPlaceholder(placeholder);
  }, [placeholder]);

  useEffect(() => {
    if (openChatChipsToken > 0) setOverlayOpen(false);
  }, [openChatChipsToken, setOverlayOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  const handleSuggestion = (prompt: string) => {
    if (isSending) return;
    setOverlayOpen(false);
    sendMessage(prompt);
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
    <div
      className="fixed top-0 right-0 bottom-0 z-0 flex flex-col pt-14 sm:pt-16 transition-[left] duration-300 ease-out"
      style={{ background: '#121317', left: leftOffset }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="bg-pattern absolute inset-0 opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[100px]" style={{ background: 'rgba(242,202,80,0.1)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[100px]" style={{ background: 'rgba(191,205,255,0.1)' }} />
      </div>

      {/* Messages scroll area — pb accounts for the fixed bottom bar */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-8 pb-48 sm:pb-56 relative z-10">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.filter(m => !m.hidden).map((msg) => (
            msg.element ? (
              <div key={msg.id} className="flex justify-end">
                <InlineTileCard element={msg.element} />
              </div>
            ) : (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 ${
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
            )
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

      {/* Fixed bottom chat bar — tighter on mobile, full on sm+ */}
      <div
        className="absolute bottom-0 left-0 right-0 px-2 pt-1.5 pb-[env(safe-area-inset-bottom,0.5rem)] sm:px-4 sm:pt-2 sm:pb-3 z-50"
        style={{ background: 'linear-gradient(to top, #121317 72%, transparent)' }}
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
            className="absolute -inset-1 rounded-3xl opacity-40 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(242,202,80,0.2), transparent 70%)', filter: 'blur(12px)' }}
          />
          <div
            className="relative rounded-2xl sm:rounded-3xl p-2 sm:p-3 shadow-2xl"
            style={{
              background: 'rgba(30, 31, 35, 0.95)',
              border: '1px solid rgba(242, 202, 80, 0.28)',
            }}
          >
            {/* Input row — never wraps; icon buttons hidden on xs to save space */}
            <form onSubmit={handleSubmit} className="flex flex-nowrap items-center gap-1 sm:gap-2">
              <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                {[
                  { Icon: Accessibility, label: 'Accessibility options' },
                  { Icon: Mic, label: 'Voice input' },
                  { Icon: Paperclip, label: 'Attach an image' },
                ].map(({ Icon, label }) => (
                  <button
                    key={label}
                    type="button"
                    title={label}
                    aria-label={label}
                    className="h-9 w-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
              <Input
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder={placeholder}
                className="flex-1 min-w-0 bg-transparent border-none text-on-surface focus-visible:ring-0 px-2 sm:px-3 text-sm placeholder:text-outline h-9 font-body-md"
                onFocus={() => setOverlayOpen(false)}
              />
              <button
                type="button"
                title="Translate"
                aria-label="Translate"
                className="hidden sm:flex h-9 w-9 rounded-xl items-center justify-center text-on-surface-variant hover:text-primary transition-colors shrink-0"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <Languages className="h-4 w-4" />
              </button>
              <Button
                type="submit"
                size="icon"
                className="rounded-full h-9 w-9 sm:h-10 sm:w-10 shrink-0 transition-transform active:scale-95 hover:shadow-[0_0_15px_rgba(242,202,80,0.5)]"
                style={{ background: '#f2ca50', color: '#3c2f00' }}
                disabled={!inputValue.trim() || isSending}
              >
                <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </form>

            {/* Chips — single horizontal scroll row on mobile, wrap on desktop */}
            <div className="flex sm:flex-wrap items-center gap-1.5 mt-2 overflow-x-auto no-scrollbar pb-0.5 sm:pb-0 sm:justify-center sm:gap-2">
              {suggestions.map((s, i) => {
                const Icon = iconFor(s.icon);
                return (
                  <div key={i} className="relative group shrink-0">
                    <button
                      type="button"
                      onClick={() => (editMode ? (setChipDraft(s), setEditingChip(i)) : handleSuggestion(s.prompt))}
                      disabled={isSending}
                      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-50 whitespace-nowrap"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <Icon className="h-3.5 w-3.5 text-primary" />
                      {s.label}
                      {editMode && <Pencil className="h-3 w-3 ml-1 text-on-surface-variant" />}
                    </button>
                  </div>
                );
              })}
              {editMode && (
                <button
                  type="button"
                  onClick={addChip}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors border border-dashed border-primary/30 shrink-0"
                >
                  + Add chip
                </button>
              )}
            </div>
          </div>

          <p className="text-center font-body-md text-[10px] sm:text-xs text-on-surface-variant/70 mt-1.5 sm:mt-2 leading-tight">
            Voice • image upload • translation • read-aloud — built so everyone in the community can use it.
          </p>
        </div>
      </div>

      {editMode && editingChip !== null && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setEditingChip(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1e1f23] border border-white/10 rounded-xl w-full max-w-md"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-on-surface font-semibold">Edit suggestion chip</h3>
              <button onClick={() => setEditingChip(null)} className="text-on-surface-variant hover:text-on-surface p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs text-on-surface-variant mb-1">Label</label>
                <input
                  value={chipDraft.label}
                  onChange={(e) => setChipDraft({ ...chipDraft, label: e.target.value })}
                  className="w-full bg-[#121317] border border-white/10 rounded px-3 py-2 text-sm text-on-surface"
                />
              </div>
              <div>
                <label className="block text-xs text-on-surface-variant mb-1">Icon</label>
                <select
                  value={chipDraft.icon}
                  onChange={(e) => setChipDraft({ ...chipDraft, icon: e.target.value })}
                  className="w-full bg-[#121317] border border-white/10 rounded px-3 py-2 text-sm text-on-surface"
                >
                  {ICON_NAMES.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-on-surface-variant mb-1">Prompt sent to chat</label>
                <textarea
                  value={chipDraft.prompt}
                  onChange={(e) => setChipDraft({ ...chipDraft, prompt: e.target.value })}
                  rows={3}
                  className="w-full bg-[#121317] border border-white/10 rounded px-3 py-2 text-sm text-on-surface resize-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border-t border-white/10">
              <button
                onClick={() => deleteChip(editingChip)}
                className="px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded"
              >
                Delete
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingChip(null)}
                  className="px-4 py-2 text-sm bg-white/5 text-on-surface hover:bg-white/10 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={commitChip}
                  className="px-4 py-2 text-sm bg-primary text-on-primary rounded hover:opacity-90"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
