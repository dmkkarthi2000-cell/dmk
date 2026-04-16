import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  'nav.home': { en: 'Home', ta: 'முகப்பு' },
  'nav.events': { en: 'Events', ta: 'நிகழ்வுகள்' },
  'nav.videos': { en: 'Videos', ta: 'காணொளிகள்' },
  'nav.news': { en: 'News', ta: 'செய்திகள்' },
  'nav.gallery': { en: 'Gallery', ta: 'படங்கள்' },
  'nav.about': { en: 'About', ta: 'பற்றி' },
  'nav.contact': { en: 'Contact', ta: 'தொடர்பு' },
  'hero.tagline': { en: 'Dravida Munnetra Kazhagam', ta: 'திராவிட முன்னேற்றக் கழகம்' },
  'hero.subtitle': { en: 'Building a Progressive Tamil Nadu', ta: 'முற்போக்கான தமிழ்நாட்டை கட்டமைத்தல்' },
  'hero.cta': { en: 'Explore More', ta: 'மேலும் அறிக' },
  'section.social': { en: 'Social Media', ta: 'சமூக ஊடகம்' },
  'section.videos': { en: 'Latest Videos', ta: 'சமீபத்திய காணொளிகள்' },
  'section.events': { en: 'Upcoming Events', ta: 'வரவிருக்கும் நிகழ்வுகள்' },
  'section.news': { en: 'DMK News', ta: 'திமுக செய்திகள்' },
  'section.gallery': { en: 'Photo Gallery', ta: 'புகைப்பட தொகுப்பு' },
  'section.about': { en: 'About DMK', ta: 'திமுக பற்றி' },
  'section.contact': { en: 'Contact Us', ta: 'எங்களை தொடர்பு கொள்ளுங்கள்' },
  'section.viewAll': { en: 'View All', ta: 'அனைத்தும் காண' },
  'about.leader': { en: 'Hon. M.K. Stalin', ta: 'மாண்புமிகு மு.க. ஸ்டாலின்' },
  'about.leaderTitle': { en: 'Chief Minister of Tamil Nadu & President of DMK', ta: 'தமிழ்நாடு முதலமைச்சர் & திமுக தலைவர்' },
  'about.partyDesc': {
    en: 'Dravida Munnetra Kazhagam (DMK) is one of the major political parties in India, primarily active in Tamil Nadu. Founded in 1949, DMK has been at the forefront of social justice, equality, and progressive governance.',
    ta: 'திராவிட முன்னேற்றக் கழகம் (திமுக) இந்தியாவின் முக்கிய அரசியல் கட்சிகளில் ஒன்றாகும், முக்கியமாக தமிழ்நாட்டில் செயல்படுகிறது. 1949 இல் நிறுவப்பட்ட திமுக சமூக நீதி, சமத்துவம் மற்றும் முற்போக்கான ஆட்சிக்கு முன்னணியில் உள்ளது.'
  },
  'footer.rights': { en: 'All Rights Reserved', ta: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை' },
  'contact.name': { en: 'Your Name', ta: 'உங்கள் பெயர்' },
  'contact.email': { en: 'Your Email', ta: 'உங்கள் மின்னஞ்சல்' },
  'contact.message': { en: 'Your Message', ta: 'உங்கள் செய்தி' },
  'contact.send': { en: 'Send Message', ta: 'செய்தி அனுப்பு' },
  'admin.login': { en: 'Admin Login', ta: 'நிர்வாகி உள்நுழைவு' },
  'admin.username': { en: 'Username', ta: 'பயனர் பெயர்' },
  'admin.password': { en: 'Password', ta: 'கடவுச்சொல்' },
  'watch': { en: 'Watch Now', ta: 'இப்போது பாருங்கள்' },
  'readMore': { en: 'Read More', ta: 'மேலும் படிக்க' },
  'seo.title.home': { en: 'DMK | Dravida Munnetra Kazhagam | M.K. Stalin', ta: 'திமுக | திராவிட முன்னேற்றக் கழகம் | மு.க. ஸ்டாலின்' },
  'seo.description.home': { en: 'Official website of Dravida Munnetra Kazhagam (DMK). Building a progressive Tamil Nadu under the leadership of M.K. Stalin.', ta: 'திராவிட முன்னேற்றக் கழகத்தின் (திமுக) அதிகாரப்பூர்வ இணையதளம். மு.க. ஸ்டாலின் தலைமையில் முற்போக்கான தமிழ்நாட்டை உருவாக்குதல்.' },
  'seo.title.events': { en: 'Upcoming Events | DMK Politics', ta: 'வரவிருக்கும் நிகழ்வுகள் | திமுக அரசியல்' },
  'seo.title.news': { en: 'Latest DMK News | Tamil Nadu Politics', ta: 'சமீபத்திய திமுக செய்திகள் | தமிழ்நாடு அரசியல்' },
  'seo.title.gallery': { en: 'Photo Gallery | M.K. Stalin & DMK', ta: 'புகைப்பட தொகுப்பு | மு.க. ஸ்டாலின் & திமுக' },
  'seo.title.videos': { en: 'Latest Videos | DMK Speeches & Events', ta: 'சமீபத்திய காணொளிகள் | திமுக உரைகள் மற்றும் நிகழ்வுகள்' },
  'seo.title.about': { en: 'About DMK | History & Leadership', ta: 'திமுக பற்றி | வரலாறு மற்றும் தலைமை' },
  'seo.title.contact': { en: 'Contact DMK | Get in Touch', ta: 'திமுகவை தொடர்பு கொள்ளுங்கள் | எங்களை தொடர்பு கொள்ள' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
