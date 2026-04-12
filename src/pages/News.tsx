import Layout from '@/components/Layout';
import NewsSection from '@/components/NewsSection';

const News = () => (
  <Layout>
    <div className="pt-8">
      <NewsSection limit={12} showHeader={true} />
    </div>
  </Layout>
);

export default News;
