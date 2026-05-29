import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAdmin } from '../context/AdminContext';
import { useContent } from '../context/ContentContext';
import { Pencil, Check, X, Type } from 'lucide-react';

export type TextStyle = {
  fontSize?: string;
  fontFamily?: string;
  color?: string;
};

const SIZE_OPTIONS: { label: string; value: string }[] = [
  { label: 'Default', value: '' },
  { label: 'Small', value: '0.875rem' },
  { label: 'Medium', value: '1.25rem' },
  { label: 'Large', value: '2rem' },
  { label: 'X-Large', value: '3rem' },
  { label: 'Huge', value: '4rem' },
];

const FONT_OPTIONS: { label: string; value: string }[] = [
  { label: 'Default', value: '' },
  { label: 'Sans', value: 'ui-sans-serif, system-ui, sans-serif' },
  { label: 'Serif', value: 'Georgia, Cambria, "Times New Roman", serif' },
  { label: 'Mono', value: 'ui-monospace, SFMono-Regular, Menlo, monospace' },
];

function parseStyle(raw: string): TextStyle {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed as TextStyle;
  } catch {
    /* ignore malformed style */
  }
  return {};
}

function toCss(style: TextStyle): React.CSSProperties {
  const css: React.CSSProperties = {};
  if (style.fontSize) css.fontSize = style.fontSize;
  if (style.fontFamily) css.fontFamily = style.fontFamily;
  if (style.color) css.color = style.color;
  return css;
}

type Props = {
  value: string;
  onSave: (value: string) => void;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
  as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'p';
  styleKey?: string;
};

function StylePopover({
  anchor,
  style,
  onChange,
  onClose,
}: {
  anchor: DOMRect;
  style: TextStyle;
  onChange: (next: TextStyle) => void;
  onClose: () => void;
}) {
  const top = Math.min(anchor.bottom + 6, window.innerHeight - 220);
  const left = Math.min(anchor.left, window.innerWidth - 240);

  return createPortal(
    <>
      <button
        type="button"
        aria-label="Close style editor"
        onClick={onClose}
        className="fixed inset-0 z-[300] cursor-default"
      />
      <div
        className="fixed z-[310] w-56 rounded-xl bg-[#1e1f23] border border-primary/30 shadow-2xl p-3 space-y-3"
        style={{ top, left }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">Size</label>
          <select
            value={style.fontSize ?? ''}
            onChange={(e) => onChange({ ...style, fontSize: e.target.value || undefined })}
            className="w-full bg-[#121317] border border-white/10 rounded px-2 py-1 text-xs text-on-surface"
          >
            {SIZE_OPTIONS.map((o) => (
              <option key={o.label} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">Font</label>
          <select
            value={style.fontFamily ?? ''}
            onChange={(e) => onChange({ ...style, fontFamily: e.target.value || undefined })}
            className="w-full bg-[#121317] border border-white/10 rounded px-2 py-1 text-xs text-on-surface"
          >
            {FONT_OPTIONS.map((o) => (
              <option key={o.label} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={style.color || '#f2ca50'}
              onChange={(e) => onChange({ ...style, color: e.target.value })}
              className="h-7 w-10 bg-transparent border border-white/10 rounded cursor-pointer"
            />
            <button
              type="button"
              onClick={() => onChange({ ...style, color: undefined })}
              className="text-xs text-on-surface-variant hover:text-on-surface px-2 py-1 rounded bg-white/5"
            >
              Default
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}

export function EditableText({
  value,
  onSave,
  multiline = false,
  className,
  placeholder,
  as = 'span',
  styleKey,
}: Props) {
  const { editMode } = useAdmin();
  const { get, save } = useContent();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [styleOpen, setStyleOpen] = useState(false);
  const [anchor, setAnchor] = useState<DOMRect | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const textStyle = styleKey ? parseStyle(get(styleKey, '')) : {};
  const cssStyle = toCss(textStyle);

  const saveStyle = (next: TextStyle) => {
    if (!styleKey) return;
    const cleaned: TextStyle = {};
    if (next.fontSize) cleaned.fontSize = next.fontSize;
    if (next.fontFamily) cleaned.fontFamily = next.fontFamily;
    if (next.color) cleaned.color = next.color;
    save(styleKey, Object.keys(cleaned).length ? JSON.stringify(cleaned) : '');
  };

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
    return (
      <Tag className={className} style={Object.keys(cssStyle).length ? cssStyle : undefined}>
        {value}
      </Tag>
    );
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
            style={Object.keys(cssStyle).length ? cssStyle : undefined}
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
            style={Object.keys(cssStyle).length ? cssStyle : undefined}
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
      style={Object.keys(cssStyle).length ? cssStyle : undefined}
      title="Click to edit"
    >
      <span onClick={() => setEditing(true)}>
        {value || <span className="opacity-50">{placeholder ?? 'Click to edit'}</span>}
      </span>
      <Pencil
        className="inline w-3.5 h-3.5 ml-1.5 text-primary/60 opacity-0 group-hover/edit:opacity-100 transition-opacity align-baseline cursor-pointer"
        onClick={() => setEditing(true)}
      />
      {styleKey && (
        <button
          type="button"
          title="Text style"
          onClick={(e) => {
            setAnchor((e.currentTarget as HTMLElement).getBoundingClientRect());
            setStyleOpen(true);
          }}
          className="inline-flex align-baseline ml-1 text-primary/60 opacity-0 group-hover/edit:opacity-100 transition-opacity hover:text-primary"
        >
          <Type className="w-3.5 h-3.5" />
        </button>
      )}
      {styleKey && styleOpen && anchor && (
        <StylePopover
          anchor={anchor}
          style={textStyle}
          onChange={saveStyle}
          onClose={() => setStyleOpen(false)}
        />
      )}
    </Tag>
  );
}
