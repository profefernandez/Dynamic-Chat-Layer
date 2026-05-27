import React from 'react';

export function About() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
      <p className="text-xs tracking-[0.2em] uppercase text-[#8a7f6e] mb-3">About</p>
      <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#f0ece0] mb-8 leading-tight">
        Illuminating AI<br />
        <span className="text-gold-gradient">One Watt at a Time</span>
      </h1>

      <div className="space-y-6 text-[#8a7f6e] text-base leading-relaxed">
        <p>
          60 Watts of Clarity was founded on a simple belief: artificial intelligence should not be the exclusive domain of technologists. 
          It belongs to social workers, community advocates, educators, nonprofits, and everyday families navigating an AI-shaped world.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
          {[
            { label: 'Licensed Social Worker', description: 'Grounding every service in human-centered values and community accountability.' },
            { label: 'AI Consultant', description: 'Translating complex technology into accessible, practical knowledge for organizations and individuals.' },
            { label: 'Educator', description: 'Teaching AI literacy in plain language — no jargon, no gatekeeping.' },
          ].map(({ label, description }) => (
            <div
              key={label}
              className="p-5 rounded-xl service-tile relative overflow-hidden"
            >
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl"
                style={{ background: 'rgba(201,151,58,0.1)' }}
              />
              <h3 className="text-sm font-bold text-[#c9973a] mb-2 uppercase tracking-wider">{label}</h3>
              <p className="text-xs text-[#8a7f6e] leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        <p>
          The name says it all — 60 watts is enough light to read by, to see clearly, to move through a space with confidence. 
          That is what we bring to every engagement: not blinding floodlights or impenetrable darkness, 
          but exactly the right amount of clarity for where you are and where you are going.
        </p>

        <p className="text-[#5a5040] text-sm">
          Click any service tile on the home screen to start a guided conversation with the AI, 
          or type freely in the bar below. Your questions shape the light.
        </p>
      </div>
    </div>
  );
}
