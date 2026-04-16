import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePublicData } from '@/hooks/usePublicData';
import { useTranslate } from '@/hooks/useTranslate';

interface Props {
  limit?: number;
  showHeader?: boolean;
}

const NewsSection = ({ limit = 6, showHeader = true }: Props) => {
  const { t } = useLanguage();
  const { newsQuery } = usePublicData();
  const { tr } = useTranslate();
  const news = (newsQuery.data || []).slice(0, limit);

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
              <h2 className="text-2xl md:text-4xl font-black tracking-tight">{t('section.news')}</h2>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">{tr('Latest DMK and Tamil Nadu news')}</p>
            </div>
            <Link to="/news">
              <Button variant="outline" className="gap-2 rounded-xl">
                {t('section.viewAll')} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {news.map((item: any, i: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden group hover:shadow-dmk transition-all duration-500 border-0 shadow-md bg-card/80 backdrop-blur-sm hover:-translate-y-1 h-full flex flex-col">
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.headline}
                    className="w-full h-40 sm:h-44 object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
                  <span className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm text-foreground text-xs px-2.5 py-1 rounded-full font-semibold border border-border/50">
                    {tr(item.source)}
                  </span>
                </div>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold line-clamp-2 mb-3 group-hover:text-primary transition-colors text-sm md:text-base leading-snug flex-1">
                    {tr(item.headline)}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {item.publish_date && new Date(item.publish_date).toLocaleDateString()}
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline font-semibold"
                      onClick={e => e.stopPropagation()}
                    >
                      {t('readMore')} <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
