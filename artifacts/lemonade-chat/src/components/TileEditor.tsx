import React, { useState, useEffect } from 'react';
import { Element } from '@workspace/api-client-react';
import { ImagePicker } from './ImagePicker';
import { X } from 'lucide-react';

export type TileDraft = {
  name: string;
  description: string;
  promptText: string;
  aiGuidance: string | null;
  photoUrl: string | null;
  linkUrl: string | null;
  colSpan: number;
};

type Props = {
  initial?: Partial<Element> | null;
  onSave: (draft: TileDraft) => void;
  onCancel: () => void;
  onDelete?: () => void;
  saving?: boolean;
  title?: string;
};

export function TileEditor({ initial, onSave, onCancel, onDelete, saving, title }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [promptText, setPromptText] = useState(initial?.promptText ?? '');
  const [aiGuidance, setAiGuidance] = useState(initial?.aiGuidance ?? '');
  const [photoUrl, setPhotoUrl] = useState<string | null>(initial?.photoUrl ?? null);
  const [linkUrl, setLinkUrl] = useState<string | null>(initial?.linkUrl ?? null);
  const [colSpan, setColSpan] = useState<number>(initial?.colSpan ?? 1);

  useEffect(() => {
    setName(initial?.name ?? '');
    setDescription(initial?.description ?? '');
    setPromptText(initial?.promptText ?? '');
    setAiGuidance(initial?.aiGuidance ?? '');
    setPhotoUrl(initial?.photoUrl ?? null);
    setLinkUrl(initial?.linkUrl ?? null);
    setColSpan(initial?.colSpan ?? 1);
  }, [initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !promptText.trim()) return;
    onSave({
      name: name.trim(),
      description: description.trim(),
      promptText: promptText.trim(),
      aiGuidance: aiGuidance.trim() || null,
      photoUrl: photoUrl || null,
      linkUrl: linkUrl?.trim() || null,
      colSpan,
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4" onClick={onCancel}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1e1f23] border border-white/10 rounded-xl w-full max-w-lg max-h-[85vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
          <h3 className="text-on-surface font-semibold">{title ?? (initial?.id ? 'Edit tile' : 'New tile')}</h3>
          <button type="button" onClick={onCancel} className="text-on-surface-variant hover:text-on-surface p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-1 min-h-0">
          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[#121317] border border-white/10 rounded px-3 py-2 text-on-surface"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#121317] border border-white/10 rounded px-3 py-2 text-on-surface min-h-[60px]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">
              Chat prompt (sent if Link URL is empty)
            </label>
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              required
              className="w-full bg-[#121317] border border-white/10 rounded px-3 py-2 text-on-surface min-h-[60px]"
              placeholder="What should the AI be asked when this tile is clicked?"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">
              AI nudge <span className="opacity-60 normal-case tracking-normal">(optional — private guidance for the assistant)</span>
            </label>
            <textarea
              value={aiGuidance}
              onChange={(e) => setAiGuidance(e.target.value)}
              className="w-full bg-[#121317] border border-white/10 rounded px-3 py-2 text-on-surface min-h-[60px]"
              placeholder="Tell the AI how to talk about or sell this service — tone, key selling points, what to emphasize. The visitor never sees this."
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">
              Link URL <span className="opacity-60 normal-case tracking-normal">(optional — overrides prompt)</span>
            </label>
            <input
              type="url"
              value={linkUrl ?? ''}
              onChange={(e) => setLinkUrl(e.target.value || null)}
              placeholder="https://..."
              className="w-full bg-[#121317] border border-white/10 rounded px-3 py-2 text-on-surface"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2">Image</label>
            <ImagePicker value={photoUrl} onChange={setPhotoUrl} />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">Tile width</label>
            <div className="flex gap-2">
              {[
                { label: 'Standard', value: 1 },
                { label: 'Wide', value: 2 },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setColSpan(opt.value)}
                  className={`flex-1 px-3 py-2 text-sm rounded border transition-colors ${
                    colSpan === opt.value
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-[#121317] text-on-surface border-white/10 hover:border-primary/40'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-white/10 shrink-0">
          {onDelete ? (
            <button
              type="button"
              onClick={() => {
                if (confirm('Delete this tile?')) onDelete();
              }}
              className="px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded"
            >
              Delete
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm bg-white/5 text-on-surface hover:bg-white/10 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim() || !promptText.trim()}
              className="px-4 py-2 text-sm bg-primary text-on-primary rounded hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
