import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePublicData = () => {
  const settingsQuery = useQuery({
    queryKey: ['public-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) throw error;
      const settings = data.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.value }), {});
      return settings;
    },
  });

  const eventsQuery = useQuery({
    queryKey: ['public-events'],
    queryFn: async () => {
      const { data, error } = await supabase.from('events').select('*').order('date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const galleryQuery = useQuery({
    queryKey: ['public-gallery'],
    queryFn: async () => {
      const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const newsQuery = useQuery({
    queryKey: ['public-news'],
    queryFn: async () => {
      const { data, error } = await supabase.from('news').select('*').order('publish_date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const videosQuery = useQuery({
    queryKey: ['public-videos'],
    queryFn: async () => {
      const { data, error } = await supabase.from('videos').select('*').order('publish_date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return {
    settingsQuery,
    eventsQuery,
    galleryQuery,
    newsQuery,
    videosQuery,
  };
};