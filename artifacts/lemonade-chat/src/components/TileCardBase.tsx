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
}: {
  visual: TileVisual;
  title: string;
  description: string;
  imgSrc?: string;
  alt?: string;
  footer?: React.ReactNode;
}) {
  return (
    <>
      <div className="h-24 w-full mb-3 relative flex items-center justify-center">
        <div
          className={`absolute inset-0 ${visual.glowClass} rounded-full blur-xl ${visual.glowHoverClass} transition-colors`}
        />
        {imgSrc ? (
          <img
            alt={alt ?? title}
            className={`w-20 h-20 object-cover rounded-full border ${visual.imgBorderClass} z-10 opacity-80 mix-blend-screen ${visual.imgShadowClass}`}
            src={imgSrc}
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              if (visual.fallbackImg && img.src !== visual.fallbackImg) img.src = visual.fallbackImg;
            }}
          />
        ) : (
          <div
            className={`w-20 h-20 rounded-full border ${visual.imgBorderClass} z-10 ${visual.imgShadowClass} bg-surface/40`}
          />
        )}
        <span
          className={`material-symbols-outlined absolute ${visual.iconColorClass} text-3xl z-20 mix-blend-screen`}
        >
          {visual.icon}
        </span>
      </div>
      <h3 className="font-body-lg text-xl text-white font-semibold mb-2">{title}</h3>
      <p className="font-body-md text-base text-on-surface-variant flex-grow">{description}</p>
      {footer}
    </>
  );
}
