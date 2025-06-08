import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2';

// Environment-based configuration
// For production, these should be set via Netlify environment variables
// For development, they're hardcoded here
const supabaseUrl = window.location.hostname === 'localhost'
  ? 'https://yejheyrdsucgzpzwxuxs.supabase.co'  // Development
  : 'https://yejheyrdsucgzpzwxuxs.supabase.co'; // Production

const supabaseAnonKey = window.location.hostname === 'localhost'
  ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllamhleXJkc3VjZ3pwend4dXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MDg2NzQsImV4cCI6MjA2NDM4NDY3NH0.NzCJ8i3SKpABO6ykWRX3nHDYmjVB82KL1wfgaY3trM4'  // Development
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllamhleXJkc3VjZ3pwend4dXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MDg2NzQsImV4cCI6MjA2NDM4NDY3NH0.NzCJ8i3SKpABO6ykWRX3nHDYmjVB82KL1wfgaY3trM4'; // Production

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
    }
});

console.log('🔧 Supabase client initialized:', {
    url: supabaseUrl,
    environment: window.location.hostname === 'localhost' ? 'development' : 'production'
});

// Authentication functions
export const auth = {
    // Sign up with email and password
    async signUp(email, password, options = {}) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/dashboard.html`,
                    data: {
                        full_name: options.fullName || '',
                        role: options.role || 'client'
                    }
                }
            });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Sign up error:', error);
            return { data: null, error };
        }
    },

    // Sign in with email and password
    async signIn(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Sign in error:', error);
            return { data: null, error };
        }
    },

    // Sign up/Sign in with Google
    async signInWithGoogle() {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/dashboard.html`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    }
                }
            });

            if (error) throw error;

            // OAuth will handle the redirect automatically
            // Email verification will be sent automatically by Supabase
            return { data, error: null };
        } catch (error) {
            console.error('Google authentication error:', error);
            return { data: null, error };
        }
    },

    // Sign in with GitHub
    async signInWithGitHub() {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: `${window.location.origin}/dashboard.html`
                }
            });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('GitHub sign in error:', error);
            return { data: null, error };
        }
    },

    // Sign out
    async signOut() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            // Redirect to home page
            window.location.href = '/index.html';
            return { error: null };
        } catch (error) {
            console.error('Sign out error:', error);
            return { error };
        }
    },

    // Get current user
    async getCurrentUser() {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) throw error;
            return { user, error: null };
        } catch (error) {
            console.error('Get user error:', error);
            return { user: null, error };
        }
    },

    // Get current session
    async getSession() {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            return { session, error: null };
        } catch (error) {
            console.error('Get session error:', error);
            return { session: null, error };
        }
    },

    // Resend email verification
    async resendVerification(email) {
        try {
            const { data, error } = await supabase.auth.resend({
                type: 'signup',
                email: email,
                options: {
                    emailRedirectTo: `${window.location.origin}/dashboard.html`
                }
            });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Resend verification error:', error);
            return { data: null, error };
        }
    },

    // Reset password
    async resetPassword(email) {
        try {
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth.html?mode=reset`
            });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Reset password error:', error);
            return { data: null, error };
        }
    },

    // Update password
    async updatePassword(newPassword) {
        try {
            const { data, error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Update password error:', error);
            return { data: null, error };
        }
    }
};

// Helper function to check authentication
export async function checkAuth() {
    const { user, error } = await auth.getCurrentUser();
    if (error || !user) {
        throw new Error('Not authenticated');
    }
    return user;
}

// Helper function to get user profile
export async function getUserProfile(userId) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Get user profile error:', error);
        return { data: null, error };
    }
}

// Helper function to update user profile
export async function updateUserProfile(userId, updates) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Update user profile error:', error);
        return { data: null, error };
    }
}

// Auth state change listener
export function onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session);
    });
}