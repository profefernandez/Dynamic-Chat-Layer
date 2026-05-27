import React, { useState } from 'react';
import { Element, SubElement } from '@workspace/api-client-react';
import { useChat } from '../context/ChatContext';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Tile({ element }: { element: Element }) {
  const { sendMessage } = useChat();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (element.subElements && element.subElements.length > 0) {
      setIsExpanded(!isExpanded);
    } else {
      sendMessage(element.promptText, true);
    }
  };

  const handleSubClick = (e: React.MouseEvent, sub: SubElement) => {
    e.stopPropagation();
    sendMessage(sub.promptText, true);
  };

  return (
    <div className="flex flex-col gap-2">
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-6 cursor-pointer group tile-hover"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {element.photoUrl && (
          <div className="mb-4 aspect-video rounded-xl overflow-hidden relative">
            <img src={element.photoUrl} alt={element.name} className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          </div>
        )}

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{element.name}</h3>
            {element.description && (
              <p className="mt-2 text-sm text-white/60 line-clamp-2">{element.description}</p>
            )}
          </div>
          <div className="bg-primary/10 p-2 rounded-full border border-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
            {element.subElements && element.subElements.length > 0 ? (
              <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && element.subElements && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pl-4 space-y-2 overflow-hidden"
          >
            <div className="border-l border-primary/20 pl-4 py-2 space-y-3">
              {element.subElements.map(sub => (
                <motion.div
                  key={sub.id}
                  whileHover={{ x: 4 }}
                  onClick={(e) => handleSubClick(e, sub)}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group/sub"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white group-hover/sub:text-primary transition-colors">{sub.name}</span>
                    <ArrowRight className="w-3 h-3 text-white/40 group-hover/sub:text-primary transition-colors" />
                  </div>
                  {sub.description && (
                    <p className="text-xs text-white/50 mt-1">{sub.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
