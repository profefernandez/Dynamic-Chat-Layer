import React from 'react';
import { useListElements, getListElementsQueryKey } from '@workspace/api-client-react';
import { useChat } from '../context/ChatContext';

/* Crystal images + Material icons per card — order matches DB seed order */
const CARD_VISUALS = [
  {
    badge: true,
    glowClass: 'bg-primary/20',
    glowHoverClass: 'group-hover:bg-primary/30',
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaW3wrGNFO6hmX7TlRw4hj3zZxiIkHV0_0-6xIqWvPqHl5-BOaP5UQ5NqKO6c-vWY7cGHs-t6g0I6-G_W7iJQTJG1jfGQdq0BcNFkQyBSiQaRfOlSv5xQw5h00fhQb7HT4FE_Q3vFXdh9hDcW36rN17G0KbAUVc4nKDlEFk0yeMgFl-tkl3zV8_-9xbUf-uuGjBJXKL-2TMcCdM9MfuMJIFKPLvULK8JFHqNz0Y7XGz4IUz-2pnV3N4CmqRxS0HJqVjsJmFiLUg',
    imgAlt: 'Glowing golden crystal structure representing community networks',
    imgClass: 'w-24 h-24 object-cover rounded-full border border-primary/30 z-10 opacity-80 mix-blend-screen shadow-[0_0_30px_rgba(242,202,80,0.3)]',
    iconClass: 'material-symbols-outlined absolute text-primary text-3xl z-20 mix-blend-screen',
    icon: 'groups',
    offset: false,
  },
  {
    badge: false,
    glowClass: 'bg-tertiary/20',
    glowHoverClass: 'group-hover:bg-tertiary/30',
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrzE3M-iY3ztcO9IJpasEOLYeYNUiL3LNlrCtnwoDHOPyo-Ynj-YEG9jJkx8yWnvj4fWzCzuSLEYohtKITeiPl7cAh1lzlbbULPpN2rHb07g91_r2pIhh6ASf7_1yHtOM4lwMGHzGwIzPi8F0v4wyb_wJ36mp8iRM-_wlzhvJrAbc681ZrF_VV94E79h6mf4s5YKo7DWGJ-PYJxKCE1bv9vUr1G0ennItFXIlI0RAT04Cw-2OPYy9OtSxVcIAoon1Lp7Xkk5C-WeM',
    imgAlt: 'Cool blue transparent geometric crystal representing corporate structure',
    imgClass: 'w-24 h-24 object-cover rounded-full border border-tertiary/30 z-10 opacity-80 mix-blend-screen shadow-[0_0_30px_rgba(151,176,255,0.3)]',
    iconClass: 'material-symbols-outlined absolute text-tertiary text-3xl z-20 mix-blend-screen',
    icon: 'corporate_fare',
    offset: true,
  },
  {
    badge: false,
    glowClass: 'bg-secondary/20',
    glowHoverClass: 'group-hover:bg-secondary/30',
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMdO9TdRwRSwWlyVrgMGBvMwlMju6cw0M5UuUnV8oNFENzc7IyrV_7DTcUkVln_51LnotlJIZE5gTXpKon0f8VqeUbRAcOdE3vKf14kQZmMPxxQcxh-V_-UkEf4_VCenTohnbCzB4QOqztyZjvsjUk_y6B7T33yOR4MsCDrxH7l4zVAnfs8uE7gkPQjDrAPkPfogHL-egydwSIMlkOidtXdbLWz89YIB3ie_8TmtUSJa1Q_TQIWS_5WGraivzMP6KWptfvqr3nWiU',
    imgAlt: 'Silver geometric crystal representing web structure',
    imgClass: 'w-24 h-24 object-cover rounded-full border border-secondary/30 z-10 opacity-80 mix-blend-screen shadow-[0_0_30px_rgba(195,198,207,0.3)]',
    iconClass: 'material-symbols-outlined absolute text-secondary text-3xl z-20 mix-blend-screen',
    icon: 'web',
    offset: false,
  },
  {
    badge: true,
    glowClass: 'bg-primary/20',
    glowHoverClass: 'group-hover:bg-primary/30',
    imgSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkiX7Bk0XbkrlVb_EsPJvUm264PsVHK8YJ7IFJ__xPIgSvF9E0xrYrN-3pOYGrsIpxR2g0isvIPy13L9N_1s-X1throZIFghbK43deJeHJ6tZ5k-HXoGWLMyy4VslCsS3_gULVZxPOmRnaY5jn9RYMf8Onn46D9dGEU5DpESljG8IKisEVk7fPVDCczXqI1HLwBF_oOcH-Cq2fMI0ouL9vWrbPfCC7ZhIBTTc-QgJt3e0szmDKncpJpmR-Kx7rLH9artnXW-Q2bvE',
    imgAlt: 'Glowing golden crystal structure representing vibrant community networks',
    imgClass: 'w-24 h-24 object-cover rounded-full border border-primary/30 z-10 opacity-80 mix-blend-screen shadow-[0_0_30px_rgba(242,202,80,0.4)]',
    iconClass: 'material-symbols-outlined absolute text-primary text-3xl z-20 mix-blend-screen',
    icon: 'hub',
    offset: true,
  },
];

export function Home() {
  const { data: elements, isLoading } = useListElements({ query: { queryKey: getListElementsQueryKey() } });
  const { sendMessage } = useChat();

  const items = elements ?? [];

  return (
   <>
    {/* Exact translation of the HTML <main> block */}
    <main className="flex-grow flex flex-col items-center justify-center pt-32 pb-20 relative px-margin-mobile md:px-margin-desktop selection:bg-primary/30">

      {/* Abstract Background Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-pattern opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] z-0 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tertiary/10 rounded-full blur-[100px] z-0 pointer-events-none" />

      {/* Hero Section */}
      <div className="z-10 text-center max-w-4xl mx-auto mb-20">
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
      <div className="z-10 w-full max-w-container-max mx-auto mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter relative">

          {/* Central Connection Lines (Decorative for Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2 z-0" />

          {isLoading
            ? [0, 1, 2, 3].map(i => (
                <div key={i} className="glass-card rounded-xl p-6 h-64 animate-pulse" />
              ))
            : items.slice(0, 4).map((element, index) => {
                const v = CARD_VISUALS[index] ?? CARD_VISUALS[0];
                return (
                  <div
                    key={element.id}
                    onClick={() => sendMessage(element.promptText, true)}
                    className={[
                      'glass-card rounded-xl p-6 relative group transition-transform hover:-translate-y-1 duration-300 z-10 flex flex-col h-full cursor-pointer',
                      v.offset ? 'lg:mt-12' : '',
                    ].join(' ')}
                  >
                    {/* NEW badge */}
                    {v.badge && (
                      <div className="absolute -top-3 left-6 bg-primary text-on-primary font-label-sm text-[10px] uppercase px-2 py-0.5 rounded-full z-20 shadow-[0_0_10px_rgba(242,202,80,0.5)]">
                        New
                      </div>
                    )}

                    {/* Crystal image area */}
                    <div className="h-32 w-full mb-6 relative flex items-center justify-center">
                      <div className={`absolute inset-0 ${v.glowClass} rounded-full blur-xl ${v.glowHoverClass} transition-colors`} />
                      <img
                        alt={v.imgAlt}
                        className={v.imgClass}
                        src={v.imgSrc}
                        onError={e => { (e.target as HTMLImageElement).style.opacity = '0'; }}
                      />
                      <span className={v.iconClass}>{v.icon}</span>
                    </div>

                    <h3 className="font-body-lg text-body-lg text-white font-semibold mb-3">
                      {element.name}
                    </h3>
                    <p className="font-body-md text-sm text-on-surface-variant flex-grow">
                      {element.description}
                    </p>
                  </div>
                );
              })}
        </div>
      </div>

    </main>

    {/* Footer — exact HTML translation, full-width sibling of <main> */}
    <footer className="w-full py-12 px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-8 bg-surface-container-lowest border-t border-white/5 relative z-10">
      <div className="font-headline-md text-headline-md text-primary">60 Watts of Clarity</div>
      <div className="font-body-md text-body-md text-on-surface-variant text-sm">
        © 2024 60 Watts of Clarity. Illuminating AI Literacy for a Brighter Future.
      </div>
      <div className="flex gap-6">
        <a href="#" className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm uppercase tracking-widest">Privacy Policy</a>
        <a href="#" className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm uppercase tracking-widest">Terms of Service</a>
        <a href="#" className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm uppercase tracking-widest">Contact Us</a>
        <a href="#" className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm uppercase tracking-widest">LinkedIn</a>
      </div>
    </footer>
  </>
  );
}
