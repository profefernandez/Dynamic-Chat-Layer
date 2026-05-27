import React from 'react';
import { useChat } from '../context/ChatContext';
import { motion, AnimatePresence } from 'framer-motion';
import { NavBar } from './NavBar';
import { Switch, Route, useLocation } from 'wouter';
import { Home } from '../pages/Home';
import { Services } from '../pages/Services';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';

export function OverlayLayer() {
  const { isOverlayOpen, setOverlayOpen } = useChat();
  const [location] = useLocation();

  return (
    <AnimatePresence>
      <motion.div
        initial={false}
        animate={{
          y: isOverlayOpen ? 0 : '-72%',
          opacity: isOverlayOpen ? 1 : 0.35,
          scale: isOverlayOpen ? 1 : 0.97,
        }}
        transition={{ type: 'spring', bounce: 0, duration: 0.55 }}
        className="fixed top-0 left-0 right-0 bottom-24 z-10 origin-top pointer-events-none"
      >
        <div
          className="absolute inset-0 shadow-2xl overflow-hidden pointer-events-auto flex flex-col blue-rim-glow"
          style={{
            background: 'rgba(13, 11, 8, 0.86)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(201, 151, 58, 0.15)',
          }}
        >
          <NavBar onToggle={() => setOverlayOpen(!isOverlayOpen)} isOpen={isOverlayOpen} />

          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.28 }}
                className="min-h-full"
              >
                <Switch>
                  <Route path="/" component={Home} />
                  <Route path="/services" component={Services} />
                  <Route path="/about" component={About} />
                  <Route path="/contact" component={Contact} />
                </Switch>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
