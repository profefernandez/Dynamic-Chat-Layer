import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Pencil, GripVertical, ExternalLink } from 'lucide-react';

type Props = {
  id: number;
  editMode: boolean;
  hasLink?: boolean;
  className?: string;
  badge?: React.ReactNode;
  onActivate: () => void;
  onEdit: () => void;
  children: React.ReactNode;
};

export function SortableTileCard({
  id,
  editMode,
  hasLink,
  className,
  badge,
  onActivate,
  onEdit,
  children,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: !editMode,
  });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      role="button"
      tabIndex={0}
      className={[
        'relative group z-10',
        editMode ? 'cursor-default' : 'cursor-pointer',
        className ?? '',
      ].join(' ')}
      onClick={(e) => {
        if (editMode) return;
        if ((e.target as HTMLElement).closest('[data-edit-control]')) return;
        onActivate();
      }}
      onKeyDown={(e) => {
        if (editMode) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onActivate();
        }
      }}
    >
      {badge}

      {editMode && (
        <div data-edit-control className="absolute top-2 right-2 z-30 flex items-center gap-1">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="p-1.5 rounded bg-black/60 text-on-surface-variant hover:text-primary cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="p-1.5 rounded bg-black/60 text-on-surface-variant hover:text-primary"
            title="Edit tile"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {!editMode && hasLink && (
        <div className="absolute top-3 right-3 z-20 text-on-surface-variant opacity-60 group-hover:opacity-100">
          <ExternalLink className="w-3.5 h-3.5" />
        </div>
      )}

      {children}
    </div>
  );
}
