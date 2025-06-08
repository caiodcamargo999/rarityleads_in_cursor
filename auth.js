import { supabase, auth as authService, onAuthStateChange } from './supabase.js';

// Authentication state management
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.isLoading = false;
        this.emailVerificationSent = false;
    }

    // Initialize auth state
    async init() {
        try {
            // Check current session
            const { session, error } = await authService.getSession();
            if (error) throw error;

            if (session?.user) {
                this.currentUser = session.user;
                this.isAuthenticated = true;
                this.updateUI();
            }

            // Listen for auth state changes
            onAuthStateChange((event, session) => {
                console.log('Auth state changed:', event, session);

                switch (event) {
                    case 'SIGNED_IN':
                        this.currentUser = session.user;
                        this.isAuthenticated = true;
                        this.handleSignInSuccess();
                        break;
                    case 'SIGNED_OUT':
                        this.currentUser = null;
                        this.isAuthenticated = false;
                        this.handleSignOut();
                        break;
                    case 'TOKEN_REFRESHED':
                        this.currentUser = session.user;
                        break;
                }
                this.updateUI();
            });
        } catch (error) {
            console.error('Auth initialization error:', error);
        }
    },

    // Handle successful sign in
    handleSignInSuccess() {
        console.log('✅ User signed in successfully:', this.currentUser);

        // For OAuth users, redirect immediately to dashboard
        // Email verification is handled automatically by Supabase
        if (this.currentUser) {
            console.log('🚀 Redirecting to dashboard...');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        }
    }

    // Handle sign out
    handleSignOut() {
        // Clear any stored data
        localStorage.removeItem('user_preferences');

        // Redirect to home page if not already there
        if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
            window.location.href = 'index.html';
        }
    }

    // Sign up new user
    async signUp(email, password, fullName = '') {
        this.setLoading(true);
        try {
            const { data, error } = await authService.signUp(email, password, {
                fullName,
                role: 'client'
            });

            if (error) throw error;

            if (data.user && !data.user.email_confirmed_at) {
                this.emailVerificationSent = true;
                this.showEmailVerificationMessage();
                return { success: true, needsVerification: true };
            }

            return { success: true, needsVerification: false };
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: this.getErrorMessage(error) };
        } finally {
            this.setLoading(false);
        }
    }

    // Sign in existing user
    async signIn(email, password) {
        this.setLoading(true);
        try {
            const { data, error } = await authService.signIn(email, password);

            if (error) throw error;

            return { success: true };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: this.getErrorMessage(error) };
        } finally {
            this.setLoading(false);
        }
    }

    // Sign up/Sign in with Google
    async signInWithGoogle() {
        this.setLoading(true);
        try {
            const { data, error } = await authService.signInWithGoogle();
            if (error) throw error;

            // OAuth will redirect to Google, then back to dashboard
            // Email verification will be sent automatically
            console.log('🔗 Redirecting to Google OAuth...');
            return { success: true };
        } catch (error) {
            console.error('Google authentication error:', error);
            this.setLoading(false);
            return { success: false, error: this.getErrorMessage(error) };
        }
    }

    // Sign in with GitHub
    async signInWithGitHub() {
        this.setLoading(true);
        try {
            const { data, error } = await authService.signInWithGitHub();
            if (error) throw error;

            // OAuth redirect will handle the rest
            return { success: true };
        } catch (error) {
            console.error('GitHub sign in error:', error);
            this.setLoading(false);
            return { success: false, error: this.getErrorMessage(error) };
        }
    }

    // Sign out user
    async signOut() {
        this.setLoading(true);
        try {
            const { error } = await authService.signOut();
            if (error) throw error;

            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: this.getErrorMessage(error) };
        } finally {
            this.setLoading(false);
        }
    }

    // Resend email verification
    async resendVerification(email) {
        this.setLoading(true);
        try {
            const { data, error } = await authService.resendVerification(email);
            if (error) throw error;

            this.showSuccessMessage('Verification email sent! Please check your inbox.');
            return { success: true };
        } catch (error) {
            console.error('Resend verification error:', error);
            return { success: false, error: this.getErrorMessage(error) };
        } finally {
            this.setLoading(false);
        }
    }

    // Reset password
    async resetPassword(email) {
        this.setLoading(true);
        try {
            const { data, error } = await authService.resetPassword(email);
            if (error) throw error;

            this.showSuccessMessage('Password reset email sent! Please check your inbox.');
            return { success: true };
        } catch (error) {
            console.error('Reset password error:', error);
            return { success: false, error: this.getErrorMessage(error) };
        } finally {
            this.setLoading(false);
        }
    }

    // Set loading state
    setLoading(loading) {
        this.isLoading = loading;
        const container = document.querySelector('.auth-container');
        const submitButtons = document.querySelectorAll('.primary-btn');

        if (container) {
            container.classList.toggle('loading', loading);
        }

        submitButtons.forEach(btn => {
            btn.disabled = loading;
            if (loading) {
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            }
        });
    }

    // Show error message
    showError(message) {
        const errorDiv = document.getElementById('auth-error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            alert(message);
        }
    }

    // Show success message
    showSuccessMessage(message) {
        const successDiv = document.getElementById('auth-success') || this.createSuccessDiv();
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Hide after 5 seconds
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 5000);
    }

    // Create success message div
    createSuccessDiv() {
        const successDiv = document.createElement('div');
        successDiv.id = 'auth-success';
        successDiv.className = 'auth-success';
        successDiv.style.cssText = `
            background: #f0f9ff;
            border: 1px solid #0ea5e9;
            color: #0369a1;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            margin-bottom: 16px;
            display: none;
        `;

        const form = document.querySelector('.auth-form');
        if (form) {
            form.insertBefore(successDiv, form.firstChild);
        }

        return successDiv;
    }

    // Show email verification message
    showEmailVerificationMessage() {
        const message = window.i18n ?
            window.i18n.t('auth.emailVerificationSent') :
            'Please check your email and click the verification link to complete your registration.';

        this.showSuccessMessage(message);

        // Show resend button
        this.showResendVerificationButton();
    }

    // Show resend verification button
    showResendVerificationButton() {
        const container = document.querySelector('.auth-container');
        if (!container || document.getElementById('resend-verification')) return;

        const resendDiv = document.createElement('div');
        resendDiv.id = 'resend-verification';
        resendDiv.className = 'resend-verification';
        resendDiv.innerHTML = `
            <p style="text-align: center; margin: 16px 0; color: #64748b; font-size: 14px;">
                Didn't receive the email?
                <button id="resend-btn" style="background: none; border: none; color: #667eea; text-decoration: underline; cursor: pointer; font-size: 14px;">
                    Resend verification email
                </button>
            </p>
        `;

        container.appendChild(resendDiv);

        // Add click handler
        document.getElementById('resend-btn').addEventListener('click', async () => {
            const email = document.getElementById('email')?.value;
            if (email) {
                await this.resendVerification(email);
            }
        });
    }

    // Get user-friendly error message
    getErrorMessage(error) {
        const errorMessages = {
            'Invalid login credentials': 'Invalid email or password. Please try again.',
            'Email not confirmed': 'Please verify your email address before signing in.',
            'User already registered': 'An account with this email already exists.',
            'Password should be at least 6 characters': 'Password must be at least 6 characters long.',
            'Invalid email': 'Please enter a valid email address.',
            'Signup disabled': 'New registrations are currently disabled.',
            'Email rate limit exceeded': 'Too many emails sent. Please wait before requesting another.',
        };

        const message = error?.message || error;
        return errorMessages[message] || message || 'An unexpected error occurred. Please try again.';
    }

    // Update UI based on auth state
    updateUI() {
        // Update auth buttons
        const authTriggers = document.querySelectorAll('#auth-trigger, #hero-auth-trigger');
        const signOutBtns = document.querySelectorAll('#sign-out-btn');

        if (this.isAuthenticated) {
            authTriggers.forEach(trigger => {
                trigger.textContent = 'Go to Dashboard';
                trigger.onclick = () => window.location.href = 'dashboard.html';
            });

            signOutBtns.forEach(btn => {
                btn.onclick = () => this.signOut();
            });
        } else {
            authTriggers.forEach(trigger => {
                const text = window.i18n ? window.i18n.t('nav.getStarted') : 'Get Started';
                trigger.textContent = text;
                trigger.onclick = () => window.location.href = 'auth.html';
            });
        }
    }
}

// Auth Page Management
class AuthPageManager {
    constructor(authManager) {
        this.authManager = authManager;
        this.isSignUp = true;
        this.form = null;
        this.title = null;
        this.subtitle = null;
        this.submitBtn = null;
        this.switchLink = null;
    }

    init() {
        // Get DOM elements
        this.form = document.getElementById('signup-form');
        this.title = document.querySelector('.auth-title');
        this.subtitle = document.querySelector('.auth-subtitle');
        this.submitBtn = document.getElementById('signup-btn');
        this.switchLink = document.getElementById('switch-to-login');

        if (!this.form) return; // Not on auth page

        // Setup form submission
        this.setupFormSubmission();

        // Setup social login buttons
        this.setupSocialLogin();

        // Setup mode switching
        this.setupModeSwitch();

        // Setup form validation
        this.setupFormValidation();

        // Check for URL parameters
        this.handleUrlParams();
    }

    setupFormSubmission() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (!this.validateForm(email, password)) return;

            let result;
            if (this.isSignUp) {
                result = await this.authManager.signUp(email, password);
            } else {
                result = await this.authManager.signIn(email, password);
            }

            if (result.success) {
                if (result.needsVerification) {
                    // Email verification needed
                    return;
                }
                // Success - redirect will be handled by auth state change
            } else {
                this.authManager.showError(result.error);
            }
        });
    }

    setupSocialLogin() {
        // Google OAuth - Sign up/Sign in
        const googleBtn = document.getElementById('google-signup');
        if (googleBtn) {
            googleBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                console.log('🔗 Starting Google OAuth...');

                const result = await this.authManager.signInWithGoogle();
                if (!result.success) {
                    this.authManager.showError(result.error);
                    console.error('❌ Google OAuth failed:', result.error);
                } else {
                    console.log('✅ Google OAuth initiated successfully');
                }
            });
        }

        // GitHub login
        const githubBtn = document.getElementById('github-signup');
        if (githubBtn) {
            githubBtn.addEventListener('click', async () => {
                const result = await this.authManager.signInWithGitHub();
                if (!result.success) {
                    this.authManager.showError(result.error);
                }
            });
        }
    }

    setupModeSwitch() {
        if (this.switchLink) {
            this.switchLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleAuthMode();
            });
        }
    }

    setupFormValidation() {
        const inputs = document.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                this.hideError();
            });

            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }

    toggleAuthMode() {
        this.isSignUp = !this.isSignUp;
        this.updateUIForMode();
        this.form.reset();
        this.hideError();
    }

    updateUIForMode() {
        if (!window.i18n) return;

        if (this.isSignUp) {
            this.title.textContent = window.i18n.t('auth.createAccount');
            this.subtitle.textContent = window.i18n.t('auth.signUpSubtitle');
            this.submitBtn.innerHTML = `<span>${window.i18n.t('auth.createAccount')}</span>`;
            this.switchLink.parentElement.innerHTML = `
                ${window.i18n.t('auth.alreadyHaveAccount')}
                <a href="#" id="switch-to-login">${window.i18n.t('auth.signInInstead')}</a>
            `;
        } else {
            this.title.textContent = window.i18n.t('auth.welcomeBack');
            this.subtitle.textContent = window.i18n.t('auth.signInSubtitle');
            this.submitBtn.innerHTML = `<span>${window.i18n.t('auth.signIn')}</span>`;
            this.switchLink.parentElement.innerHTML = `
                ${window.i18n.t('auth.dontHaveAccount')}
                <a href="#" id="switch-to-login">${window.i18n.t('auth.createAccountLink')}</a>
            `;
        }

        // Re-attach event listener
        this.switchLink = document.getElementById('switch-to-login');
        this.setupModeSwitch();
    }

    validateForm(email, password) {
        if (!email || !password) {
            this.authManager.showError('Please fill in all fields');
            return false;
        }

        if (!this.isValidEmail(email)) {
            this.authManager.showError('Please enter a valid email address');
            return false;
        }

        if (this.isSignUp && password.length < 8) {
            this.authManager.showError('Password must be at least 8 characters long');
            return false;
        }

        return true;
    }

    validateField(input) {
        const value = input.value.trim();

        if (input.type === 'email' && value && !this.isValidEmail(value)) {
            input.style.borderColor = '#ef4444';
            return false;
        }

        if (input.type === 'password' && value && this.isSignUp && value.length < 8) {
            input.style.borderColor = '#ef4444';
            return false;
        }

        input.style.borderColor = '#e2e8f0';
        return true;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    hideError() {
        const errorDiv = document.getElementById('auth-error');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    handleUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');

        if (mode === 'signin') {
            this.isSignUp = false;
            this.updateUIForMode();
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Create auth manager instance
    const authManager = new AuthManager();

    // Initialize auth
    await authManager.init();

    // Initialize page manager
    const pageManager = new AuthPageManager(authManager);
    pageManager.init();

    // Make available globally
    window.authManager = authManager;
    window.authPageManager = pageManager;

    // Handle sign out buttons globally
    document.addEventListener('click', async (e) => {
        if (e.target.matches('#sign-out-btn, .logout-btn')) {
            e.preventDefault();
            const result = await authManager.signOut();
            if (!result.success) {
                console.error('Sign out failed:', result.error);
            }
        }
    });
});