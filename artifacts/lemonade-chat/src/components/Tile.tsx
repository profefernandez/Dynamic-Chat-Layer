import React, { useState } from 'react';
import { Element, SubElement } from '@workspace/api-client-react';
import { useChat } from '../context/ChatContext';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GemIcon } from './GemIcon';

const TILE_ICONS = ['⬡', '◈', '⬡', '◈'];

export function Tile({ element, index = 0 }: { element: Element; index?: number }) {
  const { sendMessage } = useChat();
  const [isExpanded, setIsExpanded] = useState(false);
  const isNew = index === 0 || index === 3;

  const handleClick = () => {
    if (element.subElements && element.subElements.length > 0) {
      setIsExpanded(!isExpanded);
    } else {
      sendMessage(element.promptText, true, element.id);
    }
  };

  const handleSubClick = (e: React.MouseEvent, sub: SubElement) => {
    e.stopPropagation();
    sendMessage(sub.promptText, true);
  };

  return (
    <div className="flex flex-col gap-2">
      <motion.div
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        onClick={handleClick}
        className="relative overflow-hidden rounded-xl service-tile cursor-pointer group p-5"
      >
        {/* Hover gold gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(201,151,58,0.08)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10 flex items-start gap-4">
          {/* Gem icon */}
          <GemIcon
            size={48}
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            }
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-base font-bold text-[#f0ece0] group-hover:text-[#c9973a] transition-colors leading-tight">
                {element.name}
              </h3>
              {isNew && <span className="badge-new">NEW</span>}
            </div>
            {element.description && (
              <p className="text-sm text-[#8a7f6e] leading-relaxed line-clamp-3">{element.description}</p>
            )}
          </div>

          <div
            className="p-1.5 rounded-full shrink-0 border transition-all"
            style={{
              borderColor: 'rgba(201,151,58,0.2)',
              color: 'rgba(201,151,58,0.6)',
            }}
          >
            {element.subElements && element.subElements.length > 0 ? (
              <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </div>
        </div>

        {element.photoUrl && (
          <div className="mt-4 aspect-video rounded-lg overflow-hidden relative">
            <img
              src={element.photoUrl}
              alt={element.name}
              className="object-cover w-full h-full opacity-70 group-hover:opacity-90 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b08]/80 to-transparent" />
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {isExpanded && element.subElements && element.subElements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pl-4 space-y-2 overflow-hidden"
          >
            <div className="border-l border-[rgba(201,151,58,0.2)] pl-4 py-2 space-y-2">
              {element.subElements.map(sub => (
                <motion.div
                  key={sub.id}
                  whileHover={{ x: 4 }}
                  onClick={(e) => handleSubClick(e, sub)}
                  className="p-4 rounded-lg service-tile cursor-pointer group/sub"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-6 h-6 shrink-0"
                        style={{
                          clipPath: 'polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)',
                          background: 'radial-gradient(circle at 35% 30%, rgba(240,190,90,0.7), rgba(180,110,25,0.5) 50%, rgba(90,55,10,0.3) 100%)',
                        }}
                      />
                      <span className="font-semibold text-sm text-[#f0ece0] group-hover/sub:text-[#c9973a] transition-colors">
                        {sub.name}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#5a5040] group-hover/sub:text-[#c9973a] transition-colors shrink-0" />
                  </div>
                  {sub.description && (
                    <p className="text-xs text-[#5a5040] mt-1.5 pl-9">{sub.description}</p>
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
