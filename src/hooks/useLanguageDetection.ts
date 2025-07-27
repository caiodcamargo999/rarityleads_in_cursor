import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useLanguageDetection = () => {
  const { i18n } = useTranslation();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const checkInitialization = () => {
      try {
        // Check if i18n is ready
        if (i18n.isInitialized) {
          setIsInitialized(true);
          setIsLoading(false);
        } else {
          // Wait for i18n to be ready
          setTimeout(checkInitialization, 100);
        }
      } catch (error) {
        console.warn('Failed to check i18n initialization:', error);
        setIsInitialized(true);
        setIsLoading(false);
      }
    };

    checkInitialization();
  }, [i18n]);

  const changeLanguage = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      localStorage.setItem('i18nextLng', languageCode);
      localStorage.setItem('ip-detected-language', languageCode);
      return true;
    } catch (error) {
      console.error('Failed to change language:', error);
      return false;
    }
  };

  return {
    currentLanguage: i18n.language,
    changeLanguage,
    isInitialized,
    isLoading,
    isReady: !isLoading && isInitialized,
  };
}; 