import Layout from '@/components/Layout';
import AboutSection from '@/components/AboutSection';
import SEO from '@/components/SEO';
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();
  return (
    <Layout>
      <SEO title={t('seo.title.about')} />
      <div className="pt-8">
        <AboutSection />
      </div>
    </Layout>
  );
};

export default About;
