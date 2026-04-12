import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Calendar, ArrowRight, X, Loader2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { usePublicData } from '@/hooks/usePublicData';
import { useTranslate } from '@/hooks/useTranslate';

interface Props {
  limit?: number;
  showHeader?: boolean;
  showAll?: boolean;
}

const ITEMS_PER_SECTION = 6;
const LOAD_MORE_COUNT = 12;

const VideoCard = ({ video, onPlay }: { video: any; onPlay: (id: string) => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    viewport={{ once: true, margin: '-40px' }}
  >
    <Card className="overflow-hidden group hover:shadow-dmk transition-all duration-500 border-0 shadow-md h-full bg-card/80 backdrop-blur-sm hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <div className="cursor-pointer" onClick={() => onPlay(video.id)}>
          <img
            src={video.thumbnail}
            alt={video.title}
            className={`w-full object-cover group-hover:scale-110 transition-transform duration-700 ${video.category === 'short' ? 'h-56 sm:h-64' : 'h-40 sm:h-48'}`}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-primary/30"
            >
              <Play className="h-6 w-6 text-primary-foreground fill-current ml-0.5" />
            </motion.div>
          </div>
          {/* Mobile play button always visible */}
          <div className="absolute inset-0 flex items-center justify-center md:hidden">
            <div className="w-12 h-12 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Play className="h-5 w-5 text-primary-foreground fill-current ml-0.5" />
            </div>
          </div>
          {video.channel_name && (
            <div className="absolute top-3 left-3">
              <span className="bg-foreground/70 backdrop-blur-sm text-background text-xs px-2.5 py-1 rounded-full font-medium">
                {video.channel_name}
              </span>
            </div>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors text-sm leading-snug">
          {video.translatedTitle || video.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {video.publish_date && new Date(video.publish_date).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

/* Sentinel for infinite scroll */
const InfiniteScrollTrigger = ({ onVisible, hasMore }: { onVisible: () => void; hasMore: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onVisible(); },
      { rootMargin: '200px' }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [onVisible, hasMore]);

  if (!hasMore) return null;
  return (
    <div ref={ref} className="flex justify-center py-8">
      <div className="flex items-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Loading more...</span>
      </div>
    </div>
  );
};

const VideoSection = ({ title, videos, allVideos, gridClass, showMore, onLoadMore, hasMore }: {
  title: string;
  videos: any[];
  allVideos: any[];
  gridClass: string;
  showMore: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  if (allVideos.length === 0) return null;

  return (
    <div className="mb-14">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 rounded-full bg-gradient-to-b from-primary to-secondary" />
        <h3 className="text-xl md:text-2xl font-bold">{title}</h3>
        <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full font-medium">
          {allVideos.length}
        </span>
      </div>
      <div className={`grid gap-4 md:gap-6 ${gridClass}`}>
        {videos.map((video: any) => (
          <VideoCard key={video.id} video={video} onPlay={setPlayingId} />
        ))}
      </div>

      {showMore && (
        <InfiniteScrollTrigger onVisible={onLoadMore} hasMore={hasMore} />
      )}

      {/* Inline player modal */}
      <AnimatePresence>
        {playingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setPlayingId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setPlayingId(null)}
                className="absolute -top-12 right-0 bg-card/20 backdrop-blur-sm text-background p-2 rounded-full hover:bg-card/40 transition-colors z-10"
              >
                <X className="h-5 w-5" />
              </button>
              <div
                className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  paddingBottom: allVideos.find(v => v.id === playingId)?.category === 'short' ? '177%' : '56.25%',
                  maxHeight: '80vh'
                }}
              >
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${allVideos.find((v: any) => v.id === playingId)?.youtube_id}?autoplay=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const VideosSection = ({ limit, showHeader = true, showAll = false }: Props) => {
  const { t } = useLanguage();
  const { videosQuery } = usePublicData();
  const { tr } = useTranslate();
  const allVideos = videosQuery.data || [];
  const location = useLocation();
  const isVideosPage = location.pathname === '/videos';
  const isFullView = showAll || isVideosPage;

  const channelGroups = useMemo(() => {
    const groups: Record<string, any[]> = {};
    for (const v of allVideos) {
      const ch = v.channel_name || 'Other';
      if (!groups[ch]) groups[ch] = [];
      groups[ch].push({ ...v, translatedTitle: tr(v.title) });
    }
    return Object.entries(groups);
  }, [allVideos, tr]);

  const [limits, setLimits] = useState<Record<string, number>>({});

  const getLimit = (ch: string) => limits[ch] || (isFullView ? LOAD_MORE_COUNT : (limit || ITEMS_PER_SECTION));
  const loadMore = useCallback((ch: string) => {
    setLimits(prev => ({ ...prev, [ch]: (prev[ch] || LOAD_MORE_COUNT) + LOAD_MORE_COUNT }));
  }, []);

  return (
    <section className="py-12 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {showHeader && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">{t('section.videos')}</h2>
              <p className="text-muted-foreground mt-1">{tr('Latest updates from DMK channels')}</p>
            </div>
            {!isVideosPage && (
              <Link to="/videos">
                <Button variant="outline" className="gap-2 rounded-xl">
                  {t('section.viewAll')} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </motion.div>
        )}

        {videosQuery.isLoading && (
          <div className="flex justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Loading videos...</span>
            </div>
          </div>
        )}

        {channelGroups.map(([channelName, videos]) => {
          const currentLimit = getLimit(channelName);
          return (
            <VideoSection
              key={channelName}
              title={channelName}
              videos={videos.slice(0, currentLimit)}
              allVideos={videos}
              gridClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              showMore={isFullView}
              hasMore={currentLimit < videos.length}
              onLoadMore={() => loadMore(channelName)}
            />
          );
        })}

        {!videosQuery.isLoading && allVideos.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Play className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No videos available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideosSection;
