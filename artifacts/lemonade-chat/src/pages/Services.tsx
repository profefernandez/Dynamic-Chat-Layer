import React from 'react';
import { useListElements, getListElementsQueryKey } from '@workspace/api-client-react';
import { Tile } from '../components/Tile';
import { Skeleton } from '@/components/ui/skeleton';

export function Services() {
  const { data: elements, isLoading } = useListElements({ query: { queryKey: getListElementsQueryKey() } });

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
      <div className="mb-10">
        <p className="text-xs tracking-[0.2em] uppercase text-[#8a7f6e] mb-3">What We Offer</p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#f0ece0] mb-3">
          Services
        </h1>
        <p className="text-base text-[#8a7f6e] max-w-xl">
          Select any service below to open a guided AI conversation — or explore the sub-services within each.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" style={{ background: 'rgba(201,151,58,0.06)' }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {elements?.map((element, index) => (
            <Tile key={element.id} element={element} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
