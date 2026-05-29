import React from 'react';
import { useChat } from '../context/ChatContext';
import { motion, AnimatePresence } from 'framer-motion';
import { NavBar } from './NavBar';
import { GeometricBackground } from './GeometricBackground';
import { Switch, Route, useLocation } from 'wouter';
import { Home } from '../pages/Home';
import { Training } from '../pages/Training';
import { Services } from '../pages/Services';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';

export function OverlayLayer() {
  const { isOverlayOpen } = useChat();
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
        className="fixed top-0 left-0 right-0 bottom-44 z-10 origin-top pointer-events-none"
      >
        <div
          className="absolute inset-0 overflow-hidden pointer-events-auto flex flex-col"
          style={{
            background: 'rgba(18, 19, 23, 0.92)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <GeometricBackground className="absolute inset-0 w-full h-full z-0 pointer-events-none" />

          <NavBar />

          <div className="relative z-10 flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.25 }}
                className="h-full"
              >
                <Switch>
                  <Route path="/"          component={Home} />
                  <Route path="/admin"     component={Home} />
                  <Route path="/training"  component={Training} />
                  <Route path="/services"  component={Services} />
                  <Route path="/about"     component={About} />
                  <Route path="/contact"   component={Contact} />
                </Switch>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
