import React from 'react';

function Crystal({ size = 80, glow = 'rgba(242,202,80,0.7)' }: { size?: number; glow?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="crystal-glow"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={`crystal-face-${glow.length}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="55%" stopColor="rgba(242,202,80,0.30)" />
          <stop offset="100%" stopColor="rgba(120,80,20,0.15)" />
        </linearGradient>
      </defs>
      <polygon
        points="50,5 90,30 90,70 50,95 10,70 10,30"
        fill={`url(#crystal-face-${glow.length})`}
        stroke={glow}
        strokeWidth="1.2"
      />
      <polyline
        points="10,30 50,50 90,30"
        fill="none"
        stroke={glow}
        strokeWidth="0.8"
        opacity="0.7"
      />
      <polyline
        points="10,70 50,50 90,70 50,95 50,50"
        fill="none"
        stroke={glow}
        strokeWidth="0.6"
        opacity="0.55"
      />
      <polyline
        points="50,5 50,50"
        fill="none"
        stroke={glow}
        strokeWidth="0.6"
        opacity="0.55"
      />
    </svg>
  );
}

export function CrystalCluster() {
  return (
    <div className="relative w-[300px] h-[300px] pointer-events-none select-none hidden lg:block">
      {/* Connector lines extending outward to tiles */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 300 300"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="cc-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(242,202,80,0.30)" />
            <stop offset="100%" stopColor="rgba(242,202,80,0)" />
          </radialGradient>
          <linearGradient id="cc-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(242,202,80,0)" />
            <stop offset="50%" stopColor="rgba(242,202,80,0.7)" />
            <stop offset="100%" stopColor="rgba(242,202,80,0)" />
          </linearGradient>
        </defs>
        {/* Central halo */}
        <circle cx="150" cy="150" r="140" fill="url(#cc-glow)" />
        {/* Lines radiating outward */}
        <line x1="60" y1="80"  x2="-100" y2="40"  stroke="url(#cc-line)" strokeWidth="1" />
        <line x1="240" y1="80" x2="400"  y2="40"  stroke="url(#cc-line)" strokeWidth="1" />
        <line x1="60" y1="220" x2="-100" y2="260" stroke="url(#cc-line)" strokeWidth="1" />
        <line x1="240" y1="220" x2="400" y2="260" stroke="url(#cc-line)" strokeWidth="1" />
      </svg>

      {/* 2x2 crystal cluster */}
      <div className="absolute inset-0 grid grid-cols-2 gap-3 place-items-center">
        <Crystal size={110} glow="rgba(255,220,140,0.85)" />
        <Crystal size={95}  glow="rgba(230,200,255,0.75)" />
        <Crystal size={95}  glow="rgba(200,210,255,0.70)" />
        <Crystal size={110} glow="rgba(255,220,140,0.85)" />
      </div>
    </div>
  );
}
