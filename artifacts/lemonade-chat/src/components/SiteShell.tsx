import React from 'react';
import { Show } from '@clerk/react';
import { ChatLayer } from './ChatLayer';
import { OverlayLayer } from './OverlayLayer';
import { AdminRail } from './AdminRail';
import { useAdmin } from '../context/AdminContext';
import { AdminUIProvider } from '../context/AdminUIContext';

export function SiteShell() {
  const { editMode } = useAdmin();
  return (
    <AdminUIProvider>
      <div className="relative w-full min-h-[100dvh] overflow-hidden bg-surface">
        {editMode && (
          <Show when="signed-in">
            <AdminRail />
          </Show>
        )}
        <ChatLayer />
        <OverlayLayer />
      </div>
    </AdminUIProvider>
  );
}
