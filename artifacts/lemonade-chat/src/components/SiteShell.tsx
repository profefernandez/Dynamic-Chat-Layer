import React from 'react';
import { ChatLayer } from './ChatLayer';
import { OverlayLayer } from './OverlayLayer';
import { SiteFooter } from './SiteFooter';
import { useAdmin } from '../context/AdminContext';

export function SiteShell() {
  const { editMode } = useAdmin();
  return (
    <div className="relative w-full min-h-[100dvh] overflow-hidden bg-surface">
      {editMode && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[100] px-3 py-1.5 rounded-full bg-primary/15 border border-primary/40 text-primary text-xs uppercase tracking-widest font-label-sm pointer-events-none">
          Admin · editing live
        </div>
      )}
      <ChatLayer />
      <OverlayLayer />
      <SiteFooter />
    </div>
  );
}
