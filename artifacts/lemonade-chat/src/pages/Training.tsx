import React from 'react';
import { useListElements, getListElementsQueryKey } from '@workspace/api-client-react';
import { useChat } from '../context/ChatContext';
import { motion } from 'framer-motion';

export function Training() {
  const { data: elements, isLoading } = useListElements({ query: { queryKey: getListElementsQueryKey() } });
  const { sendMessage } = useChat();

  return (
    <main className="flex flex-col items-center pt-16 pb-20 relative px-margin-mobile md:px-margin-desktop">
      <div className="z-10 text-center max-w-3xl mx-auto mb-14">
        <div className="flex items-center justify-center gap-4 mb-6 opacity-70">
          <div className="h-px w-12 bg-on-surface-variant" />
          <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-on-surface-variant">
            Learn With Us
          </span>
          <div className="h-px w-12 bg-on-surface-variant" />
        </div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">AI Training</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Plain-language AI learning for social workers, families, and community groups.
        </p>
      </div>

      <div className="z-10 w-full max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {isLoading
            ? [0, 1, 2, 3].map(i => <div key={i} className="glass-card rounded-xl p-6 h-40 animate-pulse" />)
            : (elements ?? []).map(el => (
                <motion.div
                  key={el.id}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => sendMessage(el.promptText, true)}
                  className="glass-card rounded-xl p-6 cursor-pointer group"
                >
                  <h3 className="font-body-lg text-body-lg text-white font-semibold mb-2 group-hover:text-primary transition-colors">
                    {el.name}
                  </h3>
                  <p className="font-body-md text-sm text-on-surface-variant">{el.description}</p>
                </motion.div>
              ))}
        </div>
      </div>
    </main>
  );
}
