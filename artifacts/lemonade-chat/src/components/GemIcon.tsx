import React from 'react';

interface GemIconProps {
  size?: number;
  icon?: React.ReactNode;
  className?: string;
}

export function GemIcon({ size = 52, icon, className = '' }: GemIconProps) {
  return (
    <div
      className={`flex items-center justify-center shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        clipPath: 'polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)',
        background: 'radial-gradient(circle at 35% 30%, rgba(240,190,90,0.95), rgba(180,110,25,0.85) 50%, rgba(90,55,10,0.6) 100%)',
        boxShadow: '0 0 24px rgba(201,151,58,0.55), 0 0 60px rgba(201,151,58,0.18)',
        filter: 'drop-shadow(0 0 12px rgba(201,151,58,0.5))',
      }}
    >
      <div className="text-[#0d0b08]" style={{ fontSize: size * 0.36 }}>
        {icon}
      </div>
    </div>
  );
}
