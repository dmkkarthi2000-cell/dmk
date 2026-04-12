import Layout from '@/components/Layout';
import VideosSection from '@/components/VideosSection';

const Videos = () => (
  <Layout>
    <div className="pt-8">
      <VideosSection showHeader={true} showAll={true} />
    </div>
  </Layout>
);

export default Videos;
