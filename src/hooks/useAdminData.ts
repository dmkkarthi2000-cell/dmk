import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAdminData = () => {
  const queryClient = useQueryClient();

  // Settings
  const settingsQuery = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) throw error;
      return data;
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: any }) => {
      const { error } = await supabase.from('site_settings').upsert({ id, value });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      queryClient.invalidateQueries({ queryKey: ['public-settings'] });
      toast.success('Settings updated successfully');
    },
    onError: (err) => toast.error('Failed to update: ' + err.message),
  });

  // Events
  const eventsQuery = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const { data, error } = await supabase.from('events').select('*').order('date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addEventMutation = useMutation({
    mutationFn: async (event: any) => {
      const { error } = await supabase.from('events').insert([event]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      queryClient.invalidateQueries({ queryKey: ['public-events'] });
      toast.success('Event added successfully');
    },
    onError: (err) => toast.error('Failed to add event: ' + err.message),
  });

  const updateEventMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { error } = await supabase.from('events').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      queryClient.invalidateQueries({ queryKey: ['public-events'] });
      toast.success('Event updated');
    },
    onError: (err) => toast.error('Failed to update event: ' + err.message),
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      queryClient.invalidateQueries({ queryKey: ['public-events'] });
      toast.success('Event deleted');
    },
  });

  // YouTube Channels
  const channelsQuery = useQuery({
    queryKey: ['admin-channels'],
    queryFn: async () => {
      const { data, error } = await supabase.from('youtube_channels').select('*');
      if (error) throw error;
      return data;
    },
  });

  const addChannelMutation = useMutation({
    mutationFn: async (channel: any) => {
      const { error } = await supabase.from('youtube_channels').insert([channel]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-channels'] });
      toast.success('Channel added');
    },
  });

  const updateChannelMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { error } = await supabase.from('youtube_channels').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-channels'] }),
  });

  const deleteChannelMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('youtube_channels').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-channels'] }),
  });

  // Gallery
  const galleryQuery = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: async () => {
      const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addGalleryMutation = useMutation({
    mutationFn: async (item: any) => {
      const { error } = await supabase.from('gallery').insert([item]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      queryClient.invalidateQueries({ queryKey: ['public-gallery'] });
      toast.success('Image added to gallery');
    },
    onError: (err) => toast.error('Failed to add image: ' + err.message),
  });

  const updateGalleryMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { error } = await supabase.from('gallery').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      queryClient.invalidateQueries({ queryKey: ['public-gallery'] });
      toast.success('Image updated');
    },
  });

  const deleteGalleryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      queryClient.invalidateQueries({ queryKey: ['public-gallery'] });
      toast.success('Image deleted');
    },
  });

  // News
  const newsQuery = useQuery({
    queryKey: ['admin-news'],
    queryFn: async () => {
      const { data, error } = await supabase.from('news').select('*').order('publish_date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addNewsMutation = useMutation({
    mutationFn: async (item: any) => {
      const { error } = await supabase.from('news').insert([item]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      queryClient.invalidateQueries({ queryKey: ['public-news'] });
      toast.success('News added');
    },
    onError: (err) => toast.error('Failed to add news: ' + err.message),
  });

  const updateNewsMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { error } = await supabase.from('news').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      queryClient.invalidateQueries({ queryKey: ['public-news'] });
      toast.success('News updated');
    },
  });

  const deleteNewsMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      queryClient.invalidateQueries({ queryKey: ['public-news'] });
      toast.success('News deleted');
    },
  });

  // Videos
  const videosQuery = useQuery({
    queryKey: ['admin-videos'],
    queryFn: async () => {
      const { data, error } = await supabase.from('videos').select('*').order('publish_date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addVideoMutation = useMutation({
    mutationFn: async (item: any) => {
      const { error } = await supabase.from('videos').insert([item]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      queryClient.invalidateQueries({ queryKey: ['public-videos'] });
      toast.success('Video added');
    },
  });

  const updateVideoMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { error } = await supabase.from('videos').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      queryClient.invalidateQueries({ queryKey: ['public-videos'] });
      toast.success('Video updated');
    },
    onError: (err) => toast.error('Failed to update video: ' + err.message),
  });

  const deleteVideoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('videos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      queryClient.invalidateQueries({ queryKey: ['public-videos'] });
      toast.success('Video deleted');
    },
  });

  // Sync channel (fetches videos + shorts)
  const syncChannelMutation = useMutation({
    mutationFn: async (channelId: string) => {
      const { data, error } = await supabase.functions.invoke('sync-youtube', {
        body: { channel_id: channelId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      queryClient.invalidateQueries({ queryKey: ['public-videos'] });
      toast.success(data?.message || 'Videos synced successfully');
    },
    onError: (err) => toast.error('Sync failed: ' + err.message),
  });

  // Add single video by URL
  const addSingleVideoMutation = useMutation({
    mutationFn: async ({ video_url, channel_name }: { video_url: string; channel_name?: string }) => {
      const { data, error } = await supabase.functions.invoke('sync-youtube', {
        body: { action: 'add_single_video', video_url, channel_name },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      queryClient.invalidateQueries({ queryKey: ['public-videos'] });
      toast.success(data?.message || 'Video added');
    },
    onError: (err) => toast.error('Failed: ' + err.message),
  });

  // Sync playlist
  const syncPlaylistMutation = useMutation({
    mutationFn: async ({ playlist_url, channel_name }: { playlist_url: string; channel_name?: string }) => {
      const { data, error } = await supabase.functions.invoke('sync-youtube', {
        body: { action: 'sync_playlist', playlist_url, channel_name },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      queryClient.invalidateQueries({ queryKey: ['public-videos'] });
      toast.success(data?.message || 'Playlist synced');
    },
    onError: (err) => toast.error('Playlist sync failed: ' + err.message),
  });

  return {
    settingsQuery,
    updateSettingMutation,
    eventsQuery,
    addEventMutation,
    updateEventMutation,
    deleteEventMutation,
    channelsQuery,
    addChannelMutation,
    updateChannelMutation,
    deleteChannelMutation,
    galleryQuery,
    addGalleryMutation,
    updateGalleryMutation,
    deleteGalleryMutation,
    newsQuery,
    addNewsMutation,
    updateNewsMutation,
    deleteNewsMutation,
    videosQuery,
    addVideoMutation,
    updateVideoMutation,
    deleteVideoMutation,
    syncChannelMutation,
    addSingleVideoMutation,
    syncPlaylistMutation,
  };
};
