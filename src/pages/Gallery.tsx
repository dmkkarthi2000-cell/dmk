import Layout from '@/components/Layout';
import GallerySection from '@/components/GallerySection';
import SEO from '@/components/SEO';
import { useLanguage } from '@/contexts/LanguageContext';

const Gallery = () => {
  const { t } = useLanguage();
  return (
    <Layout>
      <SEO title={t('seo.title.gallery')} />
      <div className="pt-8">
        <GallerySection limit={16} showHeader={true} />
      </div>
    </Layout>
  );
};

export default Gallery;
