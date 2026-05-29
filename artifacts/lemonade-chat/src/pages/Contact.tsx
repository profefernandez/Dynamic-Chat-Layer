import React from 'react';
import { motion } from 'framer-motion';
import exhale from '@assets/exhale_1780015620584.png';
import galveston from '@assets/galveston_1780015620585.png';
import gcsw from '@assets/GCSW_1780015620585.png';
import jbertrand from '@assets/jbertrand_1780015629242.png';
import jewish from '@assets/jewish_1780015629244.png';
import pasadena from '@assets/pasadena_1780015637786.png';

type Partner = {
  id: string;
  name: string;
  img: string;
  /** image height — varied for a staggered collage look */
  h: string;
};

const PARTNERS: Partner[] = [
  { id: 'gcsw', name: 'Graduate College of Social Work', img: gcsw, h: 'h-44 md:h-52' },
  { id: 'exhale', name: 'Exhale Therapy, Wellness & Consulting', img: exhale, h: 'h-28 md:h-32' },
  { id: 'galveston', name: 'Galveston College', img: galveston, h: 'h-32 md:h-40' },
  { id: 'jewish', name: 'Jewish Family Service', img: jewish, h: 'h-28 md:h-32' },
  { id: 'jbertrand', name: 'FOCUS Care Counseling Services', img: jbertrand, h: 'h-40 md:h-48' },
  { id: 'pasadena', name: 'Pasadena Public Library', img: pasadena, h: 'h-32 md:h-40' },
];

export function Contact() {
  return (
    <main className="min-h-full flex flex-col items-center justify-start pt-6 pb-4 relative px-margin-mobile md:px-margin-desktop overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none bg-pattern opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] z-0 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tertiary/10 rounded-full blur-[100px] z-0 pointer-events-none" />

      <div className="z-10 text-center max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-center gap-4 mb-3 opacity-70">
          <div className="h-px w-12 bg-on-surface-variant" />
          <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-on-surface-variant">
            Partners
          </span>
          <div className="h-px w-12 bg-on-surface-variant" />
        </div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface leading-tight mb-3">
          Collaborative Partners <span className="text-primary text-glow italic">in the Community</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          A few of the community partners and organizations we've had the privilege to work with.
        </p>
      </div>

      <div className="z-10 w-full max-w-[1100px] mx-auto">
        <div className="columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
          {PARTNERS.map((partner, i) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="glass-card group relative overflow-hidden rounded-xl mb-4 break-inside-avoid"
            >
              <img
                src={partner.img}
                alt={partner.name}
                className={`w-full ${partner.h} object-cover transition-transform duration-500 group-hover:scale-105`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="font-body-md text-xs md:text-sm text-white font-semibold leading-snug drop-shadow">
                  {partner.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
