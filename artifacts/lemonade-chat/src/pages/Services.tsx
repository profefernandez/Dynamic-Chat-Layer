import React from 'react';
import { motion } from 'framer-motion';
import { useChat } from '../context/ChatContext';
import { CARD_VISUALS } from './Home';
import consultantPortrait from '@assets/Screenshot_2026-04-08_115516_1780005621317.png';

type ConsultTile = {
  id: string;
  title: string;
  description: string;
  prompt: string;
  visual: typeof CARD_VISUALS[number];
};

const TILES: ConsultTile[] = [
  {
    id: 'ethics',
    title: 'Ethics & Safety',
    description:
      'Responsible, safe, and ethical AI — policies, guardrails, and team agreements.',
    prompt: 'I want to talk through ethics and safety guidance for our AI use.',
    visual: CARD_VISUALS[3],
  },
  {
    id: 'literacy',
    title: 'AI Literacy & Education',
    description:
      'Ongoing AI literacy for non-technical teams, with support as they grow.',
    prompt:
      'Tell me about AI literacy & education consultations for our non-technical team.',
    visual: CARD_VISUALS[0],
  },
  {
    id: 'implementation',
    title: 'AI Tool Implementation',
    description:
      'Help selecting and rolling out the right AI tool across your teams.',
    prompt: "I'd like to discuss implementing an AI tool across our teams.",
    visual: CARD_VISUALS[2],
  },
];

export function Services() {
  const { sendMessage } = useChat();

  return (
    <main className="h-full flex flex-col justify-center py-8 relative px-margin-mobile md:px-margin-desktop overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none bg-pattern opacity-50" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] z-0 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#bfa0ff]/10 rounded-full blur-[100px] z-0 pointer-events-none" />

      <div className="z-10 w-full max-w-[1280px] mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* LEFT — title above image */}
        <div className="w-full lg:w-[38%] flex-shrink-0 flex flex-col items-center text-center">
          <div className="flex items-center gap-4 mb-3 opacity-70">
            <div className="h-px w-10 bg-on-surface-variant" />
            <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-on-surface-variant">
              Advisory &amp; Strategy
            </span>
            <div className="h-px w-10 bg-on-surface-variant" />
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface leading-tight mb-6">
            AI Consultation
          </h1>
          <div className="relative w-full max-w-[360px]">
            <div className="absolute -inset-3 bg-primary/15 rounded-3xl blur-2xl" />
            <img
              src={consultantPortrait}
              alt="Portrait of the lead AI consultant"
              className="relative w-full h-[280px] lg:h-[400px] object-cover rounded-3xl border border-primary/25 shadow-[0_0_40px_rgba(242,202,80,0.18)]"
            />
          </div>
        </div>

        {/* RIGHT — duplicated Home cards, restacked */}
        <div className="w-full lg:w-[62%] flex flex-col gap-4">
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
              whileHover={{ x: 6 }}
              transition={{ duration: 0.25 }}
              className="glass-card rounded-xl p-4 relative group transition-transform duration-300 z-10 flex flex-row items-center gap-5 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              <div className="flex-shrink-0">
                <TileCardImageIcon visual={tile.visual} alt={tile.title} />
              </div>
              <div className="flex flex-col">
                <h3 className="font-body-lg text-xl text-white font-semibold mb-1">{tile.title}</h3>
                <p className="font-body-md text-sm text-on-surface-variant">{tile.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}

function TileCardImageIcon({
  visual,
  alt,
}: {
  visual: typeof CARD_VISUALS[number];
  alt: string;
}) {
  return (
    <div className="h-20 w-20 relative flex items-center justify-center">
      <div
        className={`absolute inset-0 ${visual.glowClass} rounded-full blur-xl ${visual.glowHoverClass} transition-colors`}
      />
      <img
        alt={alt}
        src={visual.fallbackImg}
        className={`w-16 h-16 object-cover rounded-full border ${visual.imgBorderClass} z-10 opacity-80 mix-blend-screen ${visual.imgShadowClass}`}
      />
      <span
        className={`material-symbols-outlined absolute ${visual.iconColorClass} text-2xl z-20 mix-blend-screen`}
      >
        {visual.icon}
      </span>
    </div>
  );
}
