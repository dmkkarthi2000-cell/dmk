import Layout from '@/components/Layout';
import ContactSection from '@/components/ContactSection';
import SEO from '@/components/SEO';
import { useLanguage } from '@/contexts/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();
  return (
    <Layout>
      <SEO title={t('seo.title.contact')} />
      <div className="pt-8">
        <ContactSection />
      </div>
    </Layout>
  );
};

export default Contact;
