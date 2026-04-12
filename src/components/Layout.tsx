import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { usePublicData } from '@/hooks/usePublicData';
import { useTranslate } from '@/hooks/useTranslate';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Menu, X, Globe, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const navItems = [
  { key: 'nav.home', path: '/' },
  { key: 'nav.events', path: '/events' },
  { key: 'nav.videos', path: '/videos' },
  { key: 'nav.news', path: '/news' },
  { key: 'nav.gallery', path: '/gallery' },
  { key: 'nav.about', path: '/about' },
  { key: 'nav.contact', path: '/contact' },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { settingsQuery } = usePublicData();
  const { tr } = useTranslate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const settings = settingsQuery.data || {};
  const contact = (settings as any).contact_info || {
    address: 'Anna Arivalayam, Chennai, Tamil Nadu 600018',
    phone: '+91 44 2435 1096',
    email: 'info@dmk.in',
  };
  const footer = (settings as any).footer_content || {
    title: 'DMK News & Media',
    description: '',
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
              <span className="text-primary-foreground font-black text-base">D</span>
            </div>
            <span className="font-bold text-base hidden sm:block">
              <span className="text-primary">DMK</span>{' '}
              <span className="text-muted-foreground text-xs">News & Media</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                    : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
              className="rounded-xl h-9 w-9"
            >
              <Globe className="h-4 w-4" />
            </Button>
            <span className="text-[10px] font-black text-muted-foreground uppercase -ml-0.5">{language === 'en' ? 'EN' : 'த'}</span>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-xl h-9 w-9">
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="lg:hidden rounded-xl h-9 w-9" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-border/50 bg-card/95 backdrop-blur-xl"
            >
              <nav className="flex flex-col p-3 gap-1">
                {navItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      location.pathname === item.path
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    {t(item.key)}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-dmk-gradient text-primary-foreground">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                  <span className="text-primary-foreground font-black text-sm">D</span>
                </div>
                <h3 className="font-black text-lg">{tr(footer.title || 'DMK News & Media')}</h3>
              </div>
              <p className="text-primary-foreground/60 text-sm leading-relaxed">
                {tr(footer.description) || t('hero.subtitle')}
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-primary-foreground/80">
                {tr('Quick Links')}
              </h4>
              <div className="flex flex-col gap-2">
                {navItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors hover:translate-x-1 inline-block"
                  >
                    {t(item.key)}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-primary-foreground/80">
                {t('nav.contact')}
              </h4>
              <div className="space-y-3 text-sm text-primary-foreground/60">
                <p>{tr(contact.address)}</p>
                {contact.phone && <p>{contact.phone}</p>}
                {contact.email && <p>{contact.email}</p>}
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-primary-foreground/10 text-center text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} {footer.title || 'DMK News & Media'}. {t('footer.rights')}.
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-110 transition-transform"
          >
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
