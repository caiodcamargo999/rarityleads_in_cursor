// Auth Guard - Route Protection (Vanilla JS equivalent of ProtectedRoute)
// This module handles authentication state and route protection

import { supabase } from './supabase.js';
import { onAuthStateChange, getCurrentSession } from './auth-handlers.js';

class AuthGuard {
    constructor() {
        this.session = null;
        this.isLoading = true;
        this.authSubscription = null;

        // Initialize auth state
        this.init();
    }

    async init() {
        console.log('🔐 AuthGuard: Initializing...');

        try {
            // Set up auth state change listener (like useEffect in React)
            this.authSubscription = onAuthStateChange((event, session) => {
                console.log('🔄 AuthGuard: Auth state changed:', event);
                this.session = session;
                this.isLoading = false;
                this.handleAuthStateChange(event, session);
            });

            // Check for existing session on initial load
            const { session, error } = await getCurrentSession();

            if (error) {
                console.error('❌ AuthGuard: Session check failed:', error);
                this.handleAuthError(error);
                return;
            }

            this.session = session;
            this.isLoading = false;

            if (session?.user) {
                console.log('✅ AuthGuard: User session found:', session.user.email);
            } else {
                console.log('ℹ️ AuthGuard: No active session');
            }

        } catch (error) {
            console.error('💥 AuthGuard: Initialization failed:', error);
            this.handleAuthError(error);
            this.isLoading = false;
        }
    }

    handleAuthStateChange(event, session) {
        switch (event) {
            case 'SIGNED_IN':
                console.log('✅ AuthGuard: User signed in:', session.user.email);
                this.handleSuccessfulAuth();
                break;

            case 'SIGNED_OUT':
                console.log('👋 AuthGuard: User signed out');
                this.handleSignOut();
                break;

            case 'TOKEN_REFRESHED':
                console.log('🔄 AuthGuard: Token refreshed');
                break;

            case 'USER_UPDATED':
                console.log('📝 AuthGuard: User updated');
                break;
        }
    }

    handleSuccessfulAuth() {
        // Check if we're on auth page and should redirect to dashboard
        if (window.location.pathname.includes('auth.html')) {
            console.log('🚀 AuthGuard: Redirecting to dashboard after successful auth');
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 500);
        }
    }

    handleSignOut() {
        // Clear any stored data
        localStorage.removeItem('user_preferences');
        sessionStorage.clear();

        // Redirect to home page if not already there
        if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
            console.log('🏠 AuthGuard: Redirecting to home page');
            window.location.href = '/';
        }
    }

    handleAuthError(error) {
        console.error('❌ AuthGuard: Auth error:', error);
        this.currentUser = null;
        this.isAuthenticated = false;
        
        // Show user-friendly error message
        if (error.message.includes('Invalid API key')) {
            console.error('🔑 AuthGuard: Invalid Supabase configuration');
        }
    }

    // Route protection methods (equivalent to ProtectedRoute component)
    requireAuth(redirectTo = '/auth.html') {
        console.log('🛡️ AuthGuard: Checking authentication requirement...');

        if (this.isLoading) {
            console.log('⏳ AuthGuard: Still loading, showing loading state...');
            this.showLoadingState();
            return false;
        }

        if (!this.session) {
            console.log('🚫 AuthGuard: User not authenticated, redirecting to:', redirectTo);
            window.location.href = redirectTo;
            return false;
        }

        console.log('✅ AuthGuard: User authenticated, access granted');
        this.hideLoadingState();
        return true;
    }

    requireGuest(redirectTo = '/dashboard.html') {
        console.log('👤 AuthGuard: Checking guest requirement...');

        if (this.isLoading) {
            console.log('⏳ AuthGuard: Still loading, waiting...');
            return false;
        }

        if (this.session) {
            console.log('🔄 AuthGuard: User already authenticated, redirecting to:', redirectTo);
            window.location.href = redirectTo;
            return false;
        }

        console.log('✅ AuthGuard: Guest access granted');
        return true;
    }

    // Show loading state (equivalent to loading spinner in React)
    showLoadingState() {
        const existingLoader = document.getElementById('auth-loader');
        if (existingLoader) return;

        const loader = document.createElement('div');
        loader.id = 'auth-loader';
        loader.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                font-family: Inter, sans-serif;
            ">
                <div style="text-align: center;">
                    <div style="
                        width: 40px;
                        height: 40px;
                        border: 4px solid #f3f3f3;
                        border-top: 4px solid #667eea;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 16px;
                    "></div>
                    <div style="color: #64748b; font-size: 16px;">Loading...</div>
                </div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        document.body.appendChild(loader);
    }

    hideLoadingState() {
        const loader = document.getElementById('auth-loader');
        if (loader) {
            loader.remove();
        }
    }

    // Utility methods
    async signOut() {
        console.log('👋 AuthGuard: Signing out user...');
        
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            console.log('✅ AuthGuard: Sign out successful');
            return { success: true };
        } catch (error) {
            console.error('❌ AuthGuard: Sign out failed:', error);
            return { success: false, error };
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isUserAuthenticated() {
        return this.isAuthenticated;
    }

    isAuthLoading() {
        return this.isLoading;
    }

    // Wait for auth to be ready
    async waitForAuth(timeout = 5000) {
        return new Promise((resolve) => {
            if (!this.isLoading) {
                resolve(this.isAuthenticated);
                return;
            }

            const checkInterval = setInterval(() => {
                if (!this.isLoading) {
                    clearInterval(checkInterval);
                    resolve(this.isAuthenticated);
                }
            }, 100);

            // Timeout fallback
            setTimeout(() => {
                clearInterval(checkInterval);
                console.warn('⚠️ AuthGuard: Auth check timeout');
                resolve(false);
            }, timeout);
        });
    }
}

// Create global auth guard instance
export const authGuard = new AuthGuard();

// Make it available globally for debugging
window.authGuard = authGuard;

// Export utility functions
export const requireAuth = (redirectTo) => authGuard.requireAuth(redirectTo);
export const requireGuest = (redirectTo) => authGuard.requireGuest(redirectTo);
export const getCurrentUser = () => authGuard.getCurrentUser();
export const isAuthenticated = () => authGuard.isUserAuthenticated();
export const signOut = () => authGuard.signOut();
