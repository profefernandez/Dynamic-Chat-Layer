import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export const RAIL_COLLAPSED_WIDTH = 56;
export const RAIL_EXPANDED_WIDTH = 240;
const STORAGE_KEY = 'admin-rail-collapsed';

type AdminUIContextType = {
  collapsed: boolean;
  toggleCollapsed: () => void;
  railWidth: number;
  openMenuLinksToken: number;
  requestMenuLinks: () => void;
  openChatChipsToken: number;
  requestChatChips: () => void;
};

const AdminUIContext = createContext<AdminUIContextType>({
  collapsed: false,
  toggleCollapsed: () => {},
  railWidth: RAIL_EXPANDED_WIDTH,
  openMenuLinksToken: 0,
  requestMenuLinks: () => {},
  openChatChipsToken: 0,
  requestChatChips: () => {},
});

export function AdminUIProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [openMenuLinksToken, setMenuToken] = useState(0);
  const [openChatChipsToken, setChipsToken] = useState(0);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((c) => {
      const next = !c;
      try {
        sessionStorage.setItem(STORAGE_KEY, next ? '1' : '0');
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const requestMenuLinks = useCallback(() => setMenuToken((t) => t + 1), []);
  const requestChatChips = useCallback(() => setChipsToken((t) => t + 1), []);

  const railWidth = collapsed ? RAIL_COLLAPSED_WIDTH : RAIL_EXPANDED_WIDTH;

  return (
    <AdminUIContext.Provider
      value={{
        collapsed,
        toggleCollapsed,
        railWidth,
        openMenuLinksToken,
        requestMenuLinks,
        openChatChipsToken,
        requestChatChips,
      }}
    >
      {children}
    </AdminUIContext.Provider>
  );
}

export function useAdminUI() {
  return useContext(AdminUIContext);
}
