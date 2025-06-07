/**
 * Rarity Leads Internationalization System
 * Complete i18n solution with language switching and dynamic content loading
 */

class I18nManager {
  constructor() {
    this.currentLanguage = 'en';
    this.translations = {};
    this.supportedLanguages = {
      'en': { name: 'English', flag: '🇺🇸', code: 'en' },
      'pt-BR': { name: 'Português', flag: '🇧🇷', code: 'pt-BR' },
      'es': { name: 'Español', flag: '🇪🇸', code: 'es' },
      'fr': { name: 'Français', flag: '🇫🇷', code: 'fr' }
    };
    this.fallbackLanguage = 'en';
    this.isLoading = false;
    
    this.init();
  }

  async init() {
    // Get saved language or detect from browser
    this.currentLanguage = this.getSavedLanguage() || this.detectBrowserLanguage();
    
    // Load initial translations
    await this.loadTranslations(this.currentLanguage);
    
    // Apply translations to current page
    this.applyTranslations();
    
    // Setup language switcher
    this.setupLanguageSwitcher();
    
    // Setup mutation observer for dynamic content
    this.setupMutationObserver();
  }

  getSavedLanguage() {
    return localStorage.getItem('rarity-leads-language');
  }

  detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    
    // Check for exact match
    if (this.supportedLanguages[browserLang]) {
      return browserLang;
    }
    
    // Check for language code match (e.g., 'pt' for 'pt-BR')
    const langCode = browserLang.split('-')[0];
    for (const [key, value] of Object.entries(this.supportedLanguages)) {
      if (key.startsWith(langCode)) {
        return key;
      }
    }
    
    return this.fallbackLanguage;
  }

  async loadTranslations(language) {
    if (this.translations[language]) {
      return this.translations[language];
    }

    this.isLoading = true;
    
    try {
      const response = await fetch(`/i18n/${language}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load translations for ${language}`);
      }
      
      const translations = await response.json();
      this.translations[language] = translations;
      
      return translations;
    } catch (error) {
      console.warn(`Failed to load translations for ${language}:`, error);
      
      // Load fallback language if not already loaded
      if (language !== this.fallbackLanguage && !this.translations[this.fallbackLanguage]) {
        return await this.loadTranslations(this.fallbackLanguage);
      }
      
      return this.translations[this.fallbackLanguage] || {};
    } finally {
      this.isLoading = false;
    }
  }

  t(key, params = {}) {
    const translation = this.getNestedValue(this.translations[this.currentLanguage], key) ||
                       this.getNestedValue(this.translations[this.fallbackLanguage], key) ||
                       key;
    
    // Replace parameters in translation
    return this.interpolate(translation, params);
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
  }

  interpolate(text, params) {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => params[key] || match);
  }

  async switchLanguage(language) {
    if (!this.supportedLanguages[language] || language === this.currentLanguage) {
      return;
    }

    // Show loading state
    this.showLoadingState();

    try {
      // Load translations for new language
      await this.loadTranslations(language);
      
      // Update current language
      this.currentLanguage = language;
      
      // Save to localStorage
      localStorage.setItem('rarity-leads-language', language);
      
      // Update document language
      document.documentElement.lang = language;
      
      // Apply translations
      this.applyTranslations();
      
      // Update language switcher
      this.updateLanguageSwitcher();
      
      // Trigger custom event
      window.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language, translations: this.translations[language] }
      }));
      
    } catch (error) {
      console.error('Failed to switch language:', error);
    } finally {
      this.hideLoadingState();
    }
  }

  applyTranslations() {
    // Update page title and meta
    this.updatePageMeta();
    
    // Translate elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      
      if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'email' || element.type === 'password')) {
        element.placeholder = translation;
      } else {
        element.textContent = translation;
      }
    });

    // Translate elements with data-i18n-html attribute (for HTML content)
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
      const key = element.getAttribute('data-i18n-html');
      const translation = this.t(key);
      element.innerHTML = translation;
    });

    // Translate attributes
    document.querySelectorAll('[data-i18n-attr]').forEach(element => {
      const attrData = element.getAttribute('data-i18n-attr');
      const [attr, key] = attrData.split(':');
      const translation = this.t(key);
      element.setAttribute(attr, translation);
    });
  }

  updatePageMeta() {
    const currentTranslations = this.translations[this.currentLanguage];
    if (!currentTranslations || !currentTranslations.meta) return;

    // Update title
    if (currentTranslations.meta.title) {
      document.title = currentTranslations.meta.title;
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && currentTranslations.meta.description) {
      metaDescription.setAttribute('content', currentTranslations.meta.description);
    }
  }

  setupLanguageSwitcher() {
    // Create language switcher if it doesn't exist
    let languageSwitcher = document.querySelector('.language-selector');
    
    if (!languageSwitcher) {
      languageSwitcher = this.createLanguageSwitcher();
    }

    this.updateLanguageSwitcher();
    this.attachLanguageSwitcherEvents();
  }

  createLanguageSwitcher() {
    const nav = document.querySelector('.nav-links') || document.querySelector('nav');
    if (!nav) return null;

    const languageSelector = document.createElement('div');
    languageSelector.className = 'language-selector';
    languageSelector.innerHTML = `
      <button class="current-lang" aria-label="Select language">
        <span class="lang-flag"></span>
        <span class="lang-code"></span>
        <i class="fas fa-chevron-down"></i>
      </button>
      <div class="lang-dropdown">
        ${Object.entries(this.supportedLanguages).map(([code, lang]) => `
          <a href="#" data-lang="${code}" class="lang-option">
            <span class="lang-flag">${lang.flag}</span>
            <span class="lang-name">${lang.name}</span>
          </a>
        `).join('')}
      </div>
    `;

    nav.appendChild(languageSelector);
    return languageSelector;
  }

  updateLanguageSwitcher() {
    const currentLang = document.querySelector('.current-lang');
    const langOptions = document.querySelectorAll('.lang-option');
    
    if (currentLang) {
      const currentLangData = this.supportedLanguages[this.currentLanguage];
      currentLang.querySelector('.lang-flag').textContent = currentLangData.flag;
      currentLang.querySelector('.lang-code').textContent = currentLangData.code.toUpperCase();
    }

    // Update active state
    langOptions.forEach(option => {
      const isActive = option.getAttribute('data-lang') === this.currentLanguage;
      option.classList.toggle('active', isActive);
    });
  }

  attachLanguageSwitcherEvents() {
    // Toggle dropdown
    document.addEventListener('click', (e) => {
      const currentLang = e.target.closest('.current-lang');
      const languageSelector = e.target.closest('.language-selector');
      
      if (currentLang) {
        e.preventDefault();
        languageSelector.classList.toggle('open');
      } else if (!languageSelector) {
        // Close dropdown when clicking outside
        document.querySelectorAll('.language-selector').forEach(selector => {
          selector.classList.remove('open');
        });
      }
    });

    // Language selection
    document.addEventListener('click', (e) => {
      const langOption = e.target.closest('.lang-option');
      if (langOption) {
        e.preventDefault();
        const selectedLang = langOption.getAttribute('data-lang');
        this.switchLanguage(selectedLang);
        
        // Close dropdown
        langOption.closest('.language-selector').classList.remove('open');
      }
    });
  }

  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Translate new elements
            if (node.hasAttribute && node.hasAttribute('data-i18n')) {
              const key = node.getAttribute('data-i18n');
              const translation = this.t(key);
              node.textContent = translation;
            }
            
            // Translate child elements
            node.querySelectorAll && node.querySelectorAll('[data-i18n]').forEach(element => {
              const key = element.getAttribute('data-i18n');
              const translation = this.t(key);
              element.textContent = translation;
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  showLoadingState() {
    document.body.classList.add('i18n-loading');
    
    // Add loading indicator to language switcher
    const currentLang = document.querySelector('.current-lang');
    if (currentLang) {
      currentLang.classList.add('loading');
    }
  }

  hideLoadingState() {
    document.body.classList.remove('i18n-loading');
    
    // Remove loading indicator
    const currentLang = document.querySelector('.current-lang');
    if (currentLang) {
      currentLang.classList.remove('loading');
    }
  }

  // Utility methods for external use
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  isRTL() {
    const rtlLanguages = ['ar', 'he', 'fa'];
    return rtlLanguages.includes(this.currentLanguage);
  }
}

// Initialize i18n system
const i18n = new I18nManager();

// Export for global use
window.i18n = i18n;

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = I18nManager;
}
