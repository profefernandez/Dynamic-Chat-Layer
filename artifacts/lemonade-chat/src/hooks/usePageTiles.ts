import { useState, useMemo } from 'react';
import {
  useListElements,
  getListElementsQueryKey,
  useCreateElement,
  useUpdateElement,
  useDeleteElement,
  useReorderElements,
  Element,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useChat } from '../context/ChatContext';
import { useAdmin } from '../context/AdminContext';
import { TileDraft } from '../components/TileEditor';

export function usePageTiles(page: string) {
  const { editMode } = useAdmin();
  const queryClient = useQueryClient();
  const { sendMessage, setOverlayOpen } = useChat();

  const queryKey = getListElementsQueryKey({ page });
  const { data: elements, isLoading } = useListElements({ page }, { query: { queryKey } });

  const { mutate: createElement } = useCreateElement();
  const { mutate: updateElement } = useUpdateElement();
  const { mutate: deleteElement } = useDeleteElement();
  const { mutate: reorderElements } = useReorderElements();

  const [editing, setEditing] = useState<Partial<Element> | null>(null);
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

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const activate = (el: Element) => {
    if (el.linkUrl) {
      window.open(el.linkUrl, '_blank', 'noopener,noreferrer');
      setOverlayOpen(false);
      return;
    }
    sendMessage(el.promptText, true);
  };

  const save = (draft: TileDraft) => {
    if (editing?.id) {
      updateElement(
        { id: editing.id, data: draft },
        { onSuccess: () => { invalidate(); setEditing(null); } },
      );
    } else if (creating) {
      createElement(
        { data: { ...draft, page, order: items.length } },
        { onSuccess: () => { invalidate(); setCreating(false); } },
      );
    }
  };

  const remove = () => {
    if (!editing?.id) return;
    deleteElement(
      { id: editing.id },
      { onSuccess: () => { invalidate(); setEditing(null); } },
    );
  };

  const cancel = () => {
    setEditing(null);
    setCreating(false);
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
      { onSuccess: () => { invalidate(); setLocalOrder(null); } },
    );
  };

  return {
    editMode,
    isLoading,
    orderedItems,
    sensors,
    handleDragEnd,
    activate,
    editing,
    creating,
    startEdit: (el: Element) => setEditing(el),
    startCreate: () => setCreating(true),
    save,
    remove,
    cancel,
  };
}
