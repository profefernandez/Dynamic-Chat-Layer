import React from 'react';
import { useListElements, getListElementsQueryKey } from '@workspace/api-client-react';
import { Tile } from '../components/Tile';
import { Skeleton } from '@/components/ui/skeleton';

export function Services() {
  const { data: elements, isLoading } = useListElements({ query: { queryKey: getListElementsQueryKey() } });

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Capabilities
        </h1>
        <p className="text-lg text-white/60 max-w-2xl">
          Explore our suite of AI-driven capabilities. Select an area to consult the engine.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {elements?.map(element => (
            <Tile key={element.id} element={element} />
          ))}
        </div>
      )}
    </div>
  );
}
