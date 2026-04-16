import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { usePublicData } from '@/hooks/usePublicData';
import { useTranslate } from '@/hooks/useTranslate';
import { Link } from 'react-router-dom';

const FloatingParticle = ({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) => (
  <motion.div
    className="absolute rounded-full bg-primary/20"
    style={{ left: x, top: y, width: size, height: size }}
    animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] }}
    transition={{ repeat: Infinity, duration: 4, delay, ease: 'easeInOut' }}
  />
);

const HeroSection = () => {
  const { t } = useLanguage();
  const { settingsQuery } = usePublicData();
  const { tr } = useTranslate();

  const settings: any = settingsQuery.data || {};
  const heroContent = settings.hero_content || {
    title: 'DMK News & Media',
    subtitle: 'Official Platform',
    tagline: 'Building a Progressive Tamil Nadu'
  };

  return (
    <section className="relative overflow-hidden min-h-[85vh] md:min-h-[80vh] flex items-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--dmk-gold)/0.2),transparent_60%)]" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Floating particles */}
      <FloatingParticle delay={0} x="10%" y="20%" size={8} />
      <FloatingParticle delay={1} x="80%" y="30%" size={6} />
      <FloatingParticle delay={2} x="60%" y="70%" size={10} />
      <FloatingParticle delay={0.5} x="25%" y="60%" size={5} />
      <FloatingParticle delay={1.5} x="90%" y="80%" size={7} />

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col items-center lg:items-start"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-md border border-border/50 rounded-full text-xs md:text-sm font-semibold mb-6 shadow-lg"
            >
              <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
              <span>{tr(heroContent.subtitle) || t('hero.tagline')}</span>
            </motion.div>
<br />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-foreground leading-[1.1] mb-6 tracking-tight max-w-2xl">
              {tr(heroContent.title)}
            </h1>
<br />
            <p className="text-sm md:text-lg text-foreground/60 mb-8 max-w-lg leading-relaxed">
              {tr(heroContent.tagline) || t('hero.subtitle')}
            </p>
<br />
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link to="/events" className="w-full sm:w-auto">
                <Button size="lg" className="gap-2 shadow-dmk w-full sm:w-auto text-base px-8 h-12 rounded-xl">
                  {t('hero.cta')} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/videos" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="gap-2 border-foreground/20 bg-card/50 backdrop-blur-sm w-full sm:w-auto text-base px-8 h-12 rounded-xl hover:bg-card/80">
                  <Play className="h-4 w-4" /> {t('section.videos')}
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative">
              {/* Outer glow ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                className="w-80 h-80 rounded-full border-2 border-dashed border-primary/20 flex items-center justify-center"
              >
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm flex items-center justify-center border border-primary/10">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-2xl shadow-primary/30">
                    <span className="text-5xl font-black text-primary-foreground tracking-wider">DMK</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating glass cards */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute -top-2 right-4 bg-card/90 backdrop-blur-xl shadow-xl rounded-2xl px-4 py-3 text-sm font-bold border border-border/50"
              >
                🎯 {tr('Social Justice')}
              </motion.div>
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, delay: 1, ease: 'easeInOut' }}
                className="absolute bottom-8 -left-6 bg-card/90 backdrop-blur-xl shadow-xl rounded-2xl px-4 py-3 text-sm font-bold border border-border/50"
              >
                📈 {tr('Progress')}
              </motion.div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, delay: 2, ease: 'easeInOut' }}
                className="absolute top-1/2 -right-10 bg-card/90 backdrop-blur-xl shadow-xl rounded-2xl px-4 py-3 text-sm font-bold border border-border/50"
              >
                ✊ {tr('Equality')}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
