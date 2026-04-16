import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Award, Users, Target, BookOpen } from 'lucide-react';
import { usePublicData } from '@/hooks/usePublicData';
import { useTranslate } from '@/hooks/useTranslate';

const AboutSection = () => {
  const { t } = useLanguage();
  const { settingsQuery } = usePublicData();
  const { tr } = useTranslate();

  const settings: any = settingsQuery.data || {};
  const aboutContent = settings.about_content || {
    title: 'About Our Party',
    leader: 'M.K. Stalin',
    leader_title: 'President, DMK & Chief Minister of Tamil Nadu',
    description: 'Dravida Munnetra Kazhagam (DMK) is one of the major political parties in India, built on the principles of social justice, equality, and rationalism.',
    stats: [
      { label: 'Members', value: '2 Cr+' },
      { label: 'Founded', value: '1949' },
      { label: 'Districts', value: '38' },
      { label: 'Terms in Power', value: '5' }
    ]
  };

  const principles = [
    'Social Justice and Equality',
    'Self-Respect and Rationalism',
    'Education for All',
    "Women's Empowerment",
    'Federal Rights & State Autonomy',
    'Economic Development',
  ];

  const icons = [Users, Award, Target, BookOpen];

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12"
        >
          <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-2">
            {tr(aboutContent.title) || t('section.about')}
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <div className="mb-6 md:mb-8">
              <h3 className="text-xl md:text-3xl font-black text-primary mb-1">
                {tr(aboutContent.leader) || t('about.leader')}
              </h3>
              <p className="text-muted-foreground text-[10px] md:text-sm uppercase tracking-[0.2em] font-bold">
                {tr(aboutContent.leader_title) || t('about.leaderTitle')}
              </p>
            </div>

            <p className="text-foreground/70 leading-relaxed mb-8 text-sm md:text-base max-w-2xl mx-auto lg:mx-0">
              {tr(aboutContent.description) || t('about.partyDesc')}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {aboutContent.stats?.map((stat: any, i: number) => {
                const Icon = icons[i % icons.length];
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="text-center p-4 border-0 shadow-md hover:shadow-dmk transition-all duration-500 hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-xl md:text-2xl font-black">{stat.value}</div>
                      <div className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider">{tr(stat.label)}</div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden border-0 shadow-xl rounded-2xl">
              <CardContent className="p-0">
                <div className="bg-dmk-gradient p-6 md:p-8 text-primary-foreground">
                  <h4 className="text-lg md:text-xl font-black mb-5 flex items-center gap-2">
                    <div className="w-1 h-6 bg-secondary rounded-full" />
                    {tr('Party Principles')}
                  </h4>
                  <ul className="space-y-3">
                    {principles.map((p, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3 text-sm"
                      >
                        <span className="w-6 h-6 shrink-0 rounded-full bg-secondary/20 flex items-center justify-center text-xs font-bold text-secondary">
                          {i + 1}
                        </span>
                        <span className="text-primary-foreground/90">{tr(p)}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
