import React, { useState, useRef } from 'react';
import { useGenerateTileImage } from '@workspace/api-client-react';
import { Sparkles, Upload, Link as LinkIcon, X, Loader2 } from 'lucide-react';

type Props = {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
};

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const apiBase = `${basePath}/api`;

function objectPathToUrl(objectPath: string): string {
  return `${apiBase}/storage${objectPath}`;
}

export function ImagePicker({ value, onChange }: Props) {
  const [mode, setMode] = useState<'url' | 'upload' | 'ai'>('url');
  const [prompt, setPrompt] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { mutate: generateImage, isPending: generating } = useGenerateTileImage();

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const r = await fetch(`${apiBase}/storage/uploads/request-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: file.name,
          size: file.size,
          contentType: file.type || 'application/octet-stream',
        }),
      });
      if (!r.ok) throw new Error(`Upload URL request failed (${r.status})`);
      const { uploadURL, objectPath } = (await r.json()) as { uploadURL: string; objectPath: string };

      const put = await fetch(uploadURL, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        body: file,
      });
      if (!put.ok) throw new Error(`Upload failed (${put.status})`);

      onChange(objectPathToUrl(objectPath));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setError(null);
    generateImage(
      { data: { prompt } },
      {
        onSuccess: (data) => onChange(objectPathToUrl(data.objectPath)),
        onError: (e: Error) => setError(e.message || 'Generation failed'),
      },
    );
  };

  return (
    <div className="space-y-3 p-3 bg-black/30 border border-white/10 rounded-lg">
      <div className="flex items-center gap-2">
        {value && (
          <div className="relative w-16 h-16 rounded overflow-hidden border border-white/10 shrink-0">
            <img src={value} alt="" className="w-full h-full object-cover" />
            <button
              onClick={() => onChange(null)}
              className="absolute top-0 right-0 p-0.5 bg-black/70 rounded-bl text-white hover:bg-red-500/70"
              title="Remove image"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <div className="flex gap-1 flex-wrap">
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${mode === 'url' ? 'bg-primary text-on-primary' : 'bg-white/5 text-on-surface hover:bg-white/10'}`}
          >
            <LinkIcon className="w-3 h-3" /> URL
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${mode === 'upload' ? 'bg-primary text-on-primary' : 'bg-white/5 text-on-surface hover:bg-white/10'}`}
          >
            <Upload className="w-3 h-3" /> Upload
          </button>
          <button
            type="button"
            onClick={() => setMode('ai')}
            className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${mode === 'ai' ? 'bg-primary text-on-primary' : 'bg-white/5 text-on-surface hover:bg-white/10'}`}
          >
            <Sparkles className="w-3 h-3" /> AI
          </button>
        </div>
      </div>

      {mode === 'url' && (
        <input
          type="text"
          placeholder="Paste image URL..."
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value || null)}
          className="w-full bg-[#1e1f23] border border-white/10 rounded px-3 py-2 text-sm text-on-surface"
        />
      )}

      {mode === 'upload' && (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
            }}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="w-full bg-white/5 border border-dashed border-white/20 rounded px-3 py-3 text-sm text-on-surface hover:bg-white/10 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Uploading...' : 'Choose image to upload'}
          </button>
        </div>
      )}

      {mode === 'ai' && (
        <div className="space-y-2">
          <textarea
            placeholder="Describe the image you want (e.g. 'glowing golden crystal, futuristic, dark background')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-[#1e1f23] border border-white/10 rounded px-3 py-2 text-sm text-on-surface min-h-[60px]"
          />
          <button
            type="button"
            disabled={generating || !prompt.trim()}
            onClick={handleGenerate}
            className="w-full bg-primary text-on-primary rounded px-3 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? 'Generating...' : 'Generate image with Gemini'}
          </button>
        </div>
      )}

      {error && <div className="text-xs text-red-400">{error}</div>}
    </div>
  );
}
