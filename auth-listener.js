// Central Auth Listener - Controls ALL redirect logic
// Equivalent to useEffect with supabase.auth.onAuthStateChange in React

import { supabase } from './supabase.js';

class AuthListener {
    constructor() {
        this.subscription = null;
        this.currentSession = null;
        this.isInitialized = false;
        
        this.init();
    }

    async init() {
        console.log('🎯 AuthListener: Initializing central auth control...');
        
        try {
            // Check initial session
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) {
                console.error('❌ AuthListener: Initial session check failed:', error);
            } else {
                this.currentSession = session;
                console.log('📊 AuthListener: Initial session:', session ? 'Found' : 'None');
                
                // Handle initial route based on current session
                this.handleInitialRoute();
            }

            // Set up central listener for ALL auth state changes
            this.subscription = supabase.auth.onAuthStateChange((event, session) => {
                console.log('🔄 AuthListener: Auth state changed:', event);
                console.log('👤 Session user:', session?.user?.email || 'None');
                console.log('✉️ Email confirmed:', session?.user?.email_confirmed_at ? 'Yes' : 'No');
                
                this.currentSession = session;
                this.handleAuthStateChange(event, session);
            });

            this.isInitialized = true;
            console.log('✅ AuthListener: Central auth control initialized');
            
        } catch (error) {
            console.error('💥 AuthListener: Initialization failed:', error);
        }
    }

    handleInitialRoute() {
        const currentPath = window.location.pathname;
        console.log('🛣️ AuthListener: Handling initial route:', currentPath);
        
        // Let the auth state change handler deal with routing
        this.handleAuthStateChange('INITIAL_LOAD', this.currentSession);
    }

    handleAuthStateChange(event, session) {
        const currentPath = window.location.pathname;
        
        console.log('🎯 AuthListener: Processing auth state change...');
        console.log('📍 Current path:', currentPath);
        console.log('🔄 Event:', event);
        console.log('👤 Session exists:', !!session);
        console.log('✉️ Email confirmed:', session?.user?.email_confirmed_at ? 'Yes' : 'No');

        switch (event) {
            case 'SIGNED_IN':
                this.handleSignedIn(session);
                break;
                
            case 'SIGNED_OUT':
                this.handleSignedOut();
                break;
                
            case 'TOKEN_REFRESHED':
                console.log('🔄 AuthListener: Token refreshed');
                // Re-check access for current route
                this.validateCurrentRoute(session);
                break;
                
            case 'USER_UPDATED':
                console.log('📝 AuthListener: User updated');
                this.validateCurrentRoute(session);
                break;
                
            case 'INITIAL_LOAD':
                this.validateCurrentRoute(session);
                break;
                
            default:
                console.log('ℹ️ AuthListener: Unhandled event:', event);
        }
    }

    handleSignedIn(session) {
        console.log('✅ AuthListener: User signed in');
        
        // Check if email is confirmed
        if (!session.user.email_confirmed_at) {
            console.log('⚠️ AuthListener: Email not confirmed yet');
            this.showEmailVerificationMessage();
            return;
        }
        
        console.log('✅ AuthListener: Email confirmed, user fully authenticated');
        
        // Redirect based on current location
        const currentPath = window.location.pathname;
        
        if (currentPath.includes('auth.html')) {
            console.log('🚀 AuthListener: Redirecting from auth to dashboard');
            this.redirectTo('/dashboard.html');
        } else if (this.isProtectedRoute(currentPath)) {
            console.log('✅ AuthListener: User on protected route, access granted');
            // User is already on a protected route and is authenticated - allow access
        } else {
            console.log('🏠 AuthListener: User on public route, staying put');
            // User is on public route - no action needed
        }
    }

    handleSignedOut() {
        console.log('👋 AuthListener: User signed out');
        
        const currentPath = window.location.pathname;
        
        // Clear any stored data
        localStorage.removeItem('user_preferences');
        sessionStorage.clear();
        
        // If user is on a protected route, redirect to home
        if (this.isProtectedRoute(currentPath)) {
            console.log('🏠 AuthListener: Redirecting from protected route to home');
            this.redirectTo('/');
        } else {
            console.log('✅ AuthListener: User on public route, no redirect needed');
        }
    }

    validateCurrentRoute(session) {
        const currentPath = window.location.pathname;
        
        console.log('🔍 AuthListener: Validating current route access');
        console.log('📍 Path:', currentPath);
        console.log('🔐 Session:', !!session);
        console.log('✉️ Email confirmed:', session?.user?.email_confirmed_at ? 'Yes' : 'No');
        
        // Check if current route is protected
        if (this.isProtectedRoute(currentPath)) {
            if (!session) {
                console.log('🚫 AuthListener: Protected route without session, redirecting to auth');
                this.redirectTo('/auth.html');
                return;
            }
            
            if (!session.user.email_confirmed_at) {
                console.log('⚠️ AuthListener: Protected route without email confirmation');
                this.showEmailVerificationMessage();
                this.redirectTo('/auth.html');
                return;
            }
            
            console.log('✅ AuthListener: Protected route access granted');
        }
        
        // Check if current route is guest-only (like auth page)
        if (this.isGuestOnlyRoute(currentPath)) {
            if (session && session.user.email_confirmed_at) {
                console.log('🔄 AuthListener: Authenticated user on guest-only route, redirecting to dashboard');
                this.redirectTo('/dashboard.html');
                return;
            }
            
            console.log('✅ AuthListener: Guest-only route access granted');
        }
    }

    isProtectedRoute(path) {
        const protectedRoutes = [
            '/dashboard.html',
            '/analytics.html',
            '/settings.html',
            '/profile.html'
        ];
        
        return protectedRoutes.some(route => path.includes(route));
    }

    isGuestOnlyRoute(path) {
        const guestOnlyRoutes = [
            '/auth.html'
        ];
        
        return guestOnlyRoutes.some(route => path.includes(route));
    }

    redirectTo(path) {
        console.log('🚀 AuthListener: Redirecting to:', path);
        
        // Small delay to ensure state is fully updated
        setTimeout(() => {
            window.location.href = path;
        }, 100);
    }

    showEmailVerificationMessage() {
        console.log('📧 AuthListener: Showing email verification message');
        
        // Create or update verification message
        let messageDiv = document.getElementById('email-verification-message');
        
        if (!messageDiv) {
            messageDiv = document.createElement('div');
            messageDiv.id = 'email-verification-message';
            messageDiv.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #fef3c7;
                border: 1px solid #f59e0b;
                color: #92400e;
                padding: 16px 24px;
                border-radius: 8px;
                font-size: 14px;
                z-index: 9999;
                max-width: 500px;
                text-align: center;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            `;
            
            document.body.appendChild(messageDiv);
        }
        
        messageDiv.innerHTML = `
            <strong>📧 Email Verification Required</strong><br>
            Please check your email and click the verification link to complete your registration.
            <br><br>
            <button onclick="this.parentElement.remove()" style="
                background: #f59e0b;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            ">Close</button>
        `;
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (messageDiv && messageDiv.parentElement) {
                messageDiv.remove();
            }
        }, 10000);
    }

    // Public methods
    getCurrentSession() {
        return this.currentSession;
    }

    isAuthenticated() {
        return !!(this.currentSession && this.currentSession.user.email_confirmed_at);
    }

    isEmailConfirmed() {
        return !!(this.currentSession?.user?.email_confirmed_at);
    }

    destroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            console.log('🔌 AuthListener: Subscription destroyed');
        }
    }
}

// Create global auth listener instance
export const authListener = new AuthListener();

// Make it available globally for debugging
window.authListener = authListener;

// Export utility functions
export const getCurrentSession = () => authListener.getCurrentSession();
export const isAuthenticated = () => authListener.isAuthenticated();
export const isEmailConfirmed = () => authListener.isEmailConfirmed();
