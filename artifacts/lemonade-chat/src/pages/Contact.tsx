import React from 'react';

export function Contact() {
  return (
    <main className="flex flex-col items-center pt-16 pb-20 px-margin-mobile md:px-margin-desktop">
      <div className="z-10 text-center max-w-3xl mx-auto mb-14">
        <div className="flex items-center justify-center gap-4 mb-6 opacity-70">
          <div className="h-px w-12 bg-on-surface-variant" />
          <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-on-surface-variant">
            Community
          </span>
          <div className="h-px w-12 bg-on-surface-variant" />
        </div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">
          The 60 Watts AI Rollidex
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          A growing circle for people learning how AI is shaping work, practice, and everyday life.
        </p>
      </div>

      <div className="z-10 w-full max-w-2xl mx-auto">
        <form
          className="glass-card rounded-xl p-8 space-y-5 relative overflow-hidden"
          onSubmit={e => e.preventDefault()}
        >
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(242,202,80,0.4), transparent)' }} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: 'Name', type: 'text', placeholder: 'Your name' },
              { label: 'Email', type: 'email', placeholder: 'your@email.com' },
            ].map(f => (
              <div key={f.label} className="space-y-1.5">
                <label className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  className="w-full h-11 px-4 rounded-md font-body-md text-on-surface placeholder:text-outline outline-none focus:ring-1 focus:ring-primary/50 transition"
                  style={{ background: 'rgba(30,31,35,0.7)', border: '1px solid rgba(77,70,53,0.6)' }}
                />
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Message</label>
            <textarea
              rows={4}
              placeholder="Tell us about yourself or your organization..."
              className="w-full px-4 py-3 rounded-md font-body-md text-on-surface placeholder:text-outline outline-none focus:ring-1 focus:ring-primary/50 transition resize-none"
              style={{ background: 'rgba(30,31,35,0.7)', border: '1px solid rgba(77,70,53,0.6)' }}
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-full font-label-sm text-label-sm uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(242,202,80,0.5)] active:scale-95"
            style={{ background: '#f2ca50', color: '#3c2f00' }}
          >
            Join the Community
          </button>
        </form>

        <p className="text-center font-body-md text-sm text-on-surface-variant mt-6 opacity-60">
          © 2024 60 Watts of Clarity. Illuminating AI Literacy for a Brighter Future.
        </p>
      </div>
    </main>
  );
}
