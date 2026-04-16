import { useLanguage } from '@/contexts/LanguageContext';
import { usePublicData } from '@/hooks/usePublicData';
import { useTranslate } from '@/hooks/useTranslate';
import { motion } from 'framer-motion';
import { Youtube, Twitter, Facebook, Instagram } from 'lucide-react';

const iconMap: Record<string, any> = { youtube: Youtube, twitter: Twitter, facebook: Facebook, instagram: Instagram };

const gradientMap: Record<string, string> = {
  youtube: 'from-red-500 to-red-600',
  twitter: 'from-foreground/80 to-foreground',
  facebook: 'from-blue-500 to-blue-600',
  instagram: 'from-pink-500 via-purple-500 to-orange-400',
};

const defaultPlatforms = [
  { platform: 'youtube', name: 'YouTube', followers: '5.2M', url: 'https://youtube.com/@mkstalin' },
  { platform: 'twitter', name: 'Twitter / X', followers: '8.1M', url: '#' },
  { platform: 'facebook', name: 'Facebook', followers: '12M', url: '#' },
  { platform: 'instagram', name: 'Instagram', followers: '3.8M', url: '#' },
];

const SocialMediaSection = () => {
  const { t } = useLanguage();
  const { settingsQuery } = usePublicData();
  const { tr } = useTranslate();
  const settings = settingsQuery.data || {};
  const platforms = (settings as any).social_media || defaultPlatforms;

  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-10"
        >
          <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-2">{t('section.social')}</h2>
          <p className="text-xs md:text-sm text-muted-foreground">{tr('Follow DMK across platforms')}</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-3xl mx-auto">
          {platforms.map((p: any, i: number) => {
            const Icon = iconMap[p.platform] || Youtube;
            return (
              <motion.a
                key={p.platform}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group"
              >
                <div className="relative bg-card rounded-xl md:rounded-2xl p-4 md:p-6 text-center shadow-md hover:shadow-dmk transition-all duration-500 border border-border/50 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${gradientMap[p.platform] || 'from-primary to-primary/80'} rounded-lg md:rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-4 w-4 md:h-5 md:w-5 text-background" />
                    </div>
                    <div className="font-black text-lg md:text-2xl">{p.followers}</div>
                    <div className="text-[10px] md:text-xs text-muted-foreground mt-0.5">{p.name}</div>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SocialMediaSection;
