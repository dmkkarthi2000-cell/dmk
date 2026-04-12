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
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">{t('section.contact')}</h2>
          <p className="text-muted-foreground">{tr('Get in touch with us')}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  {t('contact.send')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <Input placeholder={t('contact.name')} className="rounded-xl h-11 border-border/50" />
                <Input type="email" placeholder={t('contact.email')} className="rounded-xl h-11 border-border/50" />
                <Textarea placeholder={t('contact.message')} rows={5} className="rounded-xl border-border/50 resize-none" />
                <Button className="w-full shadow-dmk rounded-xl h-11 font-bold gap-2">
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
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0 shadow-lg`}>
                      <item.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
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
