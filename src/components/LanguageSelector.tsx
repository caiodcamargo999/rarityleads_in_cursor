import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe, Check } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'es', name: 'Español', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'pt', name: 'Português', flag: '🇧🇷', nativeName: 'Português' },
];

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'buttons';
  className?: string;
  onLanguageChange?: (languageCode: string) => void;
}

export const LanguageSelector = ({ 
  variant = 'dropdown', 
  className = '',
  onLanguageChange 
}: LanguageSelectorProps) => {
  const { i18n, t } = useTranslation();

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      localStorage.setItem('i18nextLng', languageCode);
      localStorage.setItem('ip-detected-language', languageCode);
      
      // Call the optional callback
      if (onLanguageChange) {
        onLanguageChange(languageCode);
      }
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  if (variant === 'buttons') {
    return (
      <div className={`space-y-3 ${className}`}>
        <label className="text-sm font-medium text-dark-text">
          {t('settings.language')}
        </label>
        <div className="grid grid-cols-2 gap-3">
          {languages.map((language) => (
            <Button
              key={language.code}
              variant={i18n.language === language.code ? "primary" : "outline"}
              onClick={() => changeLanguage(language.code)}
              className={`flex items-center justify-start gap-3 h-auto p-4 transition-all duration-200 ${
                i18n.language === language.code 
                  ? 'bg-purple-600 text-white border-purple-600' 
                  : 'bg-dark-bg-secondary border-dark-border hover:bg-dark-bg-tertiary'
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <div className="flex flex-col items-start">
                <span className="font-medium">{language.nativeName}</span>
                <span className="text-xs opacity-70">{language.name}</span>
              </div>
              {i18n.language === language.code && (
                <Check className="w-4 h-4 ml-auto" />
              )}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="text-sm font-medium text-dark-text">
        {t('settings.language')}
      </label>
      <Select value={i18n.language} onValueChange={changeLanguage}>
        <SelectTrigger className="w-full bg-dark-bg-secondary border-dark-border text-dark-text">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <SelectValue placeholder={t('settings.language')} />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-dark-bg-secondary border-dark-border">
          {languages.map((language) => (
            <SelectItem
              key={language.code}
              value={language.code}
              className="text-dark-text hover:bg-dark-bg-tertiary focus:bg-dark-bg-tertiary"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{language.flag}</span>
                <div className="flex flex-col">
                  <span className="font-medium">{language.nativeName}</span>
                  <span className="text-xs text-gray-400">{language.name}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}; 