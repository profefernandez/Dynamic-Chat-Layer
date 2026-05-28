import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Pencil, Check, X } from 'lucide-react';

type Props = {
  value: string;
  onSave: (value: string) => void;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
  as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'p';
};

export function EditableText({
  value,
  onSave,
  multiline = false,
  className,
  placeholder,
  as = 'span',
}: Props) {
  const { editMode } = useAdmin();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  if (!editMode) {
    const Tag = as as any;
    return <Tag className={className}>{value}</Tag>;
  }

  const commit = () => {
    if (draft !== value) onSave(draft);
    setEditing(false);
  };
  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  if (editing) {
    return (
      <span className="inline-flex items-start gap-2 align-top">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') cancel();
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) commit();
            }}
            placeholder={placeholder}
            className={`${className ?? ''} bg-[#1e1f23] border border-primary/40 rounded px-2 py-1 outline-none min-w-[300px]`}
            rows={3}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') cancel();
              if (e.key === 'Enter') commit();
            }}
            placeholder={placeholder}
            className={`${className ?? ''} bg-[#1e1f23] border border-primary/40 rounded px-2 py-1 outline-none min-w-[200px]`}
          />
        )}
        <button
          onClick={commit}
          className="p-1 rounded bg-primary text-on-primary hover:opacity-90"
          title="Save"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={cancel}
          className="p-1 rounded bg-white/10 text-on-surface hover:bg-white/20"
          title="Cancel"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </span>
    );
  }

  const Tag = as as any;
  return (
    <Tag
      className={`${className ?? ''} relative group/edit cursor-pointer outline outline-1 outline-transparent hover:outline-primary/40 rounded transition-all px-0.5`}
      onClick={() => setEditing(true)}
      title="Click to edit"
    >
      {value || <span className="opacity-50">{placeholder ?? 'Click to edit'}</span>}
      <Pencil className="inline w-3.5 h-3.5 ml-1.5 text-primary/60 opacity-0 group-hover/edit:opacity-100 transition-opacity align-baseline" />
    </Tag>
  );
}
