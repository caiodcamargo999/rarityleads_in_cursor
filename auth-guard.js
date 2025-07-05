/**
 * Rarity Leads Authentication Guard
 * Bulletproof route protection and authentication management
 */

class AuthGuard {
    constructor() {
        this.supabase = null;
        this.currentUser = null;
        this.isAuthenticated = false;
        this.isEmailVerified = false;
        this.redirectAttempted = false;
        this.init();
    }

    async init() {
        try {
            // Initialize Supabase
            this.supabase = window.AppUtils?.initSupabase();
            
            if (!this.supabase) {
                console.error('❌ AuthGuard: Supabase not available');
                this.handleUnauthenticated();
                return;
            }

            console.log('🛡️ AuthGuard: Initializing...');

            // Check current authentication status and then protect the route
            await this.checkAuthStatus();
            this.protectRoute();
            
            // Setup auth state listener for subsequent changes
            this.setupAuthListener();
            
        } catch (error) {
            console.error('❌ AuthGuard: Initialization failed:', error);
            this.handleUnauthenticated();
        }
    }

    async checkAuthStatus() {
        if (!this.supabase) return false;

        try {
            const { data: { session }, error } = await this.supabase.auth.getSession();
            console.log('🛡️ AuthGuard: Supabase session:', session);
            if (error) {
                console.error('❌ AuthGuard: Session check error:', error);
                return false;
            }

            if (session && session.user) {
                this.currentUser = session.user;
                this.isAuthenticated = true;
                this.isEmailVerified = !!session.user.email_confirmed_at;
                console.log('🛡️ AuthGuard: isAuthenticated:', this.isAuthenticated);
                console.log('🛡️ AuthGuard: isEmailVerified:', this.isEmailVerified);
                console.log('🛡️ AuthGuard: session.user:', session.user);
                return true;
            } else {
                this.currentUser = null;
                this.isAuthenticated = false;
                this.isEmailVerified = false;
                console.log('🛡️ AuthGuard: No valid session');
                return false;
            }
        } catch (error) {
            console.error('❌ AuthGuard: Error checking auth status:', error);
            return false;
        }
    }

    setupAuthListener() {
        if (!this.supabase) return;

        this.supabase.auth.onAuthStateChange((event, session) => {
            console.log('🔄 AuthGuard: Auth state changed:', event);
            
            const wasAuthenticated = this.isAuthenticated;
            const wasVerified = this.isEmailVerified;
            
            if (session && session.user) {
                this.currentUser = session.user;
                this.isAuthenticated = true;
                this.isEmailVerified = !!session.user.email_confirmed_at;
            } else {
                this.currentUser = null;
                this.isAuthenticated = false;
                this.isEmailVerified = false;
            }
            
            // Handle state changes
            if (event === 'SIGNED_IN' && session) {
                this.handleSignIn(session);
            } else if (event === 'SIGNED_OUT') {
                this.handleSignOut();
            }
            
            // Re-protect route if auth status changed
            if (wasAuthenticated !== this.isAuthenticated || wasVerified !== this.isEmailVerified) {
                this.protectRoute();
            }
        });
    }

    handleSignIn(session) {
        console.log('✅ AuthGuard: User signed in:', session.user.email);
        
        if (session.user.email_confirmed_at) {
            console.log('✅ AuthGuard: Email verified');
            
            // Redirect to dashboard if on auth pages
            if (this.isAuthPage()) {
                console.log('🔄 AuthGuard: Redirecting to dashboard from auth page');
                this.redirectTo('/dashboard.html');
            }
        } else {
            console.log('📧 AuthGuard: Email not verified');
            
            // If on protected page, redirect to login with verification message
            if (this.isProtectedPage()) {
                console.log('🔄 AuthGuard: Redirecting to login for verification');
                this.redirectTo('/auth.html');
            }
        }
    }

    handleSignOut() {
        console.log('👋 AuthGuard: User signed out');
        
        // Redirect to login if on protected page
            if (this.isProtectedPage()) {
                console.log('🔄 AuthGuard: Redirecting to login after sign out');
                this.redirectTo('/auth.html');
            }
    }

    protectRoute() {
        const currentPath = window.location.pathname;
        console.log('🛡️ AuthGuard: Protecting route:', currentPath);
        console.log('🛡️ AuthGuard: protectedRoutes:', window.AppConfig.auth.protectedRoutes);
        console.log('🛡️ AuthGuard: isProtectedPage() result:', this.isProtectedPage());

        // Public routes that don't need protection
        if (this.isPublicPage()) {
            console.log('🌐 AuthGuard: Public page, no protection needed');
            
            // If authenticated and verified, redirect to dashboard
            if (this.isAuthenticated && this.isEmailVerified && this.isAuthPage()) {
                console.log('🔄 AuthGuard: Authenticated user on auth page, redirecting to dashboard');
                this.redirectTo('/dashboard.html');
            }
            
            return;
        }

        // Protected routes
        if (this.isProtectedPage()) {
            console.log('AuthGuard: Current page is protected.');
            if (!this.isAuthenticated) {
                console.log('🚫 AuthGuard: Unauthenticated user on protected page');
                this.handleUnauthenticated();
                return;
            }

            if (!this.isEmailVerified) {
                console.log('📧 AuthGuard: Unverified user on protected page');
                this.handleUnverified();
                return;
            }

            console.log('✅ AuthGuard: Access granted to protected page');
        }
    }

    handleUnauthenticated() {
        if (this.redirectAttempted) return;
        
        console.log('🔄 AuthGuard: Redirecting unauthenticated user to login');
        this.redirectTo('/auth.html');
    }

    handleUnverified() {
        if (this.redirectAttempted) return;
        
        console.log('🔄 AuthGuard: Redirecting unverified user to login');
        this.redirectTo('/auth.html');
    }

    redirectTo(path) {
        if (this.redirectAttempted) return;
        
        this.redirectAttempted = true;
        console.log('🔄 AuthGuard: Redirecting to:', path);
        
        // Small delay to prevent redirect loops
        setTimeout(() => {
            window.location.href = path;
        }, 100);
    }

    // Route classification methods
    isPublicPage() {
        const publicPaths = [
            '/',
            window.AppConfig.routes.home,
            window.AppConfig.routes.register,
            window.AppConfig.routes.login
        ];

        return publicPaths.includes(window.location.pathname);
    }

    isAuthPage() {
        const authPaths = [
            window.AppConfig.routes.register,
            window.AppConfig.routes.login
        ];

        return authPaths.includes(window.location.pathname);
    }

    isProtectedPage() {
        const currentPath = window.location.pathname;
        const isProtected = window.AppConfig.auth.protectedRoutes.includes(currentPath);
        console.log('AuthGuard: isProtectedPage() - Path:', currentPath, 'Is Protected:', isProtected);
        return isProtected;
    }

    // Public methods for external use
    getUser() {
        return this.currentUser;
    }

    isUserAuthenticated() {
        return this.isAuthenticated;
    }

    isUserVerified() {
        return this.isEmailVerified;
    }

    async signOut() {
        if (!this.supabase) return;

        try {
            console.log('👋 AuthGuard: Signing out user');
            const { error } = await this.supabase.auth.signOut();
            
            if (error) throw error;
            
            console.log('✅ AuthGuard: Sign out successful');
            
        } catch (error) {
            console.error('❌ AuthGuard: Sign out error:', error);
            throw error;
        }
    }

    async resendVerification(email) {
        if (!this.supabase) return;

        try {
            console.log('📧 AuthGuard: Resending verification email to:', email);
            
            const { error } = await this.supabase.auth.resend({
                type: 'signup',
                email: email
            });
            
            if (error) throw error;
            
            console.log('✅ AuthGuard: Verification email sent');
            
        } catch (error) {
            console.error('❌ AuthGuard: Resend verification error:', error);
            throw error;
        }
    }

    showMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `message message-${type}`;
        messageElement.textContent = message;
        document.body.appendChild(messageElement);

        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }
}

// Initialize AuthGuard globally
window.AuthGuard = new AuthGuard();

console.log('✅ AuthGuard loaded and initialized');
