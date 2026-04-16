import Layout from '@/components/Layout';
import EventsSection from '@/components/EventsSection';
import SEO from '@/components/SEO';
import { useLanguage } from '@/contexts/LanguageContext';

const Events = () => {
  const { t } = useLanguage();
  return (
    <Layout>
      <SEO title={t('seo.title.events')} />
      <div className="pt-8">
        <EventsSection limit={12} showHeader={true} />
      </div>
    </Layout>
  );
};

export default Events;
