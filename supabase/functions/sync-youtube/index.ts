import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

interface VideoEntry {
  youtube_id: string;
  title: string;
  publish_date: string;
  thumbnail: string;
  url: string;
  channel_name: string;
  category: string;
  source_type: string;
}

async function fetchYtInitialData(pageUrl: string): Promise<any | null> {
  const res = await fetch(pageUrl, {
    headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" },
    redirect: "follow",
  });
  if (!res.ok) {
    console.log(`Failed to fetch ${pageUrl}: ${res.status}`);
    return null;
  }
  const html = await res.text();
  const dataMatch = html.match(/var ytInitialData = ({.*?});<\/script>/s);
  if (!dataMatch) {
    console.log(`No ytInitialData found in ${pageUrl}`);
    return null;
  }
  try { return JSON.parse(dataMatch[1]); } catch { return null; }
}

function extractRegularVideos(ytData: any, channelName: string, category: string, sourceType: string): VideoEntry[] {
  const videos: VideoEntry[] = [];
  const seen = new Set<string>();

  function walk(obj: any) {
    if (!obj || typeof obj !== "object") return;

    // playlistVideoRenderer (playlist pages)
    if (obj.playlistVideoRenderer) {
      const pvr = obj.playlistVideoRenderer;
      const videoId = pvr.videoId;
      if (videoId && !seen.has(videoId)) {
        seen.add(videoId);
        const titleText = pvr.title?.runs?.map((r: any) => r.text).join("") || pvr.title?.simpleText || "";
        videos.push({
          youtube_id: videoId,
          title: titleText,
          publish_date: new Date().toISOString(),
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          channel_name: channelName,
          category,
          source_type: sourceType,
        });
      }
    }

    // Regular video renderer (channel /videos page)
    if (obj.videoId && obj.title && !seen.has(obj.videoId)) {
      seen.add(obj.videoId);
      const titleText = typeof obj.title === "string"
        ? obj.title
        : obj.title?.runs?.map((r: any) => r.text).join("") || obj.title?.simpleText || "";
      const publishedText = obj.publishedTimeText?.simpleText || "";
      videos.push({
        youtube_id: obj.videoId,
        title: titleText,
        publish_date: estimateDate(publishedText),
        thumbnail: `https://img.youtube.com/vi/${obj.videoId}/hqdefault.jpg`,
        url: `https://www.youtube.com/watch?v=${obj.videoId}`,
        channel_name: channelName,
        category,
        source_type: sourceType,
      });
    }

    if (Array.isArray(obj)) {
      for (const item of obj) walk(item);
    } else {
      for (const key of Object.keys(obj)) {
        if (key === "videoId" || key === "title") continue;
        walk(obj[key]);
      }
    }
  }

  walk(ytData);
  return videos;
}

function extractShorts(ytData: any, channelName: string): VideoEntry[] {
  const shorts: VideoEntry[] = [];
  const seen = new Set<string>();

  function walk(obj: any) {
    if (!obj || typeof obj !== "object") return;

    // Reel item renderer (used for shorts)
    if (obj.reelItemRenderer) {
      const reel = obj.reelItemRenderer;
      const videoId = reel.videoId;
      if (videoId && !seen.has(videoId)) {
        seen.add(videoId);
        const title = reel.headline?.simpleText || reel.accessibility?.accessibilityData?.label || "Short";
        shorts.push({
          youtube_id: videoId,
          title,
          publish_date: new Date().toISOString(),
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          url: `https://www.youtube.com/shorts/${videoId}`,
          channel_name: channelName,
          category: "short",
          source_type: "channel",
        });
      }
    }

    // Shorts lockup view model (newer YouTube format)
    if (obj.shortsLockupViewModel) {
      const slvm = obj.shortsLockupViewModel;
      const entityId = slvm.entityId || "";
      // Extract video ID from entityId like "shorts-shelf-item-LYfNgzOYkYo"
      const entityVideoId = entityId.match(/([a-zA-Z0-9_-]{11})$/)?.[1] || "";
      const onTap = slvm.onTap?.innertubeCommand?.reelWatchEndpoint?.videoId
        || slvm.onTap?.innertubeCommand?.commandMetadata?.webCommandMetadata?.url?.match(/\/shorts\/([a-zA-Z0-9_-]{11})/)?.[1]
        || "";
      const videoId = onTap || entityVideoId;
      if (videoId && videoId.length === 11 && !seen.has(videoId)) {
        seen.add(videoId);
        const title = slvm.overlayMetadata?.primaryText?.content
          || slvm.accessibilityText || "Short";
        shorts.push({
          youtube_id: videoId,
          title,
          publish_date: new Date().toISOString(),
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          url: `https://www.youtube.com/shorts/${videoId}`,
          channel_name: channelName,
          category: "short",
          source_type: "channel",
        });
      }
    }

    // Also check richItemRenderer wrapping reelItemRenderer
    if (obj.richItemRenderer?.content?.reelItemRenderer) {
      const reel = obj.richItemRenderer.content.reelItemRenderer;
      const videoId = reel.videoId;
      if (videoId && !seen.has(videoId)) {
        seen.add(videoId);
        const title = reel.headline?.simpleText || "Short";
        shorts.push({
          youtube_id: videoId,
          title,
          publish_date: new Date().toISOString(),
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          url: `https://www.youtube.com/shorts/${videoId}`,
          channel_name: channelName,
          category: "short",
          source_type: "channel",
        });
      }
    }

    if (Array.isArray(obj)) {
      for (const item of obj) walk(item);
    } else {
      for (const key of Object.keys(obj)) {
        walk(obj[key]);
      }
    }
  }

  walk(ytData);
  return shorts;
}

async function fetchChannelPlaylists(baseUrl: string): Promise<string[]> {
  const ytData = await fetchYtInitialData(baseUrl + "/playlists");
  if (!ytData) return [];

  const playlistIds = new Set<string>();
  function extract(obj: any) {
    if (!obj || typeof obj !== "object") return;
    if (obj.playlistId && typeof obj.playlistId === "string") {
      playlistIds.add(obj.playlistId);
    }
    if (Array.isArray(obj)) {
      for (const item of obj) extract(item);
    } else {
      for (const key of Object.keys(obj)) extract(obj[key]);
    }
  }
  extract(ytData);
  console.log(`Found ${playlistIds.size} playlists from ${baseUrl}`);
  return Array.from(playlistIds);
}

function estimateDate(relativeText: string): string {
  const now = new Date();
  if (!relativeText) return now.toISOString();
  const match = relativeText.match(/(\d+)\s+(minute|hour|day|week|month|year)/i);
  if (!match) return now.toISOString();
  const num = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  const ms: Record<string, number> = {
    minute: 60_000, hour: 3_600_000, day: 86_400_000,
    week: 604_800_000, month: 2_592_000_000, year: 31_536_000_000,
  };
  return new Date(now.getTime() - num * (ms[unit] || 0)).toISOString();
}

function extractVideoIdFromUrl(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function extractPlaylistId(url: string): string | null {
  const m = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

async function upsertVideos(supabase: any, entries: VideoEntry[]): Promise<{ inserted: number; total: number }> {
  if (entries.length === 0) return { inserted: 0, total: 0 };
  
  // Deduplicate by youtube_id
  const uniqueMap = new Map<string, VideoEntry>();
  for (const e of entries) {
    if (!uniqueMap.has(e.youtube_id)) uniqueMap.set(e.youtube_id, e);
  }
  const uniqueEntries = Array.from(uniqueMap.values());
  
  const { data: existing } = await supabase
    .from("videos").select("youtube_id")
    .in("youtube_id", uniqueEntries.map(e => e.youtube_id));
  const existingIds = new Set((existing || []).map((v: any) => v.youtube_id));
  const newVideos = uniqueEntries.filter(e => !existingIds.has(e.youtube_id));
  if (newVideos.length > 0) {
    const { error } = await supabase.from("videos").insert(newVideos);
    if (error) throw new Error("Insert failed: " + error.message);
  }
  return { inserted: newVideos.length, total: uniqueEntries.length };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    const { action, channel_id, video_url, playlist_url, channel_name } = body;

    // Action: add_single_video
    if (action === "add_single_video") {
      if (!video_url) {
        return new Response(JSON.stringify({ error: "video_url is required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const videoId = extractVideoIdFromUrl(video_url);
      if (!videoId) {
        return new Response(JSON.stringify({ error: "Could not extract video ID from URL" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const isShort = video_url.includes("/shorts/");
      const category = isShort ? "short" : "video";
      const { data: existing } = await supabase.from("videos").select("id").eq("youtube_id", videoId).maybeSingle();
      if (existing) {
        return new Response(JSON.stringify({ message: "Video already exists", synced: 0 }), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      let title = "Untitled Video";
      try {
        const oembed = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
        if (oembed.ok) { const data = await oembed.json(); title = data.title || title; }
      } catch {}
      const { error: insertErr } = await supabase.from("videos").insert([{
        youtube_id: videoId, title,
        publish_date: new Date().toISOString(),
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        url: isShort ? `https://www.youtube.com/shorts/${videoId}` : `https://www.youtube.com/watch?v=${videoId}`,
        channel_name: channel_name || "Manual", category, source_type: "manual",
      }]);
      if (insertErr) {
        return new Response(JSON.stringify({ error: insertErr.message }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ message: `Added ${category}: ${title}`, synced: 1 }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Action: sync_playlist
    if (action === "sync_playlist") {
      if (!playlist_url) {
        return new Response(JSON.stringify({ error: "playlist_url is required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const playlistId = extractPlaylistId(playlist_url);
      if (!playlistId) {
        return new Response(JSON.stringify({ error: "Could not extract playlist ID" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const ytData = await fetchYtInitialData(`https://www.youtube.com/playlist?list=${playlistId}`);
      const entries = ytData ? extractRegularVideos(ytData, channel_name || "Playlist", "video", "playlist") : [];
      const result = await upsertVideos(supabase, entries);
      return new Response(JSON.stringify({
        message: `Synced ${result.inserted} videos from playlist`,
        synced: result.inserted, total_in_feed: result.total,
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Default: sync_channel
    if (!channel_id) {
      return new Response(JSON.stringify({ error: "channel_id is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: channel, error: chErr } = await supabase
      .from("youtube_channels").select("*").eq("id", channel_id).single();

    if (chErr || !channel) {
      return new Response(JSON.stringify({ error: "Channel not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const baseUrl = channel.url.trim().replace(/\/+$/, "").replace(/\?.*$/, "");
    const syncVideos = channel.sync_videos !== false;
    const syncShorts = channel.sync_shorts !== false;
    const syncPlaylists = channel.sync_playlists === true;

    let videoEntries: VideoEntry[] = [];
    let shortEntries: VideoEntry[] = [];
    let playlistEntries: VideoEntry[] = [];

    // Fetch regular videos
    if (syncVideos) {
      console.log("Fetching videos from:", baseUrl + "/videos");
      try {
        const ytData = await fetchYtInitialData(baseUrl + "/videos");
        if (ytData) videoEntries = extractRegularVideos(ytData, channel.name, "video", "channel");
      } catch (e) { console.log("Video fetch error:", e); }
    }

    // Fetch shorts - uses dedicated shorts extractor
    if (syncShorts) {
      console.log("Fetching shorts from:", baseUrl + "/shorts");
      try {
        const ytData = await fetchYtInitialData(baseUrl + "/shorts");
        if (ytData) {
          shortEntries = extractShorts(ytData, channel.name);
          console.log(`Extracted ${shortEntries.length} shorts`);
          // If dedicated extractor found none, try regular extractor as fallback
          if (shortEntries.length === 0) {
            shortEntries = extractRegularVideos(ytData, channel.name, "short", "channel");
            // Mark them as shorts URLs
            shortEntries = shortEntries.map(e => ({
              ...e,
              category: "short",
              url: `https://www.youtube.com/shorts/${e.youtube_id}`,
            }));
            console.log(`Fallback extracted ${shortEntries.length} shorts`);
          }
        }
      } catch (e) { console.log("Shorts fetch error:", e); }
    }

    // Fetch playlists
    if (syncPlaylists) {
      const playlistIds = await fetchChannelPlaylists(baseUrl);
      console.log(`Found ${playlistIds.length} playlists, processing up to 5`);
      // Process playlists in parallel (max 5 to avoid timeout)
      const playlistResults = await Promise.allSettled(
        playlistIds.slice(0, 5).map(async (plId) => {
          const ytData = await fetchYtInitialData(`https://www.youtube.com/playlist?list=${plId}`);
          if (!ytData) return [];
          // Try both regular videos and shorts extractors since playlists can contain either
          const regular = extractRegularVideos(ytData, channel.name, "video", "playlist");
          const shortsFromPl = extractShorts(ytData, channel.name).map(s => ({ ...s, source_type: "playlist" }));
          console.log(`Playlist ${plId}: ${regular.length} videos, ${shortsFromPl.length} shorts`);
          return [...regular, ...shortsFromPl];
        })
      );
      for (const r of playlistResults) {
        if (r.status === "fulfilled") playlistEntries.push(...r.value);
        else console.log("Playlist fetch failed:", r.reason);
      }
      console.log(`Extracted ${playlistEntries.length} playlist videos`);
    }

    const allEntries = [...videoEntries, ...shortEntries, ...playlistEntries];
    const result = await upsertVideos(supabase, allEntries);

    return new Response(JSON.stringify({
      message: `Synced ${result.inserted} new items from ${channel.name} (${videoEntries.length} videos, ${shortEntries.length} shorts, ${playlistEntries.length} playlist videos)`,
      synced: result.inserted,
      total_videos: videoEntries.length,
      total_shorts: shortEntries.length,
      total_playlists: playlistEntries.length,
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Sync error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
