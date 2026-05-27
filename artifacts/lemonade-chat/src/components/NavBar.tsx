import React from 'react';
import { Link, useLocation } from 'wouter';
import { Zap, ChevronDown, ChevronUp } from 'lucide-react';
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
    <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5 bg-background/20 backdrop-blur-md">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="bg-primary/10 p-2 rounded-lg border border-primary/30 group-hover:border-primary/60 transition-colors">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <span className="font-bold text-lg tracking-tight text-white group-hover:text-primary transition-colors">Launch Lemonade</span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {links.map(link => (
          <Link 
            key={link.href} 
            href={link.href}
            className={`text-sm font-medium transition-all ${
              location === link.href 
                ? 'text-primary drop-shadow-[0_0_8px_rgba(204,255,0,0.5)]' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggle}
          className="text-white/60 hover:text-primary hover:bg-primary/10"
        >
          {isOpen ? (
            <span className="flex items-center gap-2">Hide Overlay <ChevronUp className="w-4 h-4" /></span>
          ) : (
            <span className="flex items-center gap-2">Show Overlay <ChevronDown className="w-4 h-4" /></span>
          )}
        </Button>
      </div>
    </nav>
  );
}
