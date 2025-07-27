
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';
import frTranslations from './locales/fr.json';
import ptTranslations from './locales/pt.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  es: {
    translation: esTranslations,
  },
  fr: {
    translation: frTranslations,
  },
  pt: {
    translation: ptTranslations,
  },
};

// IP-based language detection mapping - only for supported languages
const ipLanguageMap: { [key: string]: string } = {
  // Portuguese-speaking countries
  'BR': 'pt', // Brazil
  'PT': 'pt', // Portugal
  'AO': 'pt', // Angola
  'MZ': 'pt', // Mozambique
  'CV': 'pt', // Cape Verde
  'GW': 'pt', // Guinea-Bissau
  'ST': 'pt', // São Tomé and Príncipe
  'TL': 'pt', // East Timor
  'MO': 'pt', // Macau
  
  // Spanish-speaking countries
  'ES': 'es', // Spain
  'MX': 'es', // Mexico
  'AR': 'es', // Argentina
  'CO': 'es', // Colombia
  'PE': 'es', // Peru
  'VE': 'es', // Venezuela
  'CL': 'es', // Chile
  'EC': 'es', // Ecuador
  'GT': 'es', // Guatemala
  'CU': 'es', // Cuba
  'BO': 'es', // Bolivia
  'DO': 'es', // Dominican Republic
  'HN': 'es', // Honduras
  'PY': 'es', // Paraguay
  'SV': 'es', // El Salvador
  'NI': 'es', // Nicaragua
  'CR': 'es', // Costa Rica
  'PA': 'es', // Panama
  'UY': 'es', // Uruguay
  'GQ': 'es', // Equatorial Guinea (Spanish-speaking)
  
  // French-speaking countries
  'FR': 'fr', // France
  'CA': 'fr', // Canada (Quebec)
  'BE': 'fr', // Belgium
  'CH': 'fr', // Switzerland
  'LU': 'fr', // Luxembourg
  'MC': 'fr', // Monaco
  'DZ': 'fr', // Algeria
  'MA': 'fr', // Morocco
  'TN': 'fr', // Tunisia
  'SN': 'fr', // Senegal
  'CI': 'fr', // Ivory Coast
  'BF': 'fr', // Burkina Faso
  'ML': 'fr', // Mali
  'NE': 'fr', // Niger
  'TD': 'fr', // Chad
  'MG': 'fr', // Madagascar
  'CM': 'fr', // Cameroon
  'TG': 'fr', // Togo
  'BJ': 'fr', // Benin
  'CF': 'fr', // Central African Republic
  'CG': 'fr', // Republic of the Congo
  'CD': 'fr', // Democratic Republic of the Congo
  'GA': 'fr', // Gabon
  'DJ': 'fr', // Djibouti
  'KM': 'fr', // Comoros
  'VU': 'fr', // Vanuatu
  'NC': 'fr', // New Caledonia
  'PF': 'fr', // French Polynesia
  'WF': 'fr', // Wallis and Futuna
  'PM': 'fr', // Saint Pierre and Miquelon
  'YT': 'fr', // Mayotte
  'RE': 'fr', // Réunion
  'BL': 'fr', // Saint Barthélemy
  'MF': 'fr', // Saint Martin
  'GP': 'fr', // Guadeloupe
  'MQ': 'fr', // Martinique
  'GF': 'fr', // French Guiana
};

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: typeof window !== 'undefined' ? ['localStorage', 'navigator', 'htmlTag'] : ['htmlTag'],
      caches: typeof window !== 'undefined' ? ['localStorage'] : [],
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',
    },
  }, (err, t) => {
    // Handle any initialization errors
    if (err) {
      console.warn('i18n initialization error:', err);
    }
  });

// Function to detect language from IP
export const detectLanguageFromIP = async (): Promise<string> => {
  // Check if we're on the client side
  if (typeof window === 'undefined') {
    return 'en'; // Default for server-side rendering
  }

  try {
    // Try to get country from IP using a free API
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (data.country_code) {
      const detectedLanguage = ipLanguageMap[data.country_code];
      if (detectedLanguage) {
        // Cache the detected language
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('ip-detected-language', detectedLanguage);
        }
        return detectedLanguage;
      }
    }
  } catch (error) {
    console.warn('Failed to detect language from IP:', error);
  }
  
  // Fallback to browser language only if it's supported
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language.split('-')[0];
    if (['en', 'es', 'fr', 'pt'].includes(browserLang)) {
      return browserLang;
    }
  }
  
  return 'en'; // Default fallback to English
};

// Function to initialize language detection
export const initializeLanguageDetection = async () => {
  const detectedLanguage = await detectLanguageFromIP();
  
  // Only change language if it's different from current
  if (i18n.language !== detectedLanguage) {
    await i18n.changeLanguage(detectedLanguage);
  }
};

export default i18n;
