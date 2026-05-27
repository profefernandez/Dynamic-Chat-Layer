import React from 'react';
import { Link, useLocation } from 'wouter';

export function NavBar({ onToggle, isOpen }: { onToggle: () => void; isOpen: boolean }) {
  const [location] = useLocation();

  const links = [
    { href: '/',           label: 'Training' },
    { href: '/services',   label: 'Consultation' },
    { href: '/about',      label: 'Web Dev' },
    { href: '/contact',    label: 'Community' },
  ];

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-margin-desktop h-20 bg-surface/80 backdrop-blur-xl border-b border-white/10 transition-transform">
      <div className="font-headline-md text-headline-md text-primary">
        60 Watts of Clarity
      </div>

      <div className="hidden md:flex items-center gap-8">
        {links.map(link => {
          const active = location === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={[
                'font-label-sm text-label-sm uppercase tracking-widest transition-colors',
                active
                  ? 'text-primary font-bold border-b-2 border-primary pb-1'
                  : 'text-on-surface-variant hover:text-primary hover:bg-white/5 px-3 py-2 rounded-md transition-all duration-300',
              ].join(' ')}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <button
        onClick={onToggle}
        className="font-label-sm text-label-sm uppercase tracking-widest bg-primary text-on-primary px-6 py-2.5 rounded-full hover:shadow-[0_0_15px_rgba(242,202,80,0.5)] transition-all duration-300 active:scale-90 scale-95"
      >
        {isOpen ? 'Hide' : 'Get Started'}
      </button>
    </nav>
  );
}
