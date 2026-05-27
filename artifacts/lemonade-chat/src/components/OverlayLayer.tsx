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
          y: isOverlayOpen ? 0 : '-70%',
          opacity: isOverlayOpen ? 1 : 0.4,
          scale: isOverlayOpen ? 1 : 0.95
        }}
        transition={{ type: 'spring', bounce: 0, duration: 0.6 }}
        className="fixed top-0 left-0 right-0 bottom-24 z-10 origin-top pointer-events-none"
      >
        <div className="absolute inset-0 glass-panel shadow-2xl overflow-hidden pointer-events-auto flex flex-col border-b border-primary/20 bg-[#0a0a14]/85">
          <NavBar onToggle={() => setOverlayOpen(!isOverlayOpen)} isOpen={isOverlayOpen} />
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={location}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
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
