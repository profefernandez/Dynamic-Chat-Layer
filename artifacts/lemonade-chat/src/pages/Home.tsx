import React from 'react';
import { useListElements, getListElementsQueryKey } from '@workspace/api-client-react';
import { Tile } from '../components/Tile';
import { Skeleton } from '@/components/ui/skeleton';

export function Home() {
  const { data: elements, isLoading } = useListElements({ query: { queryKey: getListElementsQueryKey() } });

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
      <div className="mb-16">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-6">
          Intelligence,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
            Unbottled.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed">
          Welcome to Launch Lemonade. We blend creative agency thinking with raw AI power. 
          Click a tile below to direct the intelligence engine.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
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
