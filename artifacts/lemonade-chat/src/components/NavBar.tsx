import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Show, useClerk, useUser } from '@clerk/react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../context/ChatContext';

export function NavBar() {
  const [location] = useLocation();
  const { signOut } = useClerk();
  const { user } = useUser();
  const { setOverlayOpen } = useChat();
  const [menuOpen, setMenuOpen] = useState(false);
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

  const links = [
    { href: '/',         label: 'Home' },
    { href: '/training', label: 'Training' },
    { href: '/services', label: 'Consultation' },
    { href: '/about',    label: 'Websites' },
    { href: '/contact',  label: 'Partners' },
  ];

  const toggleMenu = () => {
    setOverlayOpen(true);
    setMenuOpen(o => !o);
  };

  const handleNav = () => {
    setOverlayOpen(true);
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 left-0 w-full z-50 flex justify-between items-center px-margin-desktop h-14 bg-surface/70 backdrop-blur-xl border-b border-white/10">
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
              className="absolute top-full left-margin-desktop mt-3 z-50 w-64 rounded-2xl p-2 shadow-2xl"
              style={{
                background: 'rgba(24, 25, 29, 0.98)',
                border: '1px solid rgba(242, 202, 80, 0.22)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {links.map(link => {
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
