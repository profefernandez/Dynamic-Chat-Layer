import React from 'react';

export function ConnectorLines({ count }: { count: number }) {
  if (count < 2) return null;

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.35 }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(201,151,58,0)" />
          <stop offset="50%" stopColor="rgba(201,151,58,0.7)" />
          <stop offset="100%" stopColor="rgba(201,151,58,0)" />
        </linearGradient>
        <linearGradient id="lineGradV" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(201,151,58,0)" />
          <stop offset="50%" stopColor="rgba(201,151,58,0.7)" />
          <stop offset="100%" stopColor="rgba(201,151,58,0)" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Horizontal center line */}
      <line
        x1="25%" y1="50%" x2="75%" y2="50%"
        stroke="url(#lineGrad)"
        strokeWidth="1"
        filter="url(#glow)"
      />
      {/* Vertical center line */}
      <line
        x1="50%" y1="25%" x2="50%" y2="75%"
        stroke="url(#lineGradV)"
        strokeWidth="1"
        filter="url(#glow)"
      />
      {/* Center dot */}
      <circle cx="50%" cy="50%" r="3" fill="rgba(201,151,58,0.6)" filter="url(#glow)" />
      <circle cx="25%" cy="25%" r="2" fill="rgba(201,151,58,0.4)" />
      <circle cx="75%" cy="25%" r="2" fill="rgba(201,151,58,0.4)" />
      <circle cx="25%" cy="75%" r="2" fill="rgba(201,151,58,0.4)" />
      <circle cx="75%" cy="75%" r="2" fill="rgba(201,151,58,0.4)" />
    </svg>
  );
}
