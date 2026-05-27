import React from 'react';
import { useListElements, getListElementsQueryKey } from '@workspace/api-client-react';
import { Tile } from '../components/Tile';
import { Skeleton } from '@/components/ui/skeleton';
import { GemIcon } from '../components/GemIcon';
import { ConnectorLines } from '../components/ConnectorLines';

export function Home() {
  const { data: elements, isLoading } = useListElements({ query: { queryKey: getListElementsQueryKey() } });

  return (
    <div className="w-full px-6 py-10 md:py-16 max-w-6xl mx-auto">
      {/* Hero header */}
      <div className="text-center mb-12">
        <p className="text-xs md:text-sm tracking-[0.25em] uppercase text-[#8a7f6e] mb-4 font-medium">
          AI Literacy Education and Development
        </p>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-5">
          <span className="text-[#f0ece0]">60 Watts of </span>
          <span className="text-gold-gradient">Clarity</span>
        </h1>

        <p className="text-xs md:text-sm text-[#5a5040] tracking-widest uppercase">
          Licensed Social Worker&nbsp;&nbsp;·&nbsp;&nbsp;AI Consultant&nbsp;&nbsp;·&nbsp;&nbsp;Educator&nbsp;&nbsp;·&nbsp;&nbsp;Website Designer
        </p>
      </div>

      {/* Service tiles with gem icons between them */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" style={{ background: 'rgba(201,151,58,0.06)' }} />
          ))}
        </div>
      ) : (
        <div className="relative mt-4">
          {/* Gem network — decorative center connector */}
          <div className="hidden md:block absolute inset-0 pointer-events-none z-0">
            <ConnectorLines count={elements?.length ?? 4} />
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {elements?.map((element, index) => (
              <Tile key={element.id} element={element} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
