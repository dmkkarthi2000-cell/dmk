import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePublicData } from '@/hooks/usePublicData';
import { useTranslate } from '@/hooks/useTranslate';

interface Props {
  limit?: number;
  showHeader?: boolean;
}

const EventsSection = ({ limit = 4, showHeader = true }: Props) => {
  const { t } = useLanguage();
  const { eventsQuery } = usePublicData();
  const { tr } = useTranslate();
  const events = (eventsQuery.data || []).slice(0, limit);

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {showHeader && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">{t('section.events')}</h2>
              <p className="text-muted-foreground mt-1">{tr('Stay updated with DMK activities')}</p>
            </div>
            <Link to="/events">
              <Button variant="outline" className="gap-2 rounded-xl">
                {t('section.viewAll')} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {events.map((event: any, i: number) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              <Link to={`/events/${event.id}`} className="block group">
                <Card className="overflow-hidden hover:shadow-dmk transition-all duration-500 flex flex-col sm:flex-row border-0 shadow-md bg-card/80 backdrop-blur-sm hover:-translate-y-1">
                  <div className="sm:w-44 md:w-52 shrink-0 overflow-hidden relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-44 sm:h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent sm:bg-gradient-to-r" />
                    {/* Date badge overlay */}
                    <div className="absolute bottom-3 left-3 sm:bottom-auto sm:top-3 bg-card/90 backdrop-blur-sm rounded-xl px-3 py-1.5 text-center shadow-lg">
                      <div className="text-lg font-black text-primary leading-none">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-[10px] uppercase text-muted-foreground font-bold">
                        {new Date(event.date).toLocaleDateString('en', { month: 'short' })}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4 md:p-5 flex flex-col justify-center flex-1">
                    <Badge className="w-fit mb-2 bg-secondary/20 text-secondary-foreground border-secondary/30 text-xs">
                      {tr(event.category)}
                    </Badge>
                    <h3 className="font-bold text-base md:text-lg mb-1.5 group-hover:text-primary transition-colors line-clamp-2">
                      {tr(event.title)}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{tr(event.description)}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(event.date).toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
