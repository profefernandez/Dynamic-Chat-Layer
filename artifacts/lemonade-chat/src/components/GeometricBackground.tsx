import React, { useMemo } from 'react';

interface GeometricBackgroundProps {
  className?: string;
}

const W = 1440;
const H = 900;
const COLS = 14;
const ROWS = 9;

function rand(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

export function GeometricBackground({ className = '' }: GeometricBackgroundProps) {
  const { strokes, fills } = useMemo(() => {
    const cw = W / COLS;
    const ch = H / ROWS;

    const pts: { x: number; y: number }[][] = [];
    for (let r = 0; r <= ROWS; r++) {
      const row: { x: number; y: number }[] = [];
      for (let c = 0; c <= COLS; c++) {
        const edge = c === 0 || r === 0 || c === COLS || r === ROWS;
        const jx = edge ? 0 : (rand(c, r) - 0.5) * cw * 0.62;
        const jy = edge ? 0 : (rand(c + 100, r + 100) - 0.5) * ch * 0.62;
        row.push({ x: c * cw + jx, y: r * ch + jy });
      }
      pts.push(row);
    }

    const strokes: string[] = [];
    const fills: string[] = [];

    const tri = (
      a: { x: number; y: number },
      b: { x: number; y: number },
      cc: { x: number; y: number },
      key: number,
    ) => {
      const d = `M${a.x.toFixed(1)} ${a.y.toFixed(1)} L${b.x.toFixed(1)} ${b.y.toFixed(1)} L${cc.x.toFixed(1)} ${cc.y.toFixed(1)} Z`;
      strokes.push(d);
      if (rand(key * 7.3, key * 2.1) < 0.07) fills.push(d);
    };

    let key = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const a = pts[r][c];
        const b = pts[r][c + 1];
        const d = pts[r + 1][c];
        const e = pts[r + 1][c + 1];
        if ((r + c) % 2 === 0) {
          tri(a, b, e, key++);
          tri(a, e, d, key++);
        } else {
          tri(a, b, d, key++);
          tri(b, e, d, key++);
        }
      }
    }

    return { strokes, fills };
  }, []);

  return (
    <svg
      className={className}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{
        WebkitMaskImage:
          'radial-gradient(ellipse 85% 80% at 50% 42%, transparent 0%, transparent 30%, black 100%)',
        maskImage:
          'radial-gradient(ellipse 85% 80% at 50% 42%, transparent 0%, transparent 30%, black 100%)',
      }}
    >
      <g fill="rgba(242,202,80,0.04)" stroke="none">
        {fills.map((d, i) => (
          <path key={`f${i}`} d={d} />
        ))}
      </g>
      <g fill="none" stroke="rgba(242,202,80,0.11)" strokeWidth="0.7">
        {strokes.map((d, i) => (
          <path key={`s${i}`} d={d} />
        ))}
      </g>
    </svg>
  );
}
