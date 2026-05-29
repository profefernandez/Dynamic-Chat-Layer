import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { ImagePicker } from './ImagePicker';
import { Pencil, X } from 'lucide-react';

type Props = {
  value: string | null | undefined;
  defaultSrc: string;
  onSave: (url: string | null) => void;
  alt: string;
  className?: string;
};

export function EditableImage({ value, defaultSrc, onSave, alt, className }: Props) {
  const { editMode } = useAdmin();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string | null>(value ?? null);

  useEffect(() => {
    setDraft(value ?? null);
  }, [value]);

  const src = value || defaultSrc;

  return (
    <>
      <img src={src} alt={alt} className={className} />

      {editMode && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setDraft(value ?? null);
            setOpen(true);
          }}
          className="absolute top-2 right-2 z-30 p-1.5 rounded bg-black/60 text-on-surface-variant hover:text-primary"
          title="Edit image"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1e1f23] border border-white/10 rounded-xl w-full max-w-lg"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-on-surface font-semibold">Edit image</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <ImagePicker value={draft} onChange={setDraft} />
              <p className="text-xs text-on-surface-variant">
                Leave empty to use the original image.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm bg-white/5 text-on-surface hover:bg-white/10 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onSave(draft || null);
                  setOpen(false);
                }}
                className="px-4 py-2 text-sm bg-primary text-on-primary rounded hover:opacity-90"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
