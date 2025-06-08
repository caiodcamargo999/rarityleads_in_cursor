// Authentication handlers - Clean implementation following React patterns
import { supabase } from './supabase.js';

// Google OAuth login handler - NO manual redirect logic
export const handleGoogleLogin = async () => {
    console.log('🔗 Starting Google OAuth login...');

    try {
        // ONLY call Supabase OAuth - NO redirect logic here
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth.html` // Return to auth page, let listener handle routing
            }
        });

        if (error) {
            console.error('❌ Error logging in with Google:', error.message);
            throw error;
        }

        console.log('✅ Google OAuth initiated successfully');
        console.log('📍 OAuth will redirect to Supabase callback, then back to auth.html');
        console.log('🎯 Central listener will handle all routing logic');

        return { data, error: null };
    } catch (error) {
        console.error('💥 Google login failed:', error);
        return { data: null, error };
    }
};

// Email/password signup handler
export const handleEmailSignUp = async (email, password, options = {}) => {
    console.log('📧 Starting email signup...');
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/dashboard.html`,
                data: {
                    full_name: options.fullName || '',
                    ...options.metadata
                }
            }
        });

        if (error) {
            console.error('❌ Email signup error:', error.message);
            throw error;
        }

        console.log('✅ Email signup successful');
        return { data, error: null };
    } catch (error) {
        console.error('💥 Email signup failed:', error);
        return { data: null, error };
    }
};

// Email/password signin handler
export const handleEmailSignIn = async (email, password) => {
    console.log('📧 Starting email signin...');
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error('❌ Email signin error:', error.message);
            throw error;
        }

        console.log('✅ Email signin successful');
        return { data, error: null };
    } catch (error) {
        console.error('💥 Email signin failed:', error);
        return { data: null, error };
    }
};

// Sign out handler
export const handleSignOut = async () => {
    console.log('👋 Starting sign out...');
    
    try {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            console.error('❌ Sign out error:', error.message);
            throw error;
        }

        console.log('✅ Sign out successful');
        
        // Clear any local storage
        localStorage.removeItem('user_preferences');
        sessionStorage.clear();
        
        // Redirect to home
        window.location.href = '/';
        
        return { error: null };
    } catch (error) {
        console.error('💥 Sign out failed:', error);
        return { error };
    }
};

// Get current session
export const getCurrentSession = async () => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
            console.error('❌ Get session error:', error.message);
            throw error;
        }

        return { session, error: null };
    } catch (error) {
        console.error('💥 Get session failed:', error);
        return { session: null, error };
    }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
    const { session, error } = await getCurrentSession();
    return !error && session !== null;
};

// Auth state change listener
export const onAuthStateChange = (callback) => {
    console.log('👂 Setting up auth state listener...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email || 'no user');
        callback(event, session);
    });

    return subscription;
};

// Create login button (vanilla JS equivalent of React component)
export const createGoogleLoginButton = (containerId, buttonText = 'Sign Up with Google') => {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`❌ Container with ID '${containerId}' not found`);
        return null;
    }

    const button = document.createElement('button');
    button.className = 'google-login-btn';
    button.innerHTML = `
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo" style="width: 20px; height: 20px; margin-right: 8px;" />
        <span>${buttonText}</span>
    `;
    
    button.addEventListener('click', async (e) => {
        e.preventDefault();
        
        // Show loading state
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
        button.disabled = true;
        
        try {
            const result = await handleGoogleLogin();
            
            if (!result.error) {
                console.log('🚀 Google login initiated, redirecting...');
                // OAuth will handle the redirect
            } else {
                throw result.error;
            }
        } catch (error) {
            console.error('❌ Google login button error:', error);
            alert('Failed to start Google login: ' + error.message);
            
            // Restore button state
            button.innerHTML = originalHTML;
            button.disabled = false;
        }
    });

    container.appendChild(button);
    return button;
};

// Utility function to show user-friendly error messages
export const getErrorMessage = (error) => {
    const errorMessages = {
        'Invalid login credentials': 'Invalid email or password. Please try again.',
        'Email not confirmed': 'Please verify your email address before signing in.',
        'User already registered': 'An account with this email already exists.',
        'Password should be at least 6 characters': 'Password must be at least 6 characters long.',
        'Invalid email': 'Please enter a valid email address.',
        'Signup disabled': 'New registrations are currently disabled.',
        'Email rate limit exceeded': 'Too many emails sent. Please wait before requesting another.',
        'Provider not found': 'Google OAuth is not configured. Please contact support.',
    };
    
    const message = error?.message || error;
    return errorMessages[message] || message || 'An unexpected error occurred. Please try again.';
};
