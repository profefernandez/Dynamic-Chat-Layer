import React from 'react';
import { motion } from 'framer-motion';
import { useChat } from '../context/ChatContext';
import { TileCardBody, TileVisual } from '../components/TileCardBase';
import consultantPortrait from '@assets/Screenshot_2026-04-08_115516_1780005621317.png';

type ConsultTile = {
  id: string;
  title: string;
  description: string;
  prompt: string;
  visual: TileVisual;
};

const TILES: ConsultTile[] = [
  {
    id: 'literacy',
    title: 'AI Literacy & Education',
    description:
      'Ongoing AI literacy for non-technical teams, with continued support as they grow.',
    prompt:
      'Tell me about AI literacy & education consultations for our non-technical team.',
    visual: {
      glowClass: 'bg-primary/20',
      glowHoverClass: 'group-hover:bg-primary/30',
      imgBorderClass: 'border-primary/30',
      imgShadowClass: 'shadow-[0_0_30px_rgba(242,202,80,0.3)]',
      iconColorClass: 'text-primary',
      icon: 'groups',
    },
  },
  {
    id: 'implementation',
    title: 'AI Tool Implementation',
    description:
      'Help selecting and rolling out the right AI tool, with training on how to use it across teams.',
    prompt: "I'd like to discuss implementing an AI tool across our teams.",
    visual: {
      glowClass: 'bg-tertiary/20',
      glowHoverClass: 'group-hover:bg-tertiary/30',
      imgBorderClass: 'border-tertiary/30',
      imgShadowClass: 'shadow-[0_0_30px_rgba(151,176,255,0.3)]',
      iconColorClass: 'text-tertiary',
      icon: 'web',
    },
  },
  {
    id: 'ethics',
    title: 'Ethics & Safety',
    description:
      'Guidance on responsible, safe, and ethical AI use — policies, guardrails, and team agreements.',
    prompt: 'I want to talk through ethics and safety guidance for our AI use.',
    visual: {
      glowClass: 'bg-[#bfa0ff]/20',
      glowHoverClass: 'group-hover:bg-[#bfa0ff]/30',
      imgBorderClass: 'border-[#bfa0ff]/30',
      imgShadowClass: 'shadow-[0_0_30px_rgba(191,160,255,0.3)]',
      iconColorClass: 'text-[#d7c3ff]',
      icon: 'hub',
    },
  },
];

const OFFICE_HOURS_PROMPT =
  'Tell me about weekly office hours as an add-on for ongoing consultation and adoption support.';

export function Services() {
  const { sendMessage } = useChat();

  return (
    <main className="h-full flex flex-col items-center pt-4 pb-4 relative px-margin-mobile md:px-margin-desktop overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none bg-pattern opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] z-0 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#bfa0ff]/10 rounded-full blur-[100px] z-0 pointer-events-none" />

      <div className="z-10 text-center max-w-4xl mx-auto mb-4">
        <div className="flex items-center justify-center gap-4 mb-3 opacity-70">
          <div className="h-px w-12 bg-on-surface-variant" />
          <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-on-surface-variant">
            Advisory &amp; Strategy
          </span>
          <div className="h-px w-12 bg-on-surface-variant" />
        </div>
        <h2 className="font-headline-xl text-headline-xl text-on-surface leading-tight">
          AI Consultation
        </h2>
      </div>

      <div className="z-10 w-full max-w-3xl mx-auto mb-4 flex flex-col md:flex-row items-center gap-5 md:gap-7">
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
          <img
            src={consultantPortrait}
            alt="Portrait of the lead AI consultant"
            className="relative w-40 h-40 md:w-56 md:h-56 object-cover rounded-full border border-primary/30 shadow-[0_0_30px_rgba(242,202,80,0.25)]"
          />
        </div>
        <p className="font-body-md text-base text-on-surface-variant text-center md:text-left max-w-md">
          We partner with leaders and teams to make AI useful, safe, and human — from
          first steps to org-wide rollout, meeting you where you are and staying with you
          as things evolve.
        </p>
      </div>

      <div className="z-10 w-full max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {TILES.map((tile) => (
            <motion.button
              key={tile.id}
              type="button"
              onClick={() => sendMessage(tile.prompt, true)}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.25 }}
              className="glass-card rounded-xl p-4 relative group transition-transform duration-300 z-10 flex flex-col h-full text-center items-center cursor-pointer text-left-none"
            >
              <TileCardBody
                visual={tile.visual}
                title={tile.title}
                description={tile.description}
                compact
              />
            </motion.button>
          ))}
        </div>
      </div>

      <div className="z-10 w-full max-w-container-max mx-auto mt-4">
        <div className="rounded-xl border border-primary/30 bg-surface-container-low/60 px-5 py-3 flex flex-col md:flex-row items-center gap-3 md:gap-5">
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-2xl">schedule</span>
            <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-primary">
              Office Hours · Add-on
            </span>
          </div>
          <p className="font-body-md text-sm text-on-surface-variant text-center md:text-left flex-1">
            Weekly office hours are available with any consultation engagement — drop in
            for ongoing strategy, adoption support, and team questions as they come up.
          </p>
          <button
            type="button"
            onClick={() => sendMessage(OFFICE_HOURS_PROMPT, true)}
            className="flex-shrink-0 inline-flex items-center justify-center px-5 py-2 rounded-full border border-primary/60 text-primary hover:bg-primary/10 transition-colors font-body-md text-sm font-semibold"
          >
            Ask about it →
          </button>
        </div>
      </div>
    </main>
  );
}
