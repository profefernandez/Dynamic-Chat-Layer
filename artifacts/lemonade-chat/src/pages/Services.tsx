import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { CARD_VISUALS } from './Home';
import { SortableTileCard } from '../components/SortableTileCard';
import { TileEditor } from '../components/TileEditor';
import { EditableText } from '../components/EditableText';
import { EditableImage } from '../components/EditableImage';
import { usePageTiles } from '../hooks/usePageTiles';
import { useContent } from '../context/ContentContext';
import consultantPortrait from '@assets/Screenshot_2026-04-08_115516_1780005621317.png';

const VISUAL_SEQUENCE = [3, 0, 2];

function TileCardImageIcon({
  visual,
  imgSrc,
  alt,
}: {
  visual: typeof CARD_VISUALS[number];
  imgSrc: string;
  alt: string;
}) {
  return (
    <div className="h-20 w-20 relative flex items-center justify-center">
      <div
        className={`absolute inset-0 ${visual.glowClass} rounded-full blur-xl ${visual.glowHoverClass} transition-colors`}
      />
      <img
        alt={alt}
        src={imgSrc}
        className={`w-16 h-16 object-cover rounded-full border ${visual.imgBorderClass} z-10 opacity-80 mix-blend-screen ${visual.imgShadowClass}`}
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          if (visual.fallbackImg && img.src !== visual.fallbackImg) img.src = visual.fallbackImg;
        }}
      />
      <span
        className={`material-symbols-outlined absolute ${visual.iconColorClass} text-2xl z-20 mix-blend-screen`}
      >
        {visual.icon}
      </span>
    </div>
  );
}

export function Services() {
  const tiles = usePageTiles('services');
  const { get, save } = useContent();
  const portraitOverride = get('services.portrait', '');

  return (
    <main className="min-h-full flex flex-col items-center justify-start pt-6 pb-4 relative px-margin-mobile md:px-margin-desktop overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none bg-pattern opacity-50" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] z-0 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#bfa0ff]/10 rounded-full blur-[100px] z-0 pointer-events-none" />

      <div className="z-10 text-center max-w-4xl mx-auto mb-10">
        <div className="flex items-center justify-center gap-4 mb-3 opacity-70">
          <div className="h-px w-12 bg-on-surface-variant" />
          <EditableText
            as="span"
            value={get('services.eyebrow', 'Advisory & Strategy')}
            onSave={(v) => save('services.eyebrow', v)}
            className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-on-surface-variant"
          />
          <div className="h-px w-12 bg-on-surface-variant" />
        </div>
        <EditableText
          as="h1"
          value={get('services.title', 'AI Consultation')}
          onSave={(v) => save('services.title', v)}
          className="font-headline-xl text-headline-xl text-on-surface leading-tight mb-3"
        />
      </div>

      <div className="z-10 w-full max-w-[1280px] mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* LEFT — consultant image */}
        <div className="w-full lg:w-[38%] flex-shrink-0 flex flex-col items-center">
          <div className="relative w-full max-w-[360px]">
            <div className="absolute -inset-3 bg-primary/15 rounded-3xl blur-2xl" />
            <EditableImage
              value={portraitOverride || null}
              defaultSrc={consultantPortrait}
              onSave={(url) => save('services.portrait', url ?? '')}
              alt="Portrait of the lead AI consultant"
              className="relative w-full h-[300px] lg:h-[440px] object-cover rounded-3xl border border-primary/25 shadow-[0_0_40px_rgba(242,202,80,0.18)]"
            />
          </div>
        </div>

        {/* RIGHT — consultation cards */}
        <div className="w-full lg:w-[62%] flex flex-col gap-6">
          <DndContext sensors={tiles.sensors} collisionDetection={closestCenter} onDragEnd={tiles.handleDragEnd}>
            <SortableContext items={tiles.orderedItems.map((it) => it.id)} strategy={verticalListSortingStrategy}>
              {tiles.isLoading
                ? [0, 1, 2].map((i) => (
                    <div key={i} className="glass-card rounded-xl p-5 h-28 animate-pulse" />
                  ))
                : tiles.orderedItems.map((element, index) => {
                    const v = CARD_VISUALS[VISUAL_SEQUENCE[index % VISUAL_SEQUENCE.length]];
                    return (
                      <SortableTileCard
                        key={element.id}
                        id={element.id}
                        editMode={tiles.editMode}
                        hasLink={!!element.linkUrl}
                        onActivate={() => tiles.activate(element)}
                        onEdit={() => tiles.startEdit(element)}
                        className="glass-card rounded-xl p-5 transition-transform hover:translate-x-1.5 duration-300 flex flex-row items-center gap-5 text-left"
                      >
                        <div className="flex-shrink-0">
                          <TileCardImageIcon visual={v} imgSrc={element.photoUrl || v.fallbackImg!} alt={element.name} />
                        </div>
                        <div className="flex flex-col">
                          <h3 className="font-body-lg text-xl text-white font-semibold mb-1">{element.name}</h3>
                          <p className="font-body-md text-sm text-on-surface-variant">{element.description}</p>
                        </div>
                      </SortableTileCard>
                    );
                  })}

              {tiles.editMode && (
                <button
                  type="button"
                  onClick={tiles.startCreate}
                  className="glass-card rounded-xl p-5 h-24 flex items-center justify-center gap-3 border-2 border-dashed border-primary/30 hover:border-primary/60 transition-all text-on-surface-variant hover:text-primary"
                >
                  <Plus className="w-6 h-6" />
                  <span className="font-body-md text-sm">Add tile</span>
                </button>
              )}
            </SortableContext>
          </DndContext>
        </div>
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
