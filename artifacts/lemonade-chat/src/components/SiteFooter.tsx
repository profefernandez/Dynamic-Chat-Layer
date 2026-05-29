import React from 'react';
import {
  useGetSiteSettings,
  useUpdateSiteSettings,
  getGetSiteSettingsQueryKey,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { useAdmin } from '../context/AdminContext';
import { EditableText } from './EditableText';

export function SiteFooter() {
  const { editMode } = useAdmin();
  const { data: settings } = useGetSiteSettings();
  const { mutate: updateSettings } = useUpdateSiteSettings();
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: getGetSiteSettingsQueryKey() });

  const footerCopyright =
    settings?.footerCopyright ??
    '© 2024 60 Watts of Clarity. All rights reserved.';
  const footerLinks =
    settings?.footerLinks ?? [
      { label: 'Privacy Policy', url: '#' },
      { label: 'Terms of Service', url: '#' },
      { label: 'Contact Us', url: '#' },
      { label: 'LinkedIn', url: '#' },
    ];

  const saveCopyright = (value: string) =>
    updateSettings({ data: { footerCopyright: value } }, { onSuccess: invalidate });

  const saveLinkLabel = (index: number) => (label: string) => {
    const next = footerLinks.map((l, i) => (i === index ? { ...l, label } : l));
    updateSettings({ data: { footerLinks: next } }, { onSuccess: invalidate });
  };

  const saveLinkUrl = (index: number) => (url: string) => {
    const next = footerLinks.map((l, i) => (i === index ? { ...l, url } : l));
    updateSettings({ data: { footerLinks: next } }, { onSuccess: invalidate });
  };

  return (
    <footer
      id="admin-footer"
      className="relative z-10 mt-12 px-margin-mobile md:px-margin-desktop py-5 flex flex-wrap items-center justify-between gap-4 bg-surface-container-lowest border-t border-white/10"
    >
      <EditableText
        as="div"
        value={footerCopyright}
        onSave={saveCopyright}
        className="font-body-md text-on-surface-variant text-xs whitespace-nowrap"
      />
      <div className="flex gap-8 flex-wrap items-center">
        {footerLinks.map((link, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            {editMode ? (
              <>
                <EditableText
                  as="span"
                  value={link.label}
                  onSave={saveLinkLabel(i)}
                  className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm uppercase tracking-widest"
                />
                <EditableText
                  as="span"
                  value={link.url}
                  onSave={saveLinkUrl(i)}
                  className="text-on-surface-variant/60 text-[10px] font-mono"
                />
              </>
            ) : (
              <a
                href={link.url}
                target={link.url.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm uppercase tracking-widest"
              >
                {link.label}
              </a>
            )}
          </div>
        ))}
      </div>
    </footer>
  );
}
