import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function Contact() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 md:py-16">
      <p className="text-xs tracking-[0.2em] uppercase text-[#8a7f6e] mb-3">Get in Touch</p>
      <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#f0ece0] mb-2">
        Let's Connect
      </h1>
      <p className="text-base text-[#8a7f6e] mb-10">
        Ready to bring AI clarity to your work or organization? Reach out and we will get back to you.
      </p>

      <form
        className="space-y-5 rounded-xl p-7 relative overflow-hidden service-tile"
        onSubmit={(e) => e.preventDefault()}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,151,58,0.5), transparent)' }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#8a7f6e] uppercase tracking-wider">Name</label>
            <Input
              className="h-11 text-[#f0ece0] placeholder:text-[#5a5040]"
              style={{ background: 'rgba(20,15,8,0.6)', borderColor: 'rgba(201,151,58,0.18)' }}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#8a7f6e] uppercase tracking-wider">Email</label>
            <Input
              type="email"
              className="h-11 text-[#f0ece0] placeholder:text-[#5a5040]"
              style={{ background: 'rgba(20,15,8,0.6)', borderColor: 'rgba(201,151,58,0.18)' }}
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#8a7f6e] uppercase tracking-wider">How can we help?</label>
          <Textarea
            className="text-[#f0ece0] placeholder:text-[#5a5040] min-h-[130px] resize-none"
            style={{ background: 'rgba(20,15,8,0.6)', borderColor: 'rgba(201,151,58,0.18)' }}
            placeholder="Tell us about your organization, your goals, or a question you have about AI..."
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 font-bold tracking-wide transition-all"
          style={{
            background: 'linear-gradient(135deg, #e0b050, #c9973a)',
            color: '#0d0b08',
          }}
        >
          Send Message
        </Button>
      </form>
    </div>
  );
}
