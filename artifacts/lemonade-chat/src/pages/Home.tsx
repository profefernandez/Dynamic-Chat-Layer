import React from 'react';
import { useListElements, getListElementsQueryKey } from '@workspace/api-client-react';
import { useChat } from '../context/ChatContext';
import { motion } from 'framer-motion';

const CARD_META = [
  {
    badge: 'New',
    glow: 'rgba(242,202,80,0.2)',
    glowHover: 'rgba(242,202,80,0.3)',
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaW3wrGNFO6hmX7TlRw4hj3zZxiIkHV0_0-6xIqWvPqHl5-BOaP5UQ5NqKO6c-vWY7cGHs-t6g0I6-G_W7iJQTJG1jfGQdq0BcNFkQyBSiQaRfOlSv5xQw5h00fhQb7HT4FE_Q3vFXdh9hDcW36rN17G0KbAUVc4nKDlEFk0yeMgFl-tkl3zV8_-9xbUf-uuGjBJXKL-2TMcCdM9MfuMJIFKPLvULK8JFHqNz0Y7XGz4IUz-2pnV3N4CmqRxS0HJqVjsJmFiLUg',
    imgAlt: 'Glowing golden crystal structure representing community networks',
    imgBorder: 'rgba(242,202,80,0.3)',
    imgShadow: '0 0 30px rgba(242,202,80,0.3)',
    icon: 'groups',
    iconColor: 'text-primary',
    offset: false,
  },
  {
    badge: null,
    glow: 'rgba(191,205,255,0.2)',
    glowHover: 'rgba(191,205,255,0.3)',
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrzE3M-iY3ztcO9IJpasEOLYeYNUiL3LNlrCtnwoDHOPyo-Ynj-YEG9jJkx8yWnvj4fWzCzuSLEYohtKITeiPl7cAh1lzlbbULPpN2rHb07g91_r2pIhh6ASf7_1yHtOM4lwMGHzGwIzPi8F0v4wyb_wJ36mp8iRM-_wlzhvJrAbc681ZrF_VV94E79h6mf4s5YKo7DWGJ-PYJxKCE1bv9vUr1G0ennItFXIlI0RAT04Cw-2OPYy9OtSxVcIAoon1Lp7Xkk5C-WeM',
    imgAlt: 'Cool blue transparent geometric crystal representing corporate structure',
    imgBorder: 'rgba(191,205,255,0.3)',
    imgShadow: '0 0 30px rgba(151,176,255,0.3)',
    icon: 'corporate_fare',
    iconColor: 'text-tertiary',
    offset: true,
  },
  {
    badge: null,
    glow: 'rgba(195,198,207,0.2)',
    glowHover: 'rgba(195,198,207,0.3)',
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMdO9TdRwRSwWlyVrgMGBvMwlMju6cw0M5UuUnV8oNFENzc7IyrV_7DTcUkVln_51LnotlJIZE5gTXpKon0f8VqeUbRAcOdE3vKf14kQZmMPxxQcxh-V_-UkEf4_VCenTohnbCzB4QOqztyZjvsjUk_y6B7T33yOR4MsCDrxH7l4zVAnfs8uE7gkPQjDrAPkPfogHL-egydwSIMlkOidtXdbLWz89YIB3ie_8TmtUSJa1Q_TQIWS_5WGraivzMP6KWptfvqr3nWiU',
    imgAlt: 'Silver geometric crystal representing web structure',
    imgBorder: 'rgba(195,198,207,0.3)',
    imgShadow: '0 0 30px rgba(195,198,207,0.3)',
    icon: 'web',
    iconColor: 'text-secondary',
    offset: false,
  },
  {
    badge: 'New',
    glow: 'rgba(242,202,80,0.2)',
    glowHover: 'rgba(242,202,80,0.3)',
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkiX7Bk0XbkrlVb_EsPJvUm264PsVHK8YJ7IFJ__xPIgSvF9E0xrYrN-3pOYGrsIpxR2g0isvIPy13L9N_1s-X1throZIFghbK43deJeHJ6tZ5k-HXoGWLMyy4VslCsS3_gULVZxPOmRnaY5jn9RYMf8Onn46D9dGEU5DpESljG8IKisEVk7fPVDCczXqI1HLwBF_oOcH-Cq2fMI0ouL9vWrbPfCC7ZhIBTTc-QgJt3e0szmDKncpJpmR-Kx7rLH9artnXW-Q2bvE',
    imgAlt: 'Glowing golden crystal structure representing vibrant community networks',
    imgBorder: 'rgba(242,202,80,0.3)',
    imgShadow: '0 0 30px rgba(242,202,80,0.4)',
    icon: 'hub',
    iconColor: 'text-primary',
    offset: true,
  },
];

export function Home() {
  const { data: elements, isLoading } = useListElements({ query: { queryKey: getListElementsQueryKey() } });
  const { sendMessage } = useChat();

  return (
    <main className="flex-grow flex flex-col items-center justify-center pt-16 pb-20 relative px-margin-mobile md:px-margin-desktop selection:bg-primary/30">
      {/* Background glows */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-pattern opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[100px] z-0 pointer-events-none" style={{ background: 'rgba(242,202,80,0.1)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[100px] z-0 pointer-events-none" style={{ background: 'rgba(191,205,255,0.1)' }} />

      {/* Hero */}
      <div className="z-10 text-center max-w-4xl mx-auto mb-16 md:mb-20">
        <div className="flex items-center justify-center gap-4 mb-6 opacity-70">
          <div className="h-px w-12 bg-on-surface-variant" />
          <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-on-surface-variant">
            AI Literacy Education and Development
          </span>
          <div className="h-px w-12 bg-on-surface-variant" />
        </div>

        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-6 leading-tight">
          <span className="text-white">60 Watts of </span>
          <span className="text-primary text-glow italic pr-2">Clarity</span>
        </h1>

        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-8">
          Licensed Social Worker • AI Consultant • Educator • Website Designer
        </p>
      </div>

      {/* Services Grid */}
      <div className="z-10 w-full max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter relative">
          {/* Center connector line (desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px -translate-y-1/2 z-0" style={{ background: 'linear-gradient(to right, transparent, rgba(242,202,80,0.3), transparent)' }} />

          {isLoading
            ? [0, 1, 2, 3].map(i => (
                <div key={i} className="glass-card rounded-xl p-6 h-64 animate-pulse" />
              ))
            : (elements ?? []).slice(0, 4).map((element, index) => {
                const meta = CARD_META[index];
                return (
                  <motion.div
                    key={element.id}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => sendMessage(element.promptText, true)}
                    className={[
                      'glass-card rounded-xl p-6 relative group cursor-pointer z-10 flex flex-col h-full',
                      meta.offset ? 'lg:mt-12' : '',
                    ].join(' ')}
                  >
                    {/* NEW badge */}
                    {meta.badge && (
                      <div
                        className="absolute -top-3 left-6 font-label-sm text-[10px] uppercase px-2 py-0.5 rounded-full z-20"
                        style={{
                          background: '#f2ca50',
                          color: '#3c2f00',
                          boxShadow: '0 0 10px rgba(242,202,80,0.5)',
                        }}
                      >
                        {meta.badge}
                      </div>
                    )}

                    {/* Crystal image area */}
                    <div className="h-32 w-full mb-6 relative flex items-center justify-center">
                      <div
                        className="absolute inset-0 rounded-full blur-xl transition-colors duration-300"
                        style={{ background: meta.glow }}
                      />
                      <img
                        src={meta.imgSrc}
                        alt={meta.imgAlt}
                        className="w-24 h-24 object-cover rounded-full z-10 opacity-80 mix-blend-screen"
                        style={{ border: `1px solid ${meta.imgBorder}`, boxShadow: meta.imgShadow }}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <span className={`material-symbols-outlined absolute text-3xl z-20 mix-blend-screen ${meta.iconColor}`}>
                        {meta.icon}
                      </span>
                    </div>

                    <h3 className="font-body-lg text-body-lg text-white font-semibold mb-3">
                      {element.name}
                    </h3>
                    <p className="font-body-md text-sm text-on-surface-variant flex-grow">
                      {element.description}
                    </p>
                  </motion.div>
                );
              })}
        </div>
      </div>
    </main>
  );
}
