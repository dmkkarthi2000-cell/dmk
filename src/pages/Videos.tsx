import Layout from '@/components/Layout';
import VideosSection from '@/components/VideosSection';
import SEO from '@/components/SEO';
import { useLanguage } from '@/contexts/LanguageContext';

const Videos = () => {
  const { t } = useLanguage();
  return (
    <Layout>
      <SEO title={t('seo.title.videos')} />
      <div className="pt-8">
        <VideosSection showHeader={true} showAll={true} />
      </div>
    </Layout>
  );
};

export default Videos;
