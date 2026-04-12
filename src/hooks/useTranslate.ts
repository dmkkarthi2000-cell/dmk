import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

// Global cache persists across component mounts
const translationCache = new Map<string, string>();

export const useTranslate = () => {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<Map<string, string>>(new Map());
  const [isTranslating, setIsTranslating] = useState(false);
  const pendingRef = useRef<Set<string>>(new Set());
  const batchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const processBatch = useCallback(async () => {
    const batch = Array.from(pendingRef.current).filter(
      (t) => t && t.trim() && !translationCache.has(`ta:${t}`)
    );
    pendingRef.current.clear();

    if (batch.length === 0) return;

    setIsTranslating(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate', {
        body: { texts: batch, target_lang: 'ta' },
      });

      if (error) throw error;
      if (data?.translations) {
        const newTranslations = new Map(translations);
        batch.forEach((original, i) => {
          const translated = data.translations[i] || original;
          translationCache.set(`ta:${original}`, translated);
          newTranslations.set(original, translated);
        });
        setTranslations(new Map(newTranslations));
      }
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  }, [translations]);

  const queueTranslation = useCallback((text: string) => {
    if (!text || !text.trim()) return;
    if (translationCache.has(`ta:${text}`)) return;
    
    pendingRef.current.add(text);
    
    if (batchTimerRef.current) clearTimeout(batchTimerRef.current);
    batchTimerRef.current = setTimeout(() => processBatch(), 300);
  }, [processBatch]);

  // Translate a single string - returns translated version if Tamil, else original
  const tr = useCallback(
    (text: string | null | undefined): string => {
      if (!text) return '';
      if (language === 'en') return text;

      const cached = translationCache.get(`ta:${text}`);
      if (cached) return cached;

      // Queue for translation
      queueTranslation(text);
      return translations.get(text) || text; // Return original while loading
    },
    [language, translations, queueTranslation]
  );

  // Translate an array of strings
  const trArray = useCallback(
    (texts: (string | null | undefined)[]): string[] => {
      return texts.map((t) => tr(t || ''));
    },
    [tr]
  );

  // Bulk queue texts for pre-fetching
  const prefetch = useCallback(
    (texts: (string | null | undefined)[]) => {
      if (language === 'en') return;
      texts.forEach((t) => {
        if (t && t.trim()) queueTranslation(t);
      });
    },
    [language, queueTranslation]
  );

  return { tr, trArray, prefetch, isTranslating, language };
};
