import React from 'react';

export function About() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-8">
        The Agency of<br/>
        <span className="text-primary">Tomorrow</span>
      </h1>
      
      <div className="space-y-8 text-white/70 text-lg leading-relaxed">
        <p>
          Launch Lemonade isn't just a platform; it's a command center for creativity. 
          We believe that artificial intelligence shouldn't be hidden behind sterile, 
          corporate interfaces. It should be electric. It should be bold.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl" />
            <h3 className="text-2xl font-bold text-white mb-4">Vision</h3>
            <p className="text-sm">To bridge the gap between human intuition and machine capability, wrapping it in an unforgettable aesthetic.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-3xl" />
            <h3 className="text-2xl font-bold text-white mb-4">Method</h3>
            <p className="text-sm">Context-driven interaction. By guiding the engine with curated prompts behind the scenes, we deliver expert results instantly.</p>
          </div>
        </div>

        <p>
          Interact with the tiles across the site to feed context to our AI. 
          Or, simply use the command line below to ask whatever's on your mind.
        </p>
      </div>
    </div>
  );
}
