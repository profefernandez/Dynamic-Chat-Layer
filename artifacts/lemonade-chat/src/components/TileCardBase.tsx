import React from 'react';

export type TileVisual = {
  glowClass: string;
  glowHoverClass: string;
  imgBorderClass: string;
  imgShadowClass: string;
  iconColorClass: string;
  icon: string;
  fallbackImg?: string;
};

export function TileCardBody({
  visual,
  title,
  description,
  imgSrc,
  alt,
  footer,
  compact = false,
}: {
  visual: TileVisual;
  title: string;
  description: string;
  imgSrc?: string;
  alt?: string;
  footer?: React.ReactNode;
  compact?: boolean;
}) {
  const blockH = compact ? 'h-16' : 'h-24';
  const imgWH = compact ? 'w-14 h-14' : 'w-20 h-20';
  const iconSize = compact ? 'text-2xl' : 'text-3xl';
  const titleSize = compact ? 'text-lg mb-1' : 'text-xl mb-2';
  const descSize = compact ? 'text-sm' : 'text-base';
  const blockMb = compact ? 'mb-2' : 'mb-3';
  return (
    <>
      <div className={`${blockH} w-full ${blockMb} relative flex items-center justify-center`}>
        <div
          className={`absolute inset-0 ${visual.glowClass} rounded-full blur-xl ${visual.glowHoverClass} transition-colors`}
        />
        {imgSrc ? (
          <img
            alt={alt ?? title}
            className={`${imgWH} object-cover rounded-full border ${visual.imgBorderClass} z-10 opacity-80 mix-blend-screen ${visual.imgShadowClass}`}
            src={imgSrc}
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              if (visual.fallbackImg && img.src !== visual.fallbackImg) img.src = visual.fallbackImg;
            }}
          />
        ) : (
          <div
            className={`${imgWH} rounded-full border ${visual.imgBorderClass} z-10 ${visual.imgShadowClass} bg-surface/40`}
          />
        )}
        <span
          className={`material-symbols-outlined absolute ${visual.iconColorClass} ${iconSize} z-20 mix-blend-screen`}
        >
          {visual.icon}
        </span>
      </div>
      <h3 className={`font-body-lg ${titleSize} text-white font-semibold`}>{title}</h3>
      <p className={`font-body-md ${descSize} text-on-surface-variant flex-grow`}>{description}</p>
      {footer}
    </>
  );
}
