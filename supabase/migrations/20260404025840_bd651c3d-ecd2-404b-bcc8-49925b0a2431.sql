ALTER TABLE public.youtube_channels ADD COLUMN IF NOT EXISTS sync_videos boolean NOT NULL DEFAULT true;
ALTER TABLE public.youtube_channels ADD COLUMN IF NOT EXISTS sync_shorts boolean NOT NULL DEFAULT true;
ALTER TABLE public.youtube_channels ADD COLUMN IF NOT EXISTS sync_playlists boolean NOT NULL DEFAULT false;