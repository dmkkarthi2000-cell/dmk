import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  type?: string;
}

const SEO = ({ title, description, keywords, ogImage, type = 'website' }: SEOProps) => {
  const { language, t } = useLanguage();

  const siteTitle = t('seo.title.home');
  const defaultDescription = t('seo.description.home');
  const defaultKeywords = "DMK, M.K. Stalin, Tamil Nadu Politics, Dravida Munnetra Kazhagam, Social Justice";
  const defaultOgImage = "/Dravida_Munnetra_Kazhagam_logo.png";
  const siteUrl = window.location.origin;

  const seo = {
    title: title ? `${title} | DMK` : siteTitle,
    description: description || defaultDescription,
    keywords: keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords,
    image: ogImage || defaultOgImage,
    url: `${siteUrl}${window.location.pathname}`,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Dravida Munnetra Kazhagam (DMK)",
    "alternateName": "DMK",
    "url": siteUrl,
    "logo": `${siteUrl}/Dravida_Munnetra_Kazhagam_logo.png`,
    "founder": {
      "@type": "Person",
      "name": "C. N. Annadurai"
    },
    "leader": {
      "@type": "Person",
      "name": "M. K. Stalin",
      "jobTitle": "President of DMK & Chief Minister of Tamil Nadu",
      "image": `${siteUrl}/Dravida_Munnetra_Kazhagam_logo.png`
    },
    "foundingDate": "1949-09-17",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Anna Arivalayam, 367, 369, Anna Salai",
      "addressLocality": "Chennai",
      "addressRegion": "Tamil Nadu",
      "postalCode": "600018",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://twitter.com/arivalayam",
      "https://www.facebook.com/dmkofficial",
      "https://www.instagram.com/dmkofficial"
    ]
  };

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <html lang={language} />

      {/* OpenGraph tags */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content={type} />

      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
};

export default SEO;
