import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import SocialMediaSection from '@/components/SocialMediaSection';
import VideosSection from '@/components/VideosSection';
import EventsSection from '@/components/EventsSection';
import NewsSection from '@/components/NewsSection';
import GallerySection from '@/components/GallerySection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import SEO from '@/components/SEO';

const Index = () => {
  return (
    <Layout>
      <SEO />
      <HeroSection />
      <SocialMediaSection />
      <VideosSection limit={3} />
      <EventsSection limit={4} />
      <NewsSection limit={3} />
      <GallerySection limit={8} />
      <AboutSection />
      <ContactSection />
    </Layout>
  );
};

export default Index;
