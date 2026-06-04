import React from 'react';
import { useChat } from '../context/ChatContext';
import { motion, AnimatePresence } from 'framer-motion';
import { NavBar } from './NavBar';
import { SiteFooter } from './SiteFooter';
import { GeometricBackground } from './GeometricBackground';
import { Switch, Route, useLocation } from 'wouter';
import { Home } from '../pages/Home';
import { Training } from '../pages/Training';
import { Services } from '../pages/Services';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';
import { useAdmin } from '../context/AdminContext';
import { useAdminUI } from '../context/AdminUIContext';

export function OverlayLayer() {
  const { isOverlayOpen } = useChat();
  const { editMode } = useAdmin();
  const { railWidth } = useAdminUI();
  const [location] = useLocation();
  const leftOffset = editMode ? railWidth : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={false}
        animate={{
          y: isOverlayOpen ? 0 : '-100%',
          opacity: isOverlayOpen ? 1 : 0,
          scale: isOverlayOpen ? 1 : 0.97,
        }}
        transition={{ type: 'spring', bounce: 0, duration: 0.55 }}
        style={{ left: leftOffset }}
        className="fixed top-0 right-0 bottom-[7.5rem] sm:bottom-44 z-10 origin-top pointer-events-none transition-[left] duration-300 ease-out"
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

          <div data-overlay-scroll className="relative z-10 flex-1 overflow-y-auto">
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
                  <Route path="/"               component={Home} />
                  <Route path="/admin"          component={Home} />
                  <Route path="/admin/training" component={Training} />
                  <Route path="/admin/services" component={Services} />
                  <Route path="/admin/about"    component={About} />
                  <Route path="/admin/contact"  component={Contact} />
                  <Route path="/training"       component={Training} />
                  <Route path="/services"       component={Services} />
                  <Route path="/about"          component={About} />
                  <Route path="/contact"        component={Contact} />
                </Switch>
              </motion.div>
            </AnimatePresence>

            {editMode && <SiteFooter />}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
