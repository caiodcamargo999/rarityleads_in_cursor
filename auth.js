import { supabase } from './supabase.js';

// Authentication state management
const auth = {
    currentUser: null,
    isAuthenticated: false,

    // Initialize auth state from Supabase session
    async init() {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            
            if (session) {
                this.currentUser = session.user;
                this.isAuthenticated = true;
                this.updateUI();
            }

            // Listen for auth changes
            supabase.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN') {
                    this.currentUser = session.user;
                    this.isAuthenticated = true;
                    window.location.href = '/dashboard.html';
                } else if (event === 'SIGNED_OUT') {
                    this.currentUser = null;
                    this.isAuthenticated = false;
                    window.location.href = '/index.html';
                }
                this.updateUI();
            });
        } catch (error) {
            console.error('Auth initialization error:', error);
        }
    },

    // Sign up new user
    async signup(email, password, name) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name
                    }
                }
            });

            if (error) throw error;

            // Create user profile in profiles table
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: data.user.id,
                        full_name: name,
                        email: email,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (profileError) throw profileError;

            return { success: true };
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: error.message };
        }
    },

    // Sign in existing user
    async signin(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            return { success: true };
        } catch (error) {
            console.error('Signin error:', error);
            return { success: false, error: error.message };
        }
    },

    // Sign out user
    async signout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            this.currentUser = null;
            this.isAuthenticated = false;
            this.updateUI();
        } catch (error) {
            console.error('Signout error:', error);
        }
    },

    // Update UI based on auth state
    updateUI() {
        const authModal = document.getElementById('auth-modal');
        const dashboardLink = document.getElementById('dashboard-link');
        const authTriggers = document.querySelectorAll('#auth-trigger, #hero-auth-trigger');
        
        if (this.isAuthenticated) {
            authModal.style.display = 'none';
            if (dashboardLink) {
                dashboardLink.style.display = 'inline-block';
            }
            authTriggers.forEach(trigger => {
                trigger.textContent = 'Go to Dashboard';
                trigger.addEventListener('click', () => {
                    window.location.href = '/dashboard.html';
                });
            });
        } else {
            if (dashboardLink) {
                dashboardLink.style.display = 'none';
            }
            authTriggers.forEach(trigger => {
                trigger.textContent = 'Get Started';
                trigger.addEventListener('click', () => {
                    authModal.show('signup');
                });
            });
        }
    }
};

// Auth Modal Management
const authModal = {
    show(type = 'signin') {
        const modal = document.getElementById('auth-modal');
        const signinForm = document.getElementById('signin-form');
        const signupForm = document.getElementById('signup-form');
        
        modal.style.display = 'flex';
        
        if (type === 'signin') {
            signinForm.style.display = 'block';
            signupForm.style.display = 'none';
        } else {
            signinForm.style.display = 'none';
            signupForm.style.display = 'block';
        }
    },

    hide() {
        const modal = document.getElementById('auth-modal');
        modal.style.display = 'none';
    },

    init() {
        // Handle form submissions
        document.getElementById('signin-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;
            
            const result = await auth.signin(email, password);
            if (result.success) {
                this.hide();
                window.location.href = '/dashboard.html';
            } else {
                alert(result.error || 'Sign in failed');
            }
        });

        document.getElementById('signup-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;
            const name = e.target.name.value;
            
            const result = await auth.signup(email, password, name);
            if (result.success) {
                this.hide();
                window.location.href = '/dashboard.html';
            } else {
                alert(result.error || 'Sign up failed');
            }
        });

        // Handle modal close
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.hide());
        });

        // Handle tab switching
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                this.show(type);
            });
        });
    }
};

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    auth.init();
    authModal.init();
    
    // Handle CTA form submission
    const ctaForm = document.getElementById('cta-form');
    if (ctaForm) {
        ctaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            authModal.show('signup');
            // Pre-fill email in signup form
            document.getElementById('signup-email').value = email;
        });
    }
}); 