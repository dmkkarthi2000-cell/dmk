import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePublicData } from '@/hooks/usePublicData';
import { useTranslate } from '@/hooks/useTranslate';

interface Props {
  limit?: number;
  showHeader?: boolean;
}

const GallerySection = ({ limit = 8, showHeader = true }: Props) => {
  const { t } = useLanguage();
  const { galleryQuery } = usePublicData();
  const { tr } = useTranslate();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  
  const images = (galleryQuery.data || []).slice(0, limit);

  const goNext = () => setSelectedIdx(prev => prev !== null ? (prev + 1) % images.length : null);
  const goPrev = () => setSelectedIdx(prev => prev !== null ? (prev - 1 + images.length) % images.length : null);

  return (
    <section className="py-10 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {showHeader && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center sm:items-center justify-between mb-8 md:mb-10 gap-4 text-center sm:text-left"
          >
            <div>
              <h2 className="text-2xl md:text-4xl font-black tracking-tight">{t('section.gallery')}</h2>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">{tr('Photos from events and campaigns')}</p>
            </div>
            <Link to="/gallery">
              <Button variant="outline" className="gap-2 rounded-xl">
                {t('section.viewAll')} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Masonry-inspired grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {images.map((img: any, i: number) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              viewport={{ once: true }}
              className={`cursor-pointer group relative overflow-hidden rounded-2xl ${
                i === 0 ? 'md:col-span-2 md:row-span-2' : ''
              } ${i === 0 ? 'aspect-square' : 'aspect-square'}`}
              onClick={() => setSelectedIdx(i)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-3 md:p-4">
                <span className="text-background text-xs md:text-sm font-medium translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {tr(img.description) || tr(img.alt)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox with navigation */}
        <AnimatePresence>
          {selectedIdx !== null && images[selectedIdx] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-foreground/90 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setSelectedIdx(null)}
            >
              <button
                className="absolute top-4 right-4 text-background/80 hover:text-background p-2 rounded-full bg-background/10 backdrop-blur-sm transition-colors z-10"
                onClick={() => setSelectedIdx(null)}
              >
                <X className="h-5 w-5" />
              </button>

              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-background/80 hover:text-background p-2 rounded-full bg-background/10 backdrop-blur-sm transition-colors z-10"
                    onClick={e => { e.stopPropagation(); goPrev(); }}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-background/80 hover:text-background p-2 rounded-full bg-background/10 backdrop-blur-sm transition-colors z-10"
                    onClick={e => { e.stopPropagation(); goNext(); }}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              <motion.div
                key={selectedIdx}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="max-w-full max-h-[85vh]"
                onClick={e => e.stopPropagation()}
              >
                <img
                  src={images[selectedIdx].src}
                  alt={images[selectedIdx].alt}
                  className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
                />
                {images[selectedIdx].description && (
                  <p className="text-center text-background/70 text-sm mt-3">
                    {tr(images[selectedIdx].description)}
                  </p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default GallerySection;
