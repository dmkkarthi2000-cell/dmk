import Layout from '@/components/Layout';
import NewsSection from '@/components/NewsSection';
import SEO from '@/components/SEO';
import { useLanguage } from '@/contexts/LanguageContext';

const News = () => {
  const { t } = useLanguage();
  return (
    <Layout>
      <SEO title={t('seo.title.news')} />
      <div className="pt-8">
        <NewsSection limit={12} showHeader={true} />
      </div>
    </Layout>
  );
};

export default News;
