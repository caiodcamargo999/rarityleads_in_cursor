/**
 * Rarity Leads Application Configuration
 * Central configuration file for the application
 */

window.AppConfig = {
  // Supabase Configuration
  supabase: {
    url: 'https://yejheyrdsucgzpzwxuxs.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllamhleXJkc3VjZ3pwend4dXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MDg2NzQsImV4cCI6MjA2NDM4NDY3NH0.NzCJ8i3SKpABO6ykWRX3nHDYmjVB82KL1wfgaY3trM4'
  },

  // Application Routes
  routes: {
    home: '/index.html',
    auth: '/auth.html',
    dashboard: '/dashboard.html',
    analytics: '/analytics.html',
    prospecting: {
      leads: '/prospecting-leads.html',
      companies: '/prospecting-companies.html'
    },
    approaching: {
      whatsapp: '/approaching-whatsapp.html',
      instagram: '/approaching-instagram.html',
      facebook: '/approaching-facebook.html',
      x: '/approaching-x.html',
      linkedin: '/approaching-linkedin.html'
    },
    support: '/support.html'
  },

  // Menu Configuration
  menu: {
    items: [
      {
        id: 'dashboard',
        icon: 'fas fa-chart-line',
        translationKey: 'nav.dashboard',
        route: '/dashboard.html',
        type: 'single'
      },
      {
        id: 'prospecting',
        icon: 'fas fa-search',
        translationKey: 'nav.prospecting',
        type: 'submenu',
        items: [
          {
            id: 'leads',
            icon: 'fas fa-users',
            translationKey: 'nav.leads',
            route: '/prospecting-leads.html',
            badge: '24'
          },
          {
            id: 'companies',
            icon: 'fas fa-building',
            translationKey: 'nav.companies',
            route: '/prospecting-companies.html'
          }
        ]
      },
      {
        id: 'approaching',
        icon: 'fas fa-paper-plane',
        translationKey: 'nav.approaching',
        type: 'submenu',
        items: [
          {
            id: 'whatsapp',
            icon: 'fab fa-whatsapp',
            translationKey: 'nav.whatsapp',
            route: '/approaching-whatsapp.html'
          },
          {
            id: 'instagram',
            icon: 'fab fa-instagram',
            translationKey: 'nav.instagram',
            route: '/approaching-instagram.html'
          },
          {
            id: 'facebook',
            icon: 'fab fa-facebook',
            translationKey: 'nav.facebook',
            route: '/approaching-facebook.html'
          },
          {
            id: 'x',
            icon: 'fab fa-x-twitter',
            translationKey: 'nav.x',
            route: '/approaching-x.html'
          },
          {
            id: 'linkedin',
            icon: 'fab fa-linkedin',
            translationKey: 'nav.linkedin',
            route: '/approaching-linkedin.html'
          }
        ]
      },
      {
        id: 'analytics',
        icon: 'fas fa-chart-bar',
        translationKey: 'nav.analytics',
        route: '/analytics.html',
        type: 'single'
      },
      {
        id: 'support',
        icon: 'fas fa-life-ring',
        translationKey: 'nav.support',
        route: '/support.html',
        type: 'single'
      }
    ]
  },

  // Language Configuration
  languages: {
    default: 'en',
    supported: {
      'en': { name: 'English', flag: '🇺🇸', code: 'en' },
      'pt-BR': { name: 'Português', flag: '🇧🇷', code: 'pt-BR' },
      'es': { name: 'Español', flag: '🇪🇸', code: 'es' },
      'fr': { name: 'Français', flag: '🇫🇷', code: 'fr' }
    }
  },

  // Authentication Configuration
  auth: {
    redirectAfterLogin: '/dashboard.html',
    redirectAfterLogout: '/index.html',
    protectedRoutes: [
      '/dashboard.html',
      '/analytics.html',
      '/prospecting-leads.html',
      '/prospecting-companies.html',
      '/approaching-whatsapp.html',
      '/approaching-instagram.html',
      '/approaching-facebook.html',
      '/approaching-x.html',
      '/approaching-linkedin.html',
      '/support.html',
      '/profile.html'
    ],
    publicRoutes: [
      '/index.html',
      '/auth.html'
    ]
  },

  // UI Configuration
  ui: {
    sidebar: {
      width: '280px',
      collapsedWidth: '60px'
    },
    header: {
      height: '70px'
    },
    animations: {
      duration: '0.3s',
      easing: 'ease'
    }
  },

  // Development Configuration
  development: {
    debug: true,
    logLevel: 'info'
  }
};

/**
 * Utility functions for the application
 */
window.AppUtils = {
  // Get current route
  getCurrentRoute() {
    return window.location.pathname;
  },

  // Check if route is protected
  isProtectedRoute(route = null) {
    const currentRoute = route || this.getCurrentRoute();
    return window.AppConfig.auth.protectedRoutes.includes(currentRoute);
  },

  // Navigate to route
  navigateTo(route) {
    window.location.href = route;
  },

  // Log with app prefix
  log(level, message, ...args) {
    if (window.AppConfig.development.debug) {
      console[level](`[Rarity Leads] ${message}`, ...args);
    }
  },

  // Get menu item by route
  getMenuItemByRoute(route) {
    const findInItems = (items) => {
      for (const item of items) {
        if (item.route === route) {
          return item;
        }
        if (item.items) {
          const found = findInItems(item.items);
          if (found) return found;
        }
      }
      return null;
    };
    return findInItems(window.AppConfig.menu.items);
  },

  // Initialize Supabase client
  initSupabase() {
    if (window.supabase && window.AppConfig.supabase) {
      return window.supabase.createClient(
        window.AppConfig.supabase.url,
        window.AppConfig.supabase.anonKey
      );
    }
    throw new Error('Supabase not available');
  }
};

// Initialize app configuration
console.log('✅ App configuration loaded');
