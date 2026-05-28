import React from 'react';
import { useChat } from '../context/ChatContext';
import { motion } from 'framer-motion';
import { TileCardBody, TileVisual } from '../components/TileCardBase';
import trainingHero from '../assets/training-hero.jpg';

type TrainingTile = {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  prompt: string;
  visual: TileVisual;
};

const TILES: TrainingTile[] = [
  {
    id: 'sixty',
    title: '$60 for 60 minutes',
    description:
      'A 60-minute AI lesson for anyone wanting to understand AI. No experience required.',
    ctaLabel: 'Book',
    prompt:
      "I'd like to book the $60 / 60-minute AI lesson — what times are available?",
    visual: {
      glowClass: 'bg-primary/20',
      glowHoverClass: 'group-hover:bg-primary/30',
      imgBorderClass: 'border-primary/30',
      imgShadowClass: 'shadow-[0_0_30px_rgba(242,202,80,0.3)]',
      iconColorClass: 'text-primary',
      icon: 'school',
    },
  },
  {
    id: 'thirty',
    title: '$30 for 30 minutes',
    description:
      'A 30-minute AI session to troubleshoot, refine, or post-training help with AI issues.',
    ctaLabel: 'Book',
    prompt:
      "I'd like to book the $30 / 30-minute AI follow-up session — what times are available?",
    visual: {
      glowClass: 'bg-tertiary/20',
      glowHoverClass: 'group-hover:bg-tertiary/30',
      imgBorderClass: 'border-tertiary/30',
      imgShadowClass: 'shadow-[0_0_30px_rgba(151,176,255,0.3)]',
      iconColorClass: 'text-tertiary',
      icon: 'bolt',
    },
  },
  {
    id: 'custom',
    title: 'Customized Training',
    description:
      'Part of an organization or small business? Contact for custom pricing.',
    ctaLabel: 'Contact',
    prompt:
      "I'm with an organization or small business and would like to discuss customized AI training and pricing.",
    visual: {
      glowClass: 'bg-[#bfa0ff]/20',
      glowHoverClass: 'group-hover:bg-[#bfa0ff]/30',
      imgBorderClass: 'border-[#bfa0ff]/30',
      imgShadowClass: 'shadow-[0_0_30px_rgba(191,160,255,0.3)]',
      iconColorClass: 'text-[#d7c3ff]',
      icon: 'groups',
    },
  },
];

export function Training() {
  const { sendMessage } = useChat();

  return (
    <main className="h-full flex flex-col items-center pt-4 pb-4 relative px-margin-mobile md:px-margin-desktop overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none bg-pattern opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] z-0 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tertiary/10 rounded-full blur-[100px] z-0 pointer-events-none" />

      <div className="z-10 text-center max-w-3xl mx-auto mb-4">
        <div className="flex items-center justify-center gap-4 mb-2 opacity-70">
          <div className="h-px w-12 bg-on-surface-variant" />
          <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-on-surface-variant">
            Learn With Us
          </span>
          <div className="h-px w-12 bg-on-surface-variant" />
        </div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">AI Training</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Plain-language AI lessons, one session at a time.
        </p>
      </div>

      <div className="z-10 w-full max-w-2xl mx-auto mb-4">
        <div className="relative rounded-2xl overflow-hidden glass-card p-1.5">
          <img
            src={trainingHero}
            alt="A learner working with AI at a laptop in warm light"
            className="w-full h-28 md:h-32 object-cover rounded-xl"
          />
          <div className="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-t from-surface/70 via-transparent to-transparent" />
        </div>
      </div>

      <div className="z-10 w-full max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {TILES.map((tile) => (
            <motion.div
              key={tile.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              className="glass-card rounded-xl p-5 relative group transition-transform duration-300 z-10 flex flex-col h-full text-center items-center"
            >
              <TileCardBody
                visual={tile.visual}
                title={tile.title}
                description={tile.description}
                footer={
                  <button
                    type="button"
                    onClick={() => sendMessage(tile.prompt, true)}
                    className="mt-4 inline-flex items-center justify-center px-6 py-2 rounded-full bg-primary text-on-primary font-body-md text-sm font-semibold hover:bg-primary-fixed-dim transition-colors shadow-[0_0_15px_rgba(242,202,80,0.35)]"
                  >
                    {tile.ctaLabel}
                  </button>
                }
              />
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
