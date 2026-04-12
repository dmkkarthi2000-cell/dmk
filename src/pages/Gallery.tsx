import Layout from '@/components/Layout';
import GallerySection from '@/components/GallerySection';

const Gallery = () => (
  <Layout>
    <div className="pt-8">
      <GallerySection limit={16} showHeader={true} />
    </div>
  </Layout>
);

export default Gallery;
