import React from 'react';

export function About() {
  return (
    <main className="flex flex-col items-center pt-16 pb-20 px-margin-mobile md:px-margin-desktop">
      <div className="z-10 text-center max-w-3xl mx-auto mb-14">
        <div className="flex items-center justify-center gap-4 mb-6 opacity-70">
          <div className="h-px w-12 bg-on-surface-variant" />
          <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-on-surface-variant">
            Website Development
          </span>
          <div className="h-px w-12 bg-on-surface-variant" />
        </div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">
          AI-Assisted Websites
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          We build clean, accessible websites for helping professionals, nonprofits, and community businesses — powered by AI.
        </p>
      </div>

      <div className="z-10 w-full max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {[
          { title: 'Nonprofit Websites', body: 'Mission-driven sites built for impact, accessibility, and community reach.' },
          { title: 'Professional Practice', body: 'Personal sites for social workers, consultants, and educators that build trust fast.' },
          { title: 'AI-Enhanced Tools', body: 'Chatbots, intake forms, and resource finders embedded directly in your site.' },
        ].map(({ title, body }) => (
          <div key={title} className="glass-card rounded-xl p-6">
            <h3 className="font-body-lg text-body-lg text-white font-semibold mb-3">{title}</h3>
            <p className="font-body-md text-sm text-on-surface-variant">{body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
