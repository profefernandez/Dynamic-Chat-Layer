import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Show, useClerk, useUser } from '@clerk/react';
import { Menu, X, Pencil, Trash2, Plus, Check, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../context/ChatContext';
import { useAdmin } from '../context/AdminContext';
import { useAdminUI } from '../context/AdminUIContext';
import {
  useGetSiteSettings,
  useUpdateSiteSettings,
  getGetSiteSettingsQueryKey,
  NavLink,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';

const DEFAULT_LINKS: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/training', label: 'Training' },
  { href: '/services', label: 'Consultation' },
  { href: '/about', label: 'Websites' },
  { href: '/contact', label: 'Partners' },
];

export function NavBar() {
  const [location] = useLocation();
  const { signOut } = useClerk();
  const { user } = useUser();
  const { setOverlayOpen } = useChat();
  const { editMode } = useAdmin();
  const { openMenuLinksToken } = useAdminUI();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingLinks, setEditingLinks] = useState(false);
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

  const queryClient = useQueryClient();
  const { data: settings } = useGetSiteSettings();
  const { mutate: updateSettings } = useUpdateSiteSettings();

  const links: NavLink[] = settings?.navLinks?.length ? settings.navLinks : DEFAULT_LINKS;
  const [draftLinks, setDraftLinks] = useState<NavLink[]>(links);

  const openLinkEditor = () => {
    setDraftLinks(links);
    setEditingLinks(true);
  };

  const saveLinks = () => {
    updateSettings(
      { data: { navLinks: draftLinks } },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetSiteSettingsQueryKey() }) },
    );
    setEditingLinks(false);
  };

  const toggleMenu = () => {
    setOverlayOpen(true);
    setMenuOpen((o) => !o);
  };

  const handleNav = () => {
    setOverlayOpen(true);
    setMenuOpen(false);
  };

  useEffect(() => {
    if (openMenuLinksToken > 0) {
      setMenuOpen(true);
      setDraftLinks(links);
      setEditingLinks(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openMenuLinksToken]);

  return (
    <nav className="sticky top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-14 bg-surface/70 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center">
        <button
          onClick={toggleMenu}
          aria-label="Menu"
          aria-expanded={menuOpen}
          className="h-9 w-9 rounded-lg flex items-center justify-center text-on-surface hover:text-primary transition-colors"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      <Show when="signed-in">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            onClick={handleNav}
            className="hidden sm:inline-block font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary px-3 py-2 rounded-md transition-colors"
            title={user?.primaryEmailAddress?.emailAddress ?? 'Admin'}
          >
            Admin
          </Link>
          <button
            onClick={() => signOut({ redirectUrl: basePath || '/' })}
            className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary px-3 py-2 rounded-md transition-colors"
          >
            Sign Out
          </button>
        </div>
      </Show>

      <AnimatePresence>
        {menuOpen && (
          <>
            <button
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 cursor-default"
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute top-full left-margin-mobile md:left-margin-desktop mt-3 z-50 w-72 max-w-[calc(100vw-2.5rem)] rounded-2xl p-2 shadow-2xl"
              style={{
                background: 'rgba(24, 25, 29, 0.98)',
                border: '1px solid rgba(242, 202, 80, 0.22)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {editMode && editingLinks ? (
                <div className="p-1 space-y-2">
                  {draftLinks.map((link, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="flex flex-col">
                        <button
                          type="button"
                          disabled={i === 0}
                          onClick={() => {
                            if (i === 0) return;
                            const next = [...draftLinks];
                            [next[i - 1], next[i]] = [next[i], next[i - 1]];
                            setDraftLinks(next);
                          }}
                          className="text-on-surface-variant hover:text-primary disabled:opacity-30 disabled:hover:text-on-surface-variant"
                          title="Move up"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={i === draftLinks.length - 1}
                          onClick={() => {
                            if (i === draftLinks.length - 1) return;
                            const next = [...draftLinks];
                            [next[i + 1], next[i]] = [next[i], next[i + 1]];
                            setDraftLinks(next);
                          }}
                          className="text-on-surface-variant hover:text-primary disabled:opacity-30 disabled:hover:text-on-surface-variant"
                          title="Move down"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                      <input
                        value={link.label}
                        onChange={(e) =>
                          setDraftLinks(draftLinks.map((l, j) => (j === i ? { ...l, label: e.target.value } : l)))
                        }
                        placeholder="Label"
                        className="w-1/3 bg-[#121317] border border-white/10 rounded px-2 py-1 text-xs text-on-surface"
                      />
                      <input
                        value={link.href}
                        onChange={(e) =>
                          setDraftLinks(draftLinks.map((l, j) => (j === i ? { ...l, href: e.target.value } : l)))
                        }
                        placeholder="/path"
                        className="flex-1 bg-[#121317] border border-white/10 rounded px-2 py-1 text-xs text-on-surface"
                      />
                      <button
                        onClick={() => setDraftLinks(draftLinks.filter((_, j) => j !== i))}
                        className="text-on-surface-variant hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setDraftLinks([...draftLinks, { label: 'New', href: '/' }])}
                    className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary px-2 py-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add link
                  </button>
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-white/10">
                    <button
                      onClick={() => setEditingLinks(false)}
                      className="text-xs text-on-surface-variant hover:text-on-surface px-2 py-1"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveLinks}
                      className="flex items-center gap-1 text-xs bg-primary text-on-primary rounded px-2 py-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {links.map((link) => {
                    const active = location === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={handleNav}
                        className={
                          active
                            ? 'block px-4 py-2.5 rounded-xl font-label-sm text-label-sm uppercase tracking-widest text-primary bg-primary/10 font-bold'
                            : 'block px-4 py-2.5 rounded-xl font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary hover:bg-white/5 transition-colors'
                        }
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                  {editMode && (
                    <button
                      onClick={openLinkEditor}
                      className="flex items-center gap-1.5 w-full px-4 py-2.5 mt-1 rounded-xl font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary hover:bg-white/5 transition-colors border-t border-white/10"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit menu links
                    </button>
                  )}
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
