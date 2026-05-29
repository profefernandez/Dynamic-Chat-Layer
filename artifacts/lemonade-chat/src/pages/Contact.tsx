import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import {
  useGetSiteSettings,
  useUpdateSiteSettings,
  getGetSiteSettingsQueryKey,
  Partner,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { useAdmin } from '../context/AdminContext';
import { useContent } from '../context/ContentContext';
import { EditableText } from '../components/EditableText';
import { EditableImage } from '../components/EditableImage';
import exhale from '@assets/exhale_1780015620584.png';
import galveston from '@assets/galveston_1780015620585.png';
import gcsw from '@assets/GCSW_1780015620585.png';
import jbertrand from '@assets/jbertrand_1780015629242.png';
import jewish from '@assets/jewish_1780015629244.png';
import pasadena from '@assets/pasadena_1780015637786.png';

const FALLBACK_IMAGES: Record<string, string> = {
  gcsw,
  exhale,
  galveston,
  jewish,
  jbertrand,
  pasadena,
};

const DEFAULT_PARTNERS: Partner[] = [
  { id: 'gcsw', name: 'Graduate College of Social Work', photoUrl: null },
  { id: 'exhale', name: 'Exhale Therapy, Wellness & Consulting', photoUrl: null },
  { id: 'galveston', name: 'Galveston College', photoUrl: null },
  { id: 'jewish', name: 'Jewish Family Service', photoUrl: null },
  { id: 'jbertrand', name: 'FOCUS Care Counseling Services', photoUrl: null },
  { id: 'pasadena', name: 'Pasadena Public Library', photoUrl: null },
];

export function Contact() {
  const { editMode } = useAdmin();
  const { get, save } = useContent();
  const queryClient = useQueryClient();
  const { data: settings } = useGetSiteSettings();
  const { mutate: updateSettings } = useUpdateSiteSettings();

  const partners = settings?.partners?.length ? settings.partners : DEFAULT_PARTNERS;

  const savePartners = (next: Partner[]) => {
    updateSettings(
      { data: { partners: next } },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetSiteSettingsQueryKey() }) },
    );
  };

  const updatePartner = (index: number, patch: Partial<Partner>) => {
    savePartners(partners.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  };

  const addPartner = () => {
    savePartners([
      ...partners,
      { id: `partner-${Date.now()}`, name: 'New Partner', photoUrl: null },
    ]);
  };

  const removePartner = (index: number) => {
    savePartners(partners.filter((_, i) => i !== index));
  };

  return (
    <main className="min-h-full flex flex-col items-center justify-start pt-6 pb-4 relative px-margin-mobile md:px-margin-desktop overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none bg-pattern opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] z-0 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tertiary/10 rounded-full blur-[100px] z-0 pointer-events-none" />

      <div className="z-10 text-center max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-center gap-4 mb-3 opacity-70">
          <div className="h-px w-12 bg-on-surface-variant" />
          <EditableText
            as="span"
            value={get('contact.eyebrow', 'Partners')}
            onSave={(v) => save('contact.eyebrow', v)}
            className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-on-surface-variant"
          />
          <div className="h-px w-12 bg-on-surface-variant" />
        </div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface leading-tight mb-3">
          <EditableText
            as="span"
            value={get('contact.titleLead', 'Collaborative Partners')}
            onSave={(v) => save('contact.titleLead', v)}
            styleKey="style:contact.titleLead"
          />{' '}
          <EditableText
            as="span"
            value={get('contact.titleAccent', 'in the Community')}
            onSave={(v) => save('contact.titleAccent', v)}
            styleKey="style:contact.titleAccent"
            className="text-primary text-glow italic"
          />
        </h1>
        <EditableText
          as="p"
          value={get(
            'contact.subtitle',
            "A few of the community partners and organizations we've had the privilege to work with.",
          )}
          onSave={(v) => save('contact.subtitle', v)}
          styleKey="style:contact.subtitle"
          multiline
          className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto block"
        />
      </div>

      <div className="z-10 w-full max-w-[1180px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="glass-card group relative overflow-hidden rounded-xl bg-surface/40"
            >
              <EditableImage
                value={partner.photoUrl}
                defaultSrc={FALLBACK_IMAGES[partner.id] ?? ''}
                onSave={(url) => updatePartner(i, { photoUrl: url })}
                alt={partner.name}
                className="w-full h-32 md:h-40 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent pointer-events-none" />
              {editMode && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Remove this partner?')) removePartner(i);
                  }}
                  className="absolute top-2 left-2 z-30 p-1.5 rounded bg-black/60 text-on-surface-variant hover:text-red-400"
                  title="Remove partner"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <div className="absolute inset-x-0 bottom-0 p-3 z-20">
                {editMode ? (
                  <EditableText
                    as="span"
                    value={partner.name}
                    onSave={(v) => updatePartner(i, { name: v })}
                    className="font-body-md text-xs md:text-sm text-white font-semibold leading-snug drop-shadow"
                  />
                ) : (
                  <p className="font-body-md text-xs md:text-sm text-white font-semibold leading-snug drop-shadow">
                    {partner.name}
                  </p>
                )}
              </div>
            </motion.div>
          ))}

          {editMode && (
            <button
              type="button"
              onClick={addPartner}
              className="glass-card rounded-xl h-32 md:h-40 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-primary/30 hover:border-primary/60 transition-all text-on-surface-variant hover:text-primary"
            >
              <Plus className="w-7 h-7" />
              <span className="font-body-md text-sm">Add partner</span>
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
