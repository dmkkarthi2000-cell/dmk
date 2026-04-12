CREATE TABLE public.youtube_channels (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.videos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    thumbnail TEXT NOT NULL,
    publish_date TIMESTAMP WITH TIME ZONE NOT NULL,
    channel_name TEXT,
    youtube_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.news (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    headline TEXT NOT NULL,
    source TEXT NOT NULL,
    publish_date TIMESTAMP WITH TIME ZONE NOT NULL,
    image TEXT NOT NULL,
    url TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.gallery (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    src TEXT NOT NULL,
    alt TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.youtube_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public read access for youtube_channels" ON public.youtube_channels FOR SELECT USING (true);
CREATE POLICY "Public read access for videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Public read access for events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public read access for news" ON public.news FOR SELECT USING (true);
CREATE POLICY "Public read access for gallery" ON public.gallery FOR SELECT USING (true);

-- Admin (authenticated) full access policies
CREATE POLICY "Admin full access youtube_channels" ON public.youtube_channels FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access videos" ON public.videos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access events" ON public.events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access news" ON public.news FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access gallery" ON public.gallery FOR ALL USING (auth.role() = 'authenticated');

-- Create storage bucket for media uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public access to media bucket" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Admin full access to media bucket" ON storage.objects FOR ALL USING (bucket_id = 'media' AND auth.role() = 'authenticated');