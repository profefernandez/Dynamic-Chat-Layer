import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { TileCardBody, TileVisual } from '../components/TileCardBase';
import { CARD_VISUALS } from './Home';
import { SortableTileCard } from '../components/SortableTileCard';
import { TileEditor } from '../components/TileEditor';
import { EditableText } from '../components/EditableText';
import { EditableImage } from '../components/EditableImage';
import { usePageTiles } from '../hooks/usePageTiles';
import { useContent } from '../context/ContentContext';
import trainingHero from '../assets/training-hero.png';

const VISUAL_SEQUENCE = [0, 3, 1];

export function Training() {
  const tiles = usePageTiles('training');
  const { get, save } = useContent();
  const heroOverride = get('training.heroImage', '');

  return (
    <main className="min-h-full flex flex-col items-center justify-start pt-6 pb-4 relative px-margin-mobile md:px-margin-desktop overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none bg-pattern opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] z-0 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tertiary/10 rounded-full blur-[100px] z-0 pointer-events-none" />

      <div className="z-10 text-center max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-center gap-4 mb-3 opacity-70">
          <div className="h-px w-12 bg-on-surface-variant" />
          <EditableText
            as="span"
            value={get('training.eyebrow', 'Learn With Us')}
            onSave={(v) => save('training.eyebrow', v)}
            className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-on-surface-variant"
          />
          <div className="h-px w-12 bg-on-surface-variant" />
        </div>
        <EditableText
          as="h1"
          value={get('training.title', 'AI Training')}
          onSave={(v) => save('training.title', v)}
          styleKey="style:training.title"
          className="font-headline-xl text-headline-xl text-on-surface leading-tight mb-3"
        />
        <EditableText
          as="p"
          value={get('training.subtitle', 'Plain-language AI lessons, one session at a time.')}
          onSave={(v) => save('training.subtitle', v)}
          styleKey="style:training.subtitle"
          multiline
          className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto block"
        />
      </div>

      <div className="z-10 w-full max-w-2xl mx-auto mb-8">
        <div className="relative rounded-2xl overflow-hidden glass-card p-1.5">
          <EditableImage
            value={heroOverride || null}
            defaultSrc={trainingHero}
            onSave={(url) => save('training.heroImage', url ?? '')}
            alt="Abstract warm amber light and geometric network representing AI learning"
            className="w-full h-24 md:h-28 object-cover rounded-xl"
          />
          <div className="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-t from-surface/70 via-transparent to-transparent" />
        </div>
      </div>

      <div className="z-10 w-full max-w-[1100px] mx-auto">
        <DndContext sensors={tiles.sensors} collisionDetection={closestCenter} onDragEnd={tiles.handleDragEnd}>
          <SortableContext items={tiles.orderedItems.map((it) => it.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {tiles.isLoading
                ? [0, 1, 2].map((i) => (
                    <div key={i} className="glass-card rounded-xl p-6 h-64 animate-pulse" />
                  ))
                : tiles.orderedItems.map((element, index) => {
                    const v = CARD_VISUALS[VISUAL_SEQUENCE[index % VISUAL_SEQUENCE.length]];
                    return (
                      <SortableTileCard
                        key={element.id}
                        id={element.id}
                        editMode={tiles.editMode}
                        hasLink={!!element.linkUrl}
                        hasNudge={!!element.aiGuidance}
                        colSpan={element.colSpan}
                        onActivate={() => tiles.activate(element)}
                        onEdit={() => tiles.startEdit(element)}
                        onDuplicate={() => tiles.duplicate(element)}
                        onResize={(n) => tiles.resize(element, n)}
                        className="glass-card rounded-xl p-5 transition-transform hover:-translate-y-1 duration-300 flex flex-col h-full text-center items-center"
                      >
                        <TileCardBody
                          visual={v as TileVisual}
                          title={element.name}
                          description={element.description ?? ''}
                          imgSrc={element.photoUrl || v.fallbackImg}
                          alt={element.name}
                        />
                      </SortableTileCard>
                    );
                  })}

              {tiles.editMode && (
                <button
                  type="button"
                  onClick={tiles.startCreate}
                  className="glass-card rounded-xl p-6 h-64 z-10 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-primary/30 hover:border-primary/60 hover:-translate-y-1 transition-all text-on-surface-variant hover:text-primary"
                >
                  <Plus className="w-8 h-8" />
                  <span className="font-body-md text-sm">Add tile</span>
                </button>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {(tiles.creating || tiles.editing) && (
        <TileEditor
          initial={tiles.editing}
          onSave={tiles.save}
          onCancel={tiles.cancel}
          onDelete={tiles.editing?.id ? tiles.remove : undefined}
        />
      )}
    </main>
  );
}
