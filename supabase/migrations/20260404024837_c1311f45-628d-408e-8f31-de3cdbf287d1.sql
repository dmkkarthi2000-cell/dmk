ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'video';
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS source_type text NOT NULL DEFAULT 'channel';