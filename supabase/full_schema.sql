-- FULL SCHEMA CONSOLIDATION for Supabase Migration

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.youtube_channels (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT true,
    sync_videos BOOLEAN NOT NULL DEFAULT true,
    sync_shorts BOOLEAN NOT NULL DEFAULT true,
    sync_playlists BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.videos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    thumbnail TEXT NOT NULL,
    publish_date TIMESTAMP WITH TIME ZONE NOT NULL,
    channel_name TEXT,
    youtube_id TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL DEFAULT 'video',
    source_type TEXT NOT NULL DEFAULT 'channel',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.news (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    headline TEXT NOT NULL,
    source TEXT NOT NULL,
    publish_date TIMESTAMP WITH TIME ZONE NOT NULL,
    image TEXT NOT NULL,
    url TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    src TEXT NOT NULL,
    alt TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT NOT NULL PRIMARY KEY,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.youtube_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies

-- Public read access for all tables
CREATE POLICY "Public read access for youtube_channels" ON public.youtube_channels FOR SELECT USING (true);
CREATE POLICY "Public read access for videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Public read access for events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public read access for news" ON public.news FOR SELECT USING (true);
CREATE POLICY "Public read access for gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Public read access for site_settings" ON public.site_settings FOR SELECT USING (true);

-- Allow all operations for anon and authenticated (Open for Migration)
CREATE POLICY "Allow all insert gallery" ON public.gallery FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow all update gallery" ON public.gallery FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete gallery" ON public.gallery FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "Allow all insert events" ON public.events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow all update events" ON public.events FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete events" ON public.events FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "Allow all insert news" ON public.news FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow all update news" ON public.news FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete news" ON public.news FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "Allow all insert videos" ON public.videos FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow all update videos" ON public.videos FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete videos" ON public.videos FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "Allow all insert youtube_channels" ON public.youtube_channels FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow all update youtube_channels" ON public.youtube_channels FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete youtube_channels" ON public.youtube_channels FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "Allow all insert site_settings" ON public.site_settings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow all update site_settings" ON public.site_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete site_settings" ON public.site_settings FOR DELETE TO anon, authenticated USING (true);

-- 4. Storage Configuration
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public access to media bucket" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Admin full access to media bucket" ON storage.objects FOR ALL USING (bucket_id = 'media' AND (auth.role() = 'authenticated' OR auth.role() = 'anon'));
