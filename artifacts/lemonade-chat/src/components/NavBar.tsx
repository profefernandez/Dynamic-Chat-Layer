import React from 'react';
import { Link, useLocation } from 'wouter';

interface NavBarProps {
  onToggle: () => void;
  isOpen: boolean;
}

export function NavBar({ onToggle, isOpen }: NavBarProps) {
  const [location] = useLocation();

  const links = [
    { href: '/',         label: 'Training' },
    { href: '/services', label: 'Consultation' },
    { href: '/about',    label: 'Web Dev' },
    { href: '/contact',  label: 'Community' },
  ];

  return (
    <nav className="sticky top-0 left-0 w-full z-50 flex justify-between items-center px-margin-desktop h-20 bg-surface/80 backdrop-blur-xl border-b border-white/10 transition-transform">
      <div className="font-headline-md text-headline-md text-primary">60 Watts of Clarity</div>

      <div className="hidden md:flex items-center gap-8">
        {links.map(link => {
          const active = location === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                active
                  ? 'text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold border-b-2 border-primary pb-1'
                  : 'text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm uppercase tracking-widest hover:bg-white/5 transition-all duration-300 px-3 py-2 rounded-md'
              }
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <button
        onClick={onToggle}
        className="font-label-sm text-label-sm uppercase tracking-widest bg-primary text-on-primary px-6 py-2.5 rounded-full hover:shadow-[0_0_15px_rgba(242,202,80,0.5)] transition-all duration-300 scale-95 active:scale-90"
      >
        Get Started
      </button>
    </nav>
  );
}
