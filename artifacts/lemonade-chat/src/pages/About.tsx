import React from 'react';
import { motion } from 'framer-motion';
import { useChat } from '../context/ChatContext';
import { TileCardBody, TileVisual } from '../components/TileCardBase';
import { CARD_VISUALS } from './Home';

type WebTile = {
  id: string;
  title: string;
  description: string;
  prompt: string;
  visual: typeof CARD_VISUALS[number];
};

const TILES: WebTile[] = [
  {
    id: 'traditional',
    title: 'Explore Traditional Development',
    description:
      'A straightforward, polished website to establish your online presence.',
    prompt: 'I prefer a straightforward website to establish my online presence.',
    visual: CARD_VISUALS[2],
  },
  {
    id: 'ai-powered',
    title: 'Experience AI-Powered Help',
    description:
      'A smart assistant that helps build your site and guides visitors dynamically.',
    prompt:
      'I want a smart assistant that helps build and guide visitors dynamically.',
    visual: CARD_VISUALS[3],
  },
];

export function About() {
  const { sendMessage } = useChat();

  return (
    <main className="min-h-full flex flex-col items-center justify-start pt-6 pb-4 relative px-margin-mobile md:px-margin-desktop overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none bg-pattern opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] z-0 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] z-0 pointer-events-none" />

      <div className="z-10 text-center max-w-4xl mx-auto mb-10">
        <div className="flex items-center justify-center gap-4 mb-3 opacity-70">
          <div className="h-px w-12 bg-on-surface-variant" />
          <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-on-surface-variant">
            Website Development &amp; Hosting
          </span>
          <div className="h-px w-12 bg-on-surface-variant" />
        </div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface leading-tight mb-3">
          Meet Your New <span className="text-primary text-glow italic pr-1">Website Assistant</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Above the fold, no scrolling — your website begins with a conversation.
        </p>
      </div>

      <div className="z-10 w-full max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {TILES.map((tile) => (
            <motion.div
              key={tile.id}
              role="button"
              tabIndex={0}
              onClick={() => sendMessage(tile.prompt, true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  sendMessage(tile.prompt, true);
                }
              }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              className="glass-card rounded-xl p-6 relative group transition-transform duration-300 z-10 flex flex-col h-full text-center items-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              <TileCardBody
                visual={tile.visual as TileVisual}
                title={tile.title}
                description={tile.description}
                imgSrc={tile.visual.fallbackImg}
                alt={tile.title}
              />
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center font-body-md text-sm text-on-surface-variant max-w-2xl mx-auto">
          Sites start at <span className="text-primary font-semibold">$500</span> for a simple build,
          up to <span className="text-primary font-semibold">$3,500</span> for small businesses &amp;
          organizations, with custom pricing for larger projects. Hosting on our own VPS available.
        </p>
      </div>
    </main>
  );
}
