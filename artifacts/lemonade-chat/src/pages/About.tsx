import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { TileCardBody, TileVisual } from '../components/TileCardBase';
import { CARD_VISUALS } from './Home';
import { SortableTileCard } from '../components/SortableTileCard';
import { TileEditor } from '../components/TileEditor';
import { EditableText } from '../components/EditableText';
import { usePageTiles } from '../hooks/usePageTiles';
import { useContent } from '../context/ContentContext';
import { useAdmin } from '../context/AdminContext';

const VISUAL_SEQUENCE = [2, 3];

const PRICING_DEFAULT =
  'Sites start at $500 for a simple build, up to $3,500 for small businesses & organizations, with custom pricing for larger projects. Hosting on our own VPS available.';

export function About() {
  const tiles = usePageTiles('about');
  const { get, save } = useContent();
  const { editMode } = useAdmin();
  const pricingOverride = get('about.pricingNote', '');

  return (
    <main className="min-h-full flex flex-col items-center justify-start pt-6 pb-4 relative px-margin-mobile md:px-margin-desktop overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none bg-pattern opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] z-0 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] z-0 pointer-events-none" />

      <div className="z-10 text-center max-w-4xl mx-auto mb-10">
        <div className="flex items-center justify-center gap-4 mb-3 opacity-70">
          <div className="h-px w-12 bg-on-surface-variant" />
          <EditableText
            as="span"
            value={get('about.eyebrow', 'Website Development & Hosting')}
            onSave={(v) => save('about.eyebrow', v)}
            className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-on-surface-variant"
          />
          <div className="h-px w-12 bg-on-surface-variant" />
        </div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface leading-tight mb-3">
          <EditableText
            as="span"
            value={get('about.titleLead', 'Meet Your New')}
            onSave={(v) => save('about.titleLead', v)}
          />{' '}
          <EditableText
            as="span"
            value={get('about.titleAccent', 'Website Assistant')}
            onSave={(v) => save('about.titleAccent', v)}
            className="text-primary text-glow italic pr-1"
          />
        </h1>
        <EditableText
          as="p"
          value={get('about.subtitle', 'Above the fold, no scrolling — your website begins with a conversation.')}
          onSave={(v) => save('about.subtitle', v)}
          multiline
          className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto block"
        />
      </div>

      <div className="z-10 w-full max-w-4xl mx-auto">
        <DndContext sensors={tiles.sensors} collisionDetection={closestCenter} onDragEnd={tiles.handleDragEnd}>
          <SortableContext items={tiles.orderedItems.map((it) => it.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
              {tiles.isLoading
                ? [0, 1].map((i) => (
                    <div key={i} className="glass-card rounded-xl p-6 h-64 animate-pulse" />
                  ))
                : tiles.orderedItems.map((element, index) => {
                    const v = CARD_VISUALS[VISUAL_SEQUENCE[index % VISUAL_SEQUENCE.length]];
                    const badge =
                      index === 1 ? (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary font-label-sm text-[11px] uppercase tracking-wide px-3 py-0.5 rounded-full z-20 whitespace-nowrap shadow-[0_0_12px_rgba(242,202,80,0.6)]">
                          {get('about.badge', 'Like this website here')}
                        </div>
                      ) : undefined;
                    return (
                      <SortableTileCard
                        key={element.id}
                        id={element.id}
                        editMode={tiles.editMode}
                        hasLink={!!element.linkUrl}
                        hasNudge={!!element.aiGuidance}
                        badge={badge}
                        onActivate={() => tiles.activate(element)}
                        onEdit={() => tiles.startEdit(element)}
                        className="glass-card rounded-xl p-6 transition-transform hover:-translate-y-1 duration-300 flex flex-col h-full text-center items-center"
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
                  className="glass-card rounded-xl p-6 h-64 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-primary/30 hover:border-primary/60 hover:-translate-y-1 transition-all text-on-surface-variant hover:text-primary"
                >
                  <Plus className="w-8 h-8" />
                  <span className="font-body-md text-sm">Add tile</span>
                </button>
              )}
            </div>
          </SortableContext>
        </DndContext>

        {editMode ? (
          <div className="mt-10 max-w-3xl mx-auto text-center">
            <EditableText
              as="p"
              value={pricingOverride || PRICING_DEFAULT}
              onSave={(v) => save('about.pricingNote', v)}
              multiline
              className="font-body-lg text-lg text-on-surface-variant leading-relaxed block"
            />
          </div>
        ) : pricingOverride ? (
          <p className="mt-10 text-center font-body-lg text-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
            {pricingOverride}
          </p>
        ) : (
          <p className="mt-10 text-center font-body-lg text-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
            Sites start at <span className="text-primary font-semibold">$500</span> for a simple build,
            up to <span className="text-primary font-semibold">$3,500</span> for small businesses &amp;
            organizations, with custom pricing for larger projects. Hosting on our own VPS available.
          </p>
        )}
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
