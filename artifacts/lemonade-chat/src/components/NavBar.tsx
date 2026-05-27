import React from 'react';
import { Link, useLocation } from 'wouter';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NavBar({ onToggle, isOpen }: { onToggle: () => void; isOpen: boolean }) {
  const [location] = useLocation();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-[rgba(201,151,58,0.12)] bg-[rgba(13,11,8,0.90)] backdrop-blur-md">
      <Link href="/" className="flex items-center gap-3 group">
        <div
          className="w-8 h-8 rounded-sm flex items-center justify-center text-xs font-black"
          style={{
            background: 'radial-gradient(circle at 35% 30%, rgba(224,176,80,0.9), rgba(160,100,20,0.7) 50%, rgba(80,50,10,0.4))',
            boxShadow: '0 0 12px rgba(201,151,58,0.5)',
          }}
        >
          <span className="text-[#0d0b08]">60</span>
        </div>
        <span className="font-bold text-base tracking-tight text-[#f0ece0] group-hover:text-[#c9973a] transition-colors">
          60 Watts of Clarity
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium transition-all ${
              location === link.href
                ? 'text-[#c9973a] drop-shadow-[0_0_8px_rgba(201,151,58,0.5)]'
                : 'text-[#8a7f6e] hover:text-[#f0ece0]'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="text-[#8a7f6e] hover:text-[#c9973a] hover:bg-[rgba(201,151,58,0.08)] text-xs"
      >
        {isOpen ? (
          <span className="flex items-center gap-1.5">Hide Overlay <ChevronUp className="w-3.5 h-3.5" /></span>
        ) : (
          <span className="flex items-center gap-1.5">Show Overlay <ChevronDown className="w-3.5 h-3.5" /></span>
        )}
      </Button>
    </nav>
  );
}
