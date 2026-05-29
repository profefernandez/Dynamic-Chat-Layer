import React from 'react';
import { Link, useLocation } from 'wouter';
import { useClerk } from '@clerk/react';
import {
  PanelLeftClose,
  PanelLeftOpen,
  Home as HomeIcon,
  GraduationCap,
  Briefcase,
  Globe,
  HeartHandshake,
  ListTree,
  MessageSquareText,
  Type,
  PanelBottom,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAdminUI } from '../context/AdminUIContext';

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

const PAGES = [
  { label: 'Home', path: '/admin', icon: HomeIcon },
  { label: 'Training', path: '/admin/training', icon: GraduationCap },
  { label: 'Consultation', path: '/admin/services', icon: Briefcase },
  { label: 'Websites', path: '/admin/about', icon: Globe },
  { label: 'Partners', path: '/admin/contact', icon: HeartHandshake },
];

export function AdminRail() {
  const [location] = useLocation();
  const { collapsed, toggleCollapsed, railWidth, requestMenuLinks, requestChatChips } = useAdminUI();
  const { setOverlayOpen } = useChat();
  const { signOut } = useClerk();

  const openHero = () => {
    setOverlayOpen(true);
    requestAnimationFrame(() => {
      const el = document.querySelector('[data-overlay-scroll]');
      el?.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const openFooter = () => {
    setOverlayOpen(true);
    setTimeout(() => {
      document.getElementById('admin-footer')?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 60);
  };

  const openMenuLinks = () => {
    setOverlayOpen(true);
    requestMenuLinks();
  };

  const openChatChips = () => {
    requestChatChips();
  };

  const viewLive = () =>
    window.open(`${window.location.origin}${basePath}/`, '_blank', 'noopener,noreferrer');

  const SHORTCUTS = [
    { label: 'Menu links', icon: ListTree, onClick: openMenuLinks },
    { label: 'Chat chips', icon: MessageSquareText, onClick: openChatChips },
    { label: 'Hero', icon: Type, onClick: openHero },
    { label: 'Footer', icon: PanelBottom, onClick: openFooter },
  ];

  return (
    <aside
      className="fixed top-0 left-0 bottom-0 z-[120] flex flex-col bg-[#15161a] border-r border-white/10 transition-[width] duration-300 ease-out"
      style={{ width: railWidth }}
    >
      {/* Header: status + collapse toggle */}
      <div className="flex items-center gap-2 h-14 px-3 border-b border-white/10 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(242,202,80,0.8)] animate-pulse shrink-0" />
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-primary truncate">
              Admin · editing live
            </span>
          </div>
        )}
        {collapsed && (
          <span
            className="h-2 w-2 mx-auto rounded-full bg-primary shadow-[0_0_8px_rgba(242,202,80,0.8)] animate-pulse"
            title="Admin · editing live"
          />
        )}
        <button
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expand panel' : 'Collapse panel'}
          title={collapsed ? 'Expand panel' : 'Collapse panel'}
          className="h-8 w-8 shrink-0 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-white/5 transition-colors"
        >
          {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 flex flex-col gap-1">
        {/* Page navigation */}
        {!collapsed && (
          <p className="px-4 pt-1 pb-2 text-[10px] uppercase tracking-widest text-on-surface-variant/60">
            Pages
          </p>
        )}
        {PAGES.map((p) => {
          const Icon = p.icon;
          const active = location === p.path;
          return (
            <Link
              key={p.path}
              href={p.path}
              onClick={() => setOverlayOpen(true)}
              title={p.label}
              className={[
                'mx-2 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                collapsed ? 'justify-center' : '',
                active
                  ? 'bg-primary/15 text-primary'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5',
              ].join(' ')}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && (
                <span className="font-body-md text-sm truncate">{p.label}</span>
              )}
            </Link>
          );
        })}

        <div className="my-2 mx-3 border-t border-white/10" />

        {/* Quick edit shortcuts */}
        {!collapsed && (
          <p className="px-4 pt-1 pb-2 text-[10px] uppercase tracking-widest text-on-surface-variant/60">
            Quick edits
          </p>
        )}
        {SHORTCUTS.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.label}
              onClick={s.onClick}
              title={s.label}
              className={[
                'mx-2 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left',
                collapsed ? 'justify-center' : '',
                'text-on-surface-variant hover:text-on-surface hover:bg-white/5',
              ].join(' ')}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="font-body-md text-sm truncate">{s.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="border-t border-white/10 py-3 flex flex-col gap-1 shrink-0">
        <button
          onClick={viewLive}
          title="View live site"
          className={[
            'mx-2 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
            collapsed ? 'justify-center' : '',
            'text-on-surface-variant hover:text-primary hover:bg-white/5',
          ].join(' ')}
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="font-body-md text-sm truncate">View live site</span>}
        </button>
        <button
          onClick={() => signOut({ redirectUrl: basePath || '/' })}
          title="Sign out"
          className={[
            'mx-2 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
            collapsed ? 'justify-center' : '',
            'text-on-surface-variant hover:text-red-400 hover:bg-white/5',
          ].join(' ')}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="font-body-md text-sm truncate">Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
