import { useLanguage } from '@/contexts/LanguageContext';
import { usePublicData } from '@/hooks/usePublicData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { useTranslate } from '@/hooks/useTranslate';

const ContactSection = () => {
  const { t } = useLanguage();
  const { settingsQuery } = usePublicData();
  const { tr } = useTranslate();
  const settings = settingsQuery.data || {};
  const contact = (settings as any).contact_info || {
    address: 'Anna Arivalayam, Chennai, Tamil Nadu 600018',
    phone: '+91 44 2435 1096',
    email: 'info@dmk.in',
  };

  const contactItems = [
    { icon: MapPin, title: tr('Address'), desc: tr(contact.address), color: 'from-primary to-primary/70' },
    { icon: Phone, title: tr('Phone'), desc: contact.phone, color: 'from-secondary to-secondary/70' },
    { icon: Mail, title: tr('Email'), desc: contact.email, color: 'from-accent to-accent/70' },
  ];

  return (
    <section className="py-12 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12"
        >
          <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-2">{t('section.contact')}</h2>
          <p className="text-xs md:text-sm text-muted-foreground">{tr('Get in touch with us')}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 pb-4 px-5">
                <CardTitle className="flex items-center gap-2 text-base md:text-xl">
                  <Send className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  {t('contact.send')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4 pt-4 px-5 pb-5">
                <Input placeholder={t('contact.name')} className="rounded-xl h-10 md:h-11 border-border/50 text-sm" />
                <Input type="email" placeholder={t('contact.email')} className="rounded-xl h-10 md:h-11 border-border/50 text-sm" />
                <Textarea placeholder={t('contact.message')} rows={4} className="rounded-xl border-border/50 resize-none text-sm" />
                <Button className="w-full shadow-dmk rounded-xl h-10 md:h-11 font-bold gap-2 text-sm">
                  {t('contact.send')} <Send className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {contactItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-md hover:shadow-dmk transition-all duration-500 hover:-translate-y-0.5 rounded-2xl">
                  <CardContent className="flex items-center gap-3 md:gap-4 p-4 md:p-5">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0 shadow-lg`}>
                      <item.icon className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs md:text-sm">{item.title}</h4>
                      <p className="text-[11px] md:text-sm text-muted-foreground leading-tight md:leading-normal">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
