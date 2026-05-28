-- Idempotent seed for site_settings hero copy (task #3).
-- Ensures shipped environments render the exact provided HTML hero text.
INSERT INTO site_settings (id, hero_eyebrow, hero_title, hero_subtitle)
VALUES (
  1,
  'AI Literacy Education and Development',
  'Clarity',
  'Licensed Social Worker • AI Consultant • Educator • Website Designer'
)
ON CONFLICT (id) DO UPDATE SET
  hero_eyebrow = EXCLUDED.hero_eyebrow,
  hero_title = EXCLUDED.hero_title,
  hero_subtitle = EXCLUDED.hero_subtitle;
