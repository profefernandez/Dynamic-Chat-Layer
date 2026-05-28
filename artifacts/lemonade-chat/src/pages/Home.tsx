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
  {
    badge: true,
    offset: false,
    glowClass: 'bg-primary/20',
    glowHoverClass: 'group-hover:bg-primary/30',
    imgBorderClass: 'border-primary/30',
    imgShadowClass: 'shadow-[0_0_30px_rgba(242,202,80,0.3)]',
    iconColorClass: 'text-primary',
    icon: 'groups',
    fallbackImg:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA0IP6-OTzk9ReY4bBuGkLqjDcZ2TMcf5JvVOTzjA5PD8Ibw8wwPEdHnZ-99sJQTLOGK_PfhRdnsQtE2oUfGFqlXsVXzmAZQnBKFZHIhrKCV6JIg5HrD7v9yIMXXdPbSHyssuKgoLs3P5MCnUwq1dDbba6ImY-dFXgnsQfK7DJ8uk8jhwCvzEXZ9Xtq4xJXOnC5zU-THL-1CSHJV8hm1wEv1XEc6h4USslr6PnjEXd6slS46_j0yZ1JJPaP_Qa_GLqALnMRXl5Ou-8',
  },
  {
    badge: false,
    offset: true,
    glowClass: 'bg-tertiary/20',
    glowHoverClass: 'group-hover:bg-tertiary/30',
    imgBorderClass: 'border-tertiary/30',
    imgShadowClass: 'shadow-[0_0_30px_rgba(151,176,255,0.3)]',
    iconColorClass: 'text-tertiary',
    icon: 'corporate_fare',
    fallbackImg:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCrzE3M-iY3ztcO9IJpasEOLYeYNUiL3LNlrCtnwoDHOPyo-Ynj-YEG9jJkx8yWnvj4fWzCzuSLEYohtKITeiPl7cAh1lzlbbULPpN2rHb07g91_r2pIhh6ASf7_1yHtOM4lwMGHzGwIzPi8F0v4wyb_wJ36mp8iRM-_wlzhvJrAbc681ZrF_VV94E79h6mf4s5YKo7DWGJ-PYJxKCE1bv9vUr1G0ennItFXIlI0RAT04Cw-2OPYy9OtSxVcIAoon1Lp7Xkk5C-WeM',
  },
  {
    badge: false,
    offset: false,
    glowClass: 'bg-secondary/20',
    glowHoverClass: 'group-hover:bg-secondary/30',
    imgBorderClass: 'border-secondary/30',
    imgShadowClass: 'shadow-[0_0_30px_rgba(195,198,207,0.3)]',
    iconColorClass: 'text-secondary',
    icon: 'web',
    fallbackImg:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDMdO9TdRwRSwWlyVrgMGBvMwlMju6cw0M5UuUnV8oNFENzc7IyrV_7DTcUkVln_51LnotlJIZE5gTXpKon0f8VqeUbRAcOdE3vKf14kQZmMPxxQcxh-V_-UkEf4_VCenTohnbCzB4QOqztyZjvsjUk_y6B7T33yOR4MsCDrxH7l4zVAnfs8uE7gkPQjDrAPkPfogHL-egydwSIMlkOidtXdbLWz89YIB3ie_8TmtUSJa1Q_TQIWS_5WGraivzMP6KWptfvqr3nWiU',
  },
  {
    badge: true,
    offset: true,
    glowClass: 'bg-primary/20',
    glowHoverClass: 'group-hover:bg-primary/30',
    imgBorderClass: 'border-primary/30',
    imgShadowClass: 'shadow-[0_0_30px_rgba(242,202,80,0.4)]',
    iconColorClass: 'text-primary',
    icon: 'hub',
    fallbackImg:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDkiX7Bk0XbkrlVb_EsPJvUm264PsVHK8YJ7IFJ__xPIgSvF9E0xrYrN-3oPYGrsIpxR2g0isvIPy13L9N_1s-X1throZIFghbK43deJeHJ6tZ5k-HXoGWLMyy4VslCsS3_gULVZxPOmRnaY5jn9RYMf8Onn46D9dGEU5DpESljG8IKisEVp7fPVDCczXqI1HLwBF_oOcH-Cq2fMI0ouL9vWrbPfCC7ZhIBTTc-QgJt3e0szmDKncpJpmR-Kx7rLH9artnXW-Q2bvE',
  },
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

  const imgSrc = element.photoUrl || v.fallbackImg;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        'glass-card rounded-xl p-5 relative group transition-transform hover:-translate-y-1 duration-300 z-10 flex flex-col h-full',
        v.offset ? 'lg:mt-12' : '',
        editMode ? 'cursor-default' : 'cursor-pointer',
      ].join(' ')}
      onClick={(e) => {
        if (editMode) return;
        if ((e.target as HTMLElement).closest('[data-edit-control]')) return;
        onActivate();
      }}
    >
      {v.badge && (
        <div className="absolute -top-3 left-6 bg-primary text-on-primary font-label-sm text-[10px] uppercase px-2 py-0.5 rounded-full z-20 shadow-[0_0_10px_rgba(242,202,80,0.5)]">
          New
        </div>
      )}

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

      {!editMode && element.linkUrl && (
        <div className="absolute top-3 right-3 z-20 text-on-surface-variant opacity-60 group-hover:opacity-100">
          <ExternalLink className="w-3.5 h-3.5" />
        </div>
      )}

      <div className="h-28 w-full mb-3 relative flex items-center justify-center">
        <div className={`absolute inset-0 ${v.glowClass} rounded-full blur-xl ${v.glowHoverClass} transition-colors`} />
        <img
          alt={element.name}
          className={`w-24 h-24 object-cover rounded-full border ${v.imgBorderClass} z-10 opacity-80 mix-blend-screen ${v.imgShadowClass}`}
          src={imgSrc}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            if (img.src !== v.fallbackImg) img.src = v.fallbackImg;
          }}
        />
        <span className={`material-symbols-outlined absolute ${v.iconColorClass} text-3xl z-20 mix-blend-screen`}>
          {v.icon}
        </span>
      </div>

      <h3 className="font-body-lg text-xl text-white font-semibold mb-2">{element.name}</h3>
      <p className="font-body-md text-base text-on-surface-variant flex-grow">{element.description}</p>
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
      <main className="flex-grow flex flex-col items-center justify-start pt-6 pb-4 relative px-margin-mobile md:px-margin-desktop selection:bg-primary/30">
        <div className="absolute inset-0 z-0 pointer-events-none bg-pattern opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] z-0 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tertiary/10 rounded-full blur-[100px] z-0 pointer-events-none" />

        <div className="z-10 text-center max-w-4xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-4 mb-3 opacity-70">
            <div className="h-px w-12 bg-on-surface-variant" />
            <EditableText
              as="span"
              value={heroEyebrow}
              onSave={saveSetting('heroEyebrow')}
              className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-on-surface-variant"
            />
            <div className="h-px w-12 bg-on-surface-variant" />
          </div>

          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-3 leading-tight">
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
            className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto block"
          />
        </div>

        <div className="z-10 w-full max-w-container-max mx-auto">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={orderedItems.map((it) => it.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter relative">
                <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2 z-0" />

                {isLoading
                  ? [0, 1, 2, 3].map((i) => (
                      <div key={i} className="glass-card rounded-xl p-6 h-64 animate-pulse" />
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

                {editMode && (
                  <button
                    type="button"
                    onClick={() => setCreating(true)}
                    className="glass-card rounded-xl p-6 h-64 z-10 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-primary/30 hover:border-primary/60 hover:-translate-y-1 transition-all text-on-surface-variant hover:text-primary"
                  >
                    <Plus className="w-8 h-8" />
                    <span className="font-body-md text-sm">Add tile</span>
                  </button>
                )}
              </div>

              {orderedItems.length > 4 && (
                <div className="mt-12 pt-8 border-t border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                    {orderedItems.slice(4).map((element, i) => (
                      <TileCard
                        key={element.id}
                        element={element}
                        visualIndex={i + 4}
                        editMode={editMode}
                        onActivate={() => handleTileActivate(element)}
                        onEdit={() => setEditingTile(element)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </SortableContext>
          </DndContext>
        </div>
      </main>

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
