
-- Drop restrictive ALL policies and replace with proper per-operation policies

-- GALLERY
DROP POLICY IF EXISTS "Admin full access gallery" ON public.gallery;
CREATE POLICY "Allow all insert gallery" ON public.gallery FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow all update gallery" ON public.gallery FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete gallery" ON public.gallery FOR DELETE TO anon, authenticated USING (true);

-- EVENTS
DROP POLICY IF EXISTS "Admin full access events" ON public.events;
CREATE POLICY "Allow all insert events" ON public.events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow all update events" ON public.events FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete events" ON public.events FOR DELETE TO anon, authenticated USING (true);

-- NEWS
DROP POLICY IF EXISTS "Admin full access news" ON public.news;
CREATE POLICY "Allow all insert news" ON public.news FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow all update news" ON public.news FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete news" ON public.news FOR DELETE TO anon, authenticated USING (true);

-- VIDEOS
DROP POLICY IF EXISTS "Admin full access videos" ON public.videos;
CREATE POLICY "Allow all insert videos" ON public.videos FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow all update videos" ON public.videos FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete videos" ON public.videos FOR DELETE TO anon, authenticated USING (true);

-- YOUTUBE_CHANNELS
DROP POLICY IF EXISTS "Admin full access youtube_channels" ON public.youtube_channels;
CREATE POLICY "Allow all insert youtube_channels" ON public.youtube_channels FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow all update youtube_channels" ON public.youtube_channels FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete youtube_channels" ON public.youtube_channels FOR DELETE TO anon, authenticated USING (true);

-- SITE_SETTINGS
DROP POLICY IF EXISTS "Admin full access site_settings" ON public.site_settings;
CREATE POLICY "Allow all insert site_settings" ON public.site_settings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow all update site_settings" ON public.site_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete site_settings" ON public.site_settings FOR DELETE TO anon, authenticated USING (true);
