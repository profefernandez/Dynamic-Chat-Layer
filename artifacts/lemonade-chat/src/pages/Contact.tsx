import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
        Signal Us
      </h1>
      <p className="text-lg text-white/60 mb-12">
        Ready to start a project? Send a transmission to our team.
      </p>

      <form className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Name</label>
            <Input className="bg-white/5 border-white/10 focus-visible:ring-primary text-white" placeholder="Jane Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Frequency (Email)</label>
            <Input type="email" className="bg-white/5 border-white/10 focus-visible:ring-primary text-white" placeholder="jane@example.com" />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80">Message</label>
          <Textarea 
            className="bg-white/5 border-white/10 focus-visible:ring-primary text-white min-h-[150px]" 
            placeholder="What are we building?" 
          />
        </div>

        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all">
          Transmit
        </Button>
      </form>
    </div>
  );
}
