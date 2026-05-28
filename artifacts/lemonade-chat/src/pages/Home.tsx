import React, { useState, useMemo } from 'react';
import {
  useListElements,
  getListElementsQueryKey,
  useCreateElement,
  useUpdateElement,
  useDeleteElement,
  useReorderElements,
  useGetSiteSettings,
  useUpdateSiteSettings,
  getGetSiteSettingsQueryKey,
  Element,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { useChat } from '../context/ChatContext';
import { useAdmin } from '../context/AdminContext';
import { EditableText } from '../components/EditableText';
import { TileEditor, TileDraft } from '../components/TileEditor';
import { Plus, Pencil, GripVertical, ExternalLink } from 'lucide-react';
import { CrystalCluster } from '../components/CrystalCluster';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const CARD_VISUALS = [
  { badge: true,  iconSide: 'right' as const, icon: 'groups',         iconColor: 'text-primary' },
  { badge: false, iconSide: 'left'  as const, icon: 'corporate_fare', iconColor: 'text-tertiary' },
  { badge: false, iconSide: 'right' as const, icon: 'web',            iconColor: 'text-secondary' },
  { badge: true,  iconSide: 'left'  as const, icon: 'hub',            iconColor: 'text-primary' },
];

type TileCardProps = {
  element: Element;
  visualIndex: number;
  editMode: boolean;
  onActivate: () => void;
  onEdit: () => void;
};

function TileCard({ element, visualIndex, editMode, onActivate, onEdit }: TileCardProps) {
  const v = CARD_VISUALS[visualIndex % CARD_VISUALS.length];
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: element.id,
    disabled: !editMode,
  });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const iconNode = element.photoUrl ? (
    <img src={element.photoUrl} alt="" className="w-12 h-12 rounded-md object-cover border border-white/10" />
  ) : (
    <div className="w-12 h-12 rounded-full bg-black/50 border border-primary/30 flex items-center justify-center shadow-[0_0_20px_rgba(242,202,80,0.25)]">
      <span className={`material-symbols-outlined ${v.iconColor} text-2xl`}>{v.icon}</span>
    </div>
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        'tile-mini relative group transition-all duration-300 hover:-translate-y-0.5 z-10 px-4 py-3',
        'flex items-center gap-3',
        v.iconSide === 'left' ? 'flex-row' : 'flex-row-reverse',
        editMode ? 'cursor-default' : 'cursor-pointer',
      ].join(' ')}
      onClick={(e) => {
        if (editMode) return;
        if ((e.target as HTMLElement).closest('[data-edit-control]')) return;
        onActivate();
      }}
    >
      {v.badge && (
        <div className="absolute -top-2.5 left-3 bg-primary text-on-primary font-label-sm text-[9px] uppercase px-1.5 py-0.5 rounded-full z-20 shadow-[0_0_10px_rgba(242,202,80,0.5)] tracking-wider">
          New
        </div>
      )}

      {editMode && (
        <div data-edit-control className="absolute top-1 right-1 z-30 flex items-center gap-1">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="p-1 rounded bg-black/60 text-on-surface-variant hover:text-primary cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="p-1 rounded bg-black/60 text-on-surface-variant hover:text-primary"
            title="Edit tile"
          >
            <Pencil className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className="shrink-0">{iconNode}</div>

      <div className={`flex-grow min-w-0 ${v.iconSide === 'left' ? 'text-left' : 'text-right'}`}>
        <div className="flex items-center gap-1 mb-1 justify-start" style={{ justifyContent: v.iconSide === 'left' ? 'flex-start' : 'flex-end' }}>
          <h3 className="font-semibold text-sm text-primary leading-tight">{element.name}</h3>
          {!editMode && element.linkUrl && (
            <ExternalLink className="w-3 h-3 text-on-surface-variant opacity-60 group-hover:opacity-100" />
          )}
        </div>
        <p className="text-xs text-on-surface-variant leading-snug line-clamp-3">{element.description}</p>
      </div>
    </div>
  );
}

export function Home() {
  const { editMode } = useAdmin();
  const queryClient = useQueryClient();
  const { data: elements, isLoading } = useListElements({ query: { queryKey: getListElementsQueryKey() } });
  const { data: settings } = useGetSiteSettings();
  const { sendMessage, setOverlayOpen } = useChat();

  const { mutate: updateSettings } = useUpdateSiteSettings();
  const { mutate: createElement } = useCreateElement();
  const { mutate: updateElement } = useUpdateElement();
  const { mutate: deleteElement } = useDeleteElement();
  const { mutate: reorderElements } = useReorderElements();

  const [editingTile, setEditingTile] = useState<Partial<Element> | null>(null);
  const [creating, setCreating] = useState(false);
  const [localOrder, setLocalOrder] = useState<number[] | null>(null);

  const items = elements ?? [];

  const orderedItems = useMemo(() => {
    if (!localOrder) return items;
    const map = new Map(items.map((it) => [it.id, it]));
    const ordered = localOrder.map((id) => map.get(id)).filter(Boolean) as Element[];
    const seen = new Set(ordered.map((it) => it.id));
    return [...ordered, ...items.filter((it) => !seen.has(it.id))];
  }, [items, localOrder]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const invalidateSettings = () => queryClient.invalidateQueries({ queryKey: getGetSiteSettingsQueryKey() });
  const invalidateElements = () => queryClient.invalidateQueries({ queryKey: getListElementsQueryKey() });

  const saveSetting = (field: 'heroEyebrow' | 'heroTitle' | 'heroSubtitle' | 'footerTagline' | 'footerCopyright') => (value: string) => {
    updateSettings({ data: { [field]: value } }, { onSuccess: invalidateSettings });
  };

  const saveFooterLinkLabel = (index: number) => (label: string) => {
    const current = settings?.footerLinks ?? [];
    const next = current.map((l, i) => (i === index ? { ...l, label } : l));
    updateSettings({ data: { footerLinks: next } }, { onSuccess: invalidateSettings });
  };

  const saveFooterLinkUrl = (index: number) => (url: string) => {
    const current = settings?.footerLinks ?? [];
    const next = current.map((l, i) => (i === index ? { ...l, url } : l));
    updateSettings({ data: { footerLinks: next } }, { onSuccess: invalidateSettings });
  };

  const handleTileActivate = (el: Element) => {
    if (el.linkUrl) {
      window.open(el.linkUrl, '_blank', 'noopener,noreferrer');
      setOverlayOpen(false);
      return;
    }
    sendMessage(el.promptText, true);
  };

  const handleSaveTile = (draft: TileDraft) => {
    if (editingTile?.id) {
      updateElement(
        { id: editingTile.id, data: draft },
        {
          onSuccess: () => {
            invalidateElements();
            setEditingTile(null);
          },
        },
      );
    } else if (creating) {
      createElement(
        { data: { ...draft, order: items.length } },
        {
          onSuccess: () => {
            invalidateElements();
            setCreating(false);
          },
        },
      );
    }
  };

  const handleDeleteTile = () => {
    if (!editingTile?.id) return;
    deleteElement(
      { id: editingTile.id },
      {
        onSuccess: () => {
          invalidateElements();
          setEditingTile(null);
        },
      },
    );
  };

  const handleDragEnd = (e: DragEndEvent) => {
    if (!e.over || e.active.id === e.over.id) return;
    const ids = orderedItems.map((it) => it.id);
    const oldIndex = ids.indexOf(Number(e.active.id));
    const newIndex = ids.indexOf(Number(e.over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    const next = arrayMove(ids, oldIndex, newIndex);
    setLocalOrder(next);
    reorderElements(
      { data: { ids: next } },
      {
        onSuccess: () => {
          invalidateElements();
          setLocalOrder(null);
        },
      },
    );
  };

  const heroEyebrow = settings?.heroEyebrow ?? 'AI Literacy Education and Development';
  const heroSubtitle = settings?.heroSubtitle ?? 'Licensed Social Worker • AI Consultant • Educator • Website Designer';
  const heroTitleSecond = settings?.heroTitle ?? 'Clarity';
  const footerTagline = settings?.footerTagline ?? '60 Watts of Clarity';
  const footerCopyright = settings?.footerCopyright ?? '© 2024 60 Watts of Clarity. Illuminating AI Literacy for a Brighter Future.';
  const footerLinks = settings?.footerLinks ?? [
    { label: 'Privacy Policy', url: '#' },
    { label: 'Terms of Service', url: '#' },
    { label: 'Contact Us', url: '#' },
    { label: 'LinkedIn', url: '#' },
  ];

  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center pt-28 pb-20 relative px-margin-mobile md:px-margin-desktop selection:bg-primary/30">
        <div className="absolute inset-0 z-0 pointer-events-none bg-pattern opacity-50" />

        <div className="hero-card z-10 w-full max-w-container-max mx-auto px-6 md:px-12 py-12 md:py-16">
          <div className="relative z-10 text-center max-w-4xl mx-auto mb-10">
            <div className="flex items-center justify-center gap-4 mb-5 opacity-70">
              <div className="h-px w-12 bg-on-surface-variant" />
              <EditableText
                as="span"
                value={heroEyebrow}
                onSave={saveSetting('heroEyebrow')}
                className="font-label-sm text-[11px] uppercase tracking-[0.25em] text-on-surface-variant"
              />
              <div className="h-px w-12 bg-on-surface-variant" />
            </div>

            <h1 className="font-headline-xl text-[clamp(2.5rem,7vw,5.5rem)] mb-4 leading-[1.05] tracking-tight">
              <span className="text-white">60 Watts of </span>
              <EditableText
                as="span"
                value={heroTitleSecond}
                onSave={saveSetting('heroTitle')}
                className="text-primary text-glow italic pr-2"
              />
            </h1>

            <EditableText
              as="p"
              value={heroSubtitle}
              onSave={saveSetting('heroSubtitle')}
              multiline
              className="text-on-surface-variant text-sm md:text-base max-w-2xl mx-auto block"
            />
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={orderedItems.map((it) => it.id)} strategy={rectSortingStrategy}>
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-x-[320px]">
                {/* Central crystal cluster (desktop only) */}
                <div className="hidden lg:flex absolute inset-0 items-center justify-center z-0 pointer-events-none">
                  <CrystalCluster />
                </div>

                {isLoading
                  ? [0, 1, 2, 3].map((i) => (
                      <div key={i} className="tile-mini h-20 animate-pulse" />
                    ))
                  : orderedItems.slice(0, 4).map((element, index) => (
                      <TileCard
                        key={element.id}
                        element={element}
                        visualIndex={index}
                        editMode={editMode}
                        onActivate={() => handleTileActivate(element)}
                        onEdit={() => setEditingTile(element)}
                      />
                    ))}
              </div>

              {/* Overflow tiles (5+) and add-tile button below the framed hero grid */}
              {(orderedItems.length > 4 || editMode) && (
                <div className="relative z-10 mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {orderedItems.slice(4).map((element, index) => (
                    <TileCard
                      key={element.id}
                      element={element}
                      visualIndex={index + 4}
                      editMode={editMode}
                      onActivate={() => handleTileActivate(element)}
                      onEdit={() => setEditingTile(element)}
                    />
                  ))}
                  {editMode && (
                    <button
                      type="button"
                      onClick={() => setCreating(true)}
                      className="tile-mini py-3 px-4 z-10 flex items-center justify-center gap-2 border-2 border-dashed border-primary/30 hover:border-primary/60 transition-all text-on-surface-variant hover:text-primary"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm">Add tile</span>
                    </button>
                  )}
                </div>
              )}
            </SortableContext>
          </DndContext>
        </div>
      </main>

      <footer className="w-full py-12 px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-8 bg-surface-container-lowest border-t border-white/5 relative z-10">
        <EditableText
          as="div"
          value={footerTagline}
          onSave={saveSetting('footerTagline')}
          className="font-headline-md text-headline-md text-primary"
        />
        <EditableText
          as="div"
          value={footerCopyright}
          onSave={saveSetting('footerCopyright')}
          multiline
          className="font-body-md text-body-md text-on-surface-variant text-sm"
        />
        <div className="flex gap-6 flex-wrap items-center">
          {footerLinks.map((link, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              {editMode ? (
                <>
                  <EditableText
                    as="span"
                    value={link.label}
                    onSave={saveFooterLinkLabel(i)}
                    className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm uppercase tracking-widest"
                  />
                  <EditableText
                    as="span"
                    value={link.url}
                    onSave={saveFooterLinkUrl(i)}
                    className="text-on-surface-variant/60 text-xs font-mono"
                  />
                </>
              ) : (
                <a
                  href={link.url}
                  target={link.url.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm uppercase tracking-widest"
                >
                  {link.label}
                </a>
              )}
            </div>
          ))}
        </div>
      </footer>

      {(creating || editingTile) && (
        <TileEditor
          initial={editingTile}
          onSave={handleSaveTile}
          onCancel={() => { setEditingTile(null); setCreating(false); }}
          onDelete={editingTile?.id ? handleDeleteTile : undefined}
        />
      )}
    </>
  );
}
