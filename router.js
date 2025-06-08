// Simple Router - Vanilla JS equivalent of React Router
// Handles route protection and navigation

import { authGuard } from './auth-guard.js';

class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.init();
    }

    init() {
        // Listen for popstate events (back/forward buttons)
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });

        // Handle initial route
        this.handleRoute();
    }

    // Define routes (equivalent to Routes in React Router)
    defineRoutes() {
        return {
            '/': { 
                component: 'Homepage', 
                protected: false,
                file: 'index.html'
            },
            '/index.html': { 
                component: 'Homepage', 
                protected: false,
                file: 'index.html'
            },
            '/auth.html': { 
                component: 'AuthPage', 
                protected: false,
                file: 'auth.html',
                guestOnly: true // Redirect authenticated users away
            },
            '/dashboard.html': { 
                component: 'Dashboard', 
                protected: true,
                file: 'dashboard.html'
            },
            '/analytics.html': { 
                component: 'Analytics', 
                protected: true,
                file: 'analytics.html'
            }
        };
    }

    getCurrentPath() {
        return window.location.pathname;
    }

    async handleRoute() {
        const path = this.getCurrentPath();
        const routes = this.defineRoutes();
        const route = routes[path];

        console.log('🛣️ Router: Handling route:', path);

        if (!route) {
            console.log('❓ Router: Route not found, redirecting to home');
            this.navigate('/');
            return;
        }

        // Check authentication requirements
        if (route.protected) {
            console.log('🔒 Router: Protected route, checking auth...');
            
            if (authGuard.isLoading) {
                console.log('⏳ Router: Auth still loading, waiting...');
                setTimeout(() => this.handleRoute(), 100);
                return;
            }

            if (!authGuard.session) {
                console.log('🚫 Router: Not authenticated, redirecting to auth');
                this.navigate('/auth.html');
                return;
            }
        }

        // Check guest-only routes
        if (route.guestOnly) {
            console.log('👤 Router: Guest-only route, checking auth...');
            
            if (authGuard.isLoading) {
                console.log('⏳ Router: Auth still loading, waiting...');
                setTimeout(() => this.handleRoute(), 100);
                return;
            }

            if (authGuard.session) {
                console.log('🔄 Router: Already authenticated, redirecting to dashboard');
                this.navigate('/dashboard.html');
                return;
            }
        }

        console.log('✅ Router: Route access granted:', route.component);
        this.currentRoute = route;
    }

    // Navigate to a new route (equivalent to useNavigate in React Router)
    navigate(path) {
        if (path === this.getCurrentPath()) {
            console.log('🔄 Router: Already on target path:', path);
            return;
        }

        console.log('🚀 Router: Navigating to:', path);
        
        // Update browser history
        window.history.pushState({}, '', path);
        
        // Handle the new route
        this.handleRoute();
        
        // For static sites, we need to actually navigate to the file
        if (path !== window.location.pathname) {
            window.location.href = path;
        }
    }

    // Replace current route (equivalent to replace in React Router)
    replace(path) {
        console.log('🔄 Router: Replacing route with:', path);
        window.history.replaceState({}, '', path);
        window.location.href = path;
    }

    // Go back
    back() {
        console.log('⬅️ Router: Going back');
        window.history.back();
    }

    // Go forward
    forward() {
        console.log('➡️ Router: Going forward');
        window.history.forward();
    }

    // Check if current route is protected
    isCurrentRouteProtected() {
        const routes = this.defineRoutes();
        const route = routes[this.getCurrentPath()];
        return route?.protected || false;
    }

    // Check if current route is guest-only
    isCurrentRouteGuestOnly() {
        const routes = this.defineRoutes();
        const route = routes[this.getCurrentPath()];
        return route?.guestOnly || false;
    }

    // Get route info
    getCurrentRoute() {
        const routes = this.defineRoutes();
        return routes[this.getCurrentPath()] || null;
    }
}

// Create global router instance
export const router = new Router();

// Make it available globally for debugging
window.router = router;

// Export navigation functions
export const navigate = (path) => router.navigate(path);
export const replace = (path) => router.replace(path);
export const goBack = () => router.back();
export const goForward = () => router.forward();

// Initialize router when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🛣️ Router: Initialized');
    
    // Set up auth guard integration
    authGuard.router = router;
    
    // Handle auth state changes for routing
    import('./auth-handlers.js').then(({ onAuthStateChange }) => {
        onAuthStateChange((event, session) => {
            console.log('🔄 Router: Auth state changed, re-evaluating route');
            
            // Small delay to ensure auth state is fully updated
            setTimeout(() => {
                router.handleRoute();
            }, 100);
        });
    });
});

// Export router class for advanced usage
export { Router };
