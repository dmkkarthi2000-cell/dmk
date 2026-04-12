CREATE TABLE public.site_settings (
  id text PRIMARY KEY,
  value jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin full access site_settings" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');

-- Insert default values so we have something to read
INSERT INTO public.site_settings (id, value) VALUES
('hero_content', '{"title": "DMK News & Media", "subtitle": "Official Platform", "tagline": "Building a Progressive Tamil Nadu"}'),
('about_content', '{"title": "About Our Party", "leader": "M.K. Stalin", "leader_title": "President, DMK & Chief Minister of Tamil Nadu", "description": "Dravida Munnetra Kazhagam (DMK) is one of the major political parties in India, built on the principles of social justice, equality, and rationalism. Founded in 1949 by C.N. Annadurai, the party has been instrumental in shaping modern Tamil Nadu.", "stats": [{"label": "Members", "value": "2 Cr+"}, {"label": "Founded", "value": "1949"}, {"label": "Districts", "value": "38"}, {"label": "Terms in Power", "value": "5"}]}'),
('theme_colors', '{"primary": "10 90% 45%", "secondary": "0 0% 15%"}');
