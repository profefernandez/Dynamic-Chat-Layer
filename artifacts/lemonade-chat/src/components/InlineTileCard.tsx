import React from 'react';
import { Element } from '@workspace/api-client-react';
import { Sparkles } from 'lucide-react';

export function InlineTileCard({ element }: { element: Element }) {
  return (
    <div
      role="group"
      aria-label={`You selected service: ${element.name}`}
      className="glass-card rounded-xl p-4 border border-primary/30 max-w-sm w-full"
    >
      <div className="flex items-center gap-1.5 mb-2 text-[10px] uppercase tracking-wider text-primary/80">
        <Sparkles className="w-3 h-3" /> Selected service
      </div>
      <div className="flex items-start gap-3">
        {element.photoUrl && (
          <img
            src={element.photoUrl}
            alt={element.name}
            className="w-14 h-14 rounded-lg object-cover border border-primary/20 shrink-0"
          />
        )}
        <div className="min-w-0">
          <h4 className="text-on-surface font-semibold text-sm leading-tight">{element.name}</h4>
          {element.description && (
            <p className="text-on-surface-variant text-xs mt-1 leading-relaxed">{element.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
