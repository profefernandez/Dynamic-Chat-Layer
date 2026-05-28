import React from 'react';
import { useChat } from '../context/ChatContext';
import { motion } from 'framer-motion';
import { TileCardBody, TileVisual } from '../components/TileCardBase';
import { CARD_VISUALS } from './Home';
import trainingHero from '../assets/training-hero.png';

type TrainingTile = {
  id: string;
  title: string;
  description: string;
  prompt: string;
  visual: typeof CARD_VISUALS[number];
};

const TILES: TrainingTile[] = [
  {
    id: 'sixty',
    title: '$60 for 60 minutes',
    description:
      'A 60-minute AI lesson for anyone wanting to understand AI. No experience required.',
    prompt:
      "I'd like to book the $60 / 60-minute AI lesson — what times are available?",
    visual: CARD_VISUALS[0],
  },
  {
    id: 'thirty',
    title: '$30 for 30 minutes',
    description:
      'A 30-minute AI session to troubleshoot, refine, or post-training help with AI issues.',
    prompt:
      "I'd like to book the $30 / 30-minute AI follow-up session — what times are available?",
    visual: CARD_VISUALS[3],
  },
  {
    id: 'custom',
    title: 'Customized Training',
    description:
      'Part of an organization or small business? Contact for custom pricing.',
    prompt:
      "I'm with an organization or small business and would like to discuss customized AI training and pricing.",
    visual: CARD_VISUALS[1],
  },
];

export function Training() {
  const { sendMessage } = useChat();

  return (
    <main className="h-full flex flex-col items-center justify-start pt-6 pb-4 relative px-margin-mobile md:px-margin-desktop overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none bg-pattern opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] z-0 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tertiary/10 rounded-full blur-[100px] z-0 pointer-events-none" />

      <div className="z-10 text-center max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-center gap-4 mb-3 opacity-70">
          <div className="h-px w-12 bg-on-surface-variant" />
          <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-on-surface-variant">
            Learn With Us
          </span>
          <div className="h-px w-12 bg-on-surface-variant" />
        </div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface leading-tight mb-3">
          AI Training
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Plain-language AI lessons, one session at a time.
        </p>
      </div>

      <div className="z-10 w-full max-w-2xl mx-auto mb-8">
        <div className="relative rounded-2xl overflow-hidden glass-card p-1.5">
          <img
            src={trainingHero}
            alt="Abstract warm amber light and geometric network representing AI learning"
            className="w-full h-24 md:h-28 object-cover rounded-xl"
          />
          <div className="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-t from-surface/70 via-transparent to-transparent" />
        </div>
      </div>

      <div className="z-10 w-full max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
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
              className="glass-card rounded-xl p-5 relative group transition-transform duration-300 z-10 flex flex-col h-full text-center items-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
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
      </div>
    </main>
  );
}
