import React, { useState } from 'react';
import { 
  useListElements, getListElementsQueryKey, useCreateElement, useDeleteElement, useUpdateElement,
  useCreateSubElement, useDeleteSubElement, useUpdateSubElement
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Element, SubElement } from '@workspace/api-client-react';

export function Admin() {
  const queryClient = useQueryClient();
  const { data: elements, isLoading } = useListElements({ query: { queryKey: getListElementsQueryKey() } });
  
  const createEl = useCreateElement();
  const updateEl = useUpdateElement();
  const deleteEl = useDeleteElement();
  
  const createSub = useCreateSubElement();
  const updateSub = useUpdateSubElement();
  const deleteSub = useDeleteSubElement();

  const [editingElement, setEditingElement] = useState<Partial<Element> | null>(null);
  const [editingSubElement, setEditingSubElement] = useState<{sub: Partial<SubElement>, parentId: number} | null>(null);

  const handleSaveElement = () => {
    if (!editingElement?.name || !editingElement?.promptText) return;
    
    if (editingElement.id) {
      updateEl.mutate({ 
        id: editingElement.id, 
        data: {
          name: editingElement.name,
          description: editingElement.description,
          promptText: editingElement.promptText,
          photoUrl: editingElement.photoUrl,
          order: editingElement.order
        }
      }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListElementsQueryKey() });
          setEditingElement(null);
        }
      });
    } else {
      createEl.mutate({ 
        data: {
          name: editingElement.name,
          description: editingElement.description,
          promptText: editingElement.promptText,
          photoUrl: editingElement.photoUrl,
          order: editingElement.order || 0
        }
      }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListElementsQueryKey() });
          setEditingElement(null);
        }
      });
    }
  };

  const handleSaveSubElement = () => {
    if (!editingSubElement?.sub.name || !editingSubElement?.sub.promptText || !editingSubElement.parentId) return;
    
    if (editingSubElement.sub.id) {
      updateSub.mutate({ 
        elementId: editingSubElement.parentId,
        id: editingSubElement.sub.id, 
        data: {
          name: editingSubElement.sub.name,
          description: editingSubElement.sub.description,
          promptText: editingSubElement.sub.promptText,
          photoUrl: editingSubElement.sub.photoUrl,
          order: editingSubElement.sub.order
        }
      }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListElementsQueryKey() });
          setEditingSubElement(null);
        }
      });
    } else {
      createSub.mutate({ 
        elementId: editingSubElement.parentId,
        data: {
          name: editingSubElement.sub.name,
          description: editingSubElement.sub.description,
          promptText: editingSubElement.sub.promptText,
          photoUrl: editingSubElement.sub.photoUrl,
          order: editingSubElement.sub.order || 0
        }
      }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListElementsQueryKey() });
          setEditingSubElement(null);
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0f] overflow-y-auto px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Command Center</h1>
            <p className="text-white/50">Manage elements and sub-elements</p>
          </div>
          <Button onClick={() => setEditingElement({ name: '', promptText: '', order: 0 })} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" /> New Element
          </Button>
        </div>

        {editingElement && (
          <div className="bg-white/5 p-6 rounded-2xl border border-primary/30 mb-8 space-y-4">
            <h2 className="text-xl font-bold text-white">{editingElement.id ? 'Edit' : 'New'} Element</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Name" value={editingElement.name || ''} onChange={e => setEditingElement({...editingElement, name: e.target.value})} className="bg-black/50 text-white border-white/10" />
              <Input placeholder="Photo URL" value={editingElement.photoUrl || ''} onChange={e => setEditingElement({...editingElement, photoUrl: e.target.value})} className="bg-black/50 text-white border-white/10" />
              <Input placeholder="Order (number)" type="number" value={editingElement.order || 0} onChange={e => setEditingElement({...editingElement, order: parseInt(e.target.value)})} className="bg-black/50 text-white border-white/10" />
            </div>
            <Textarea placeholder="Description" value={editingElement.description || ''} onChange={e => setEditingElement({...editingElement, description: e.target.value})} className="bg-black/50 text-white border-white/10" />
            <Textarea placeholder="Prompt Text (Sent to AI)" value={editingElement.promptText || ''} onChange={e => setEditingElement({...editingElement, promptText: e.target.value})} className="bg-black/50 text-white border-white/10" />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setEditingElement(null)} className="text-white">Cancel</Button>
              <Button onClick={handleSaveElement} className="bg-primary text-primary-foreground">Save Element</Button>
            </div>
          </div>
        )}

        {editingSubElement && (
          <div className="bg-white/5 p-6 rounded-2xl border border-cyan-500/30 mb-8 space-y-4 ml-8">
            <h2 className="text-xl font-bold text-white">{editingSubElement.sub.id ? 'Edit' : 'New'} Sub-Element</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Name" value={editingSubElement.sub.name || ''} onChange={e => setEditingSubElement({...editingSubElement, sub: {...editingSubElement.sub, name: e.target.value}})} className="bg-black/50 text-white border-white/10" />
              <Input placeholder="Photo URL" value={editingSubElement.sub.photoUrl || ''} onChange={e => setEditingSubElement({...editingSubElement, sub: {...editingSubElement.sub, photoUrl: e.target.value}})} className="bg-black/50 text-white border-white/10" />
              <Input placeholder="Order (number)" type="number" value={editingSubElement.sub.order || 0} onChange={e => setEditingSubElement({...editingSubElement, sub: {...editingSubElement.sub, order: parseInt(e.target.value)}})} className="bg-black/50 text-white border-white/10" />
            </div>
            <Textarea placeholder="Description" value={editingSubElement.sub.description || ''} onChange={e => setEditingSubElement({...editingSubElement, sub: {...editingSubElement.sub, description: e.target.value}})} className="bg-black/50 text-white border-white/10" />
            <Textarea placeholder="Prompt Text (Sent to AI)" value={editingSubElement.sub.promptText || ''} onChange={e => setEditingSubElement({...editingSubElement, sub: {...editingSubElement.sub, promptText: e.target.value}})} className="bg-black/50 text-white border-white/10" />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setEditingSubElement(null)} className="text-white">Cancel</Button>
              <Button onClick={handleSaveSubElement} className="bg-cyan-500 text-black hover:bg-cyan-400">Save Sub-Element</Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <p className="text-white">Loading...</p>
          ) : (
            elements?.map(el => (
              <div key={el.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center text-white/50 text-sm font-mono">{el.order}</div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{el.name}</h3>
                      <p className="text-sm text-white/50">{el.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setEditingSubElement({ sub: { order: 0 }, parentId: el.id })} className="text-white hover:text-cyan-500">
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setEditingElement(el)} className="text-white hover:text-primary">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => {
                      if (confirm('Delete element?')) {
                        deleteEl.mutate({ id: el.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListElementsQueryKey() }) });
                      }
                    }} className="text-white hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {el.subElements && el.subElements.length > 0 && (
                  <div className="mt-4 pl-12 space-y-2 border-l border-white/10 ml-4">
                    {el.subElements.map(sub => (
                      <div key={sub.id} className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="text-xs text-white/30 font-mono">{sub.order}</div>
                          <div>
                            <h4 className="font-semibold text-white/80">{sub.name}</h4>
                            <p className="text-xs text-white/40">{sub.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setEditingSubElement({ sub, parentId: el.id })} className="text-white/60 hover:text-cyan-500 h-8 w-8 p-0">
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => {
                            if (confirm('Delete sub-element?')) {
                              deleteSub.mutate({ elementId: el.id, id: sub.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListElementsQueryKey() }) });
                            }
                          }} className="text-white/60 hover:text-destructive h-8 w-8 p-0">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
