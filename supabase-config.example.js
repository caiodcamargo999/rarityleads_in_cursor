// Supabase Configuration Example
// Copy this file to supabase-config.js and replace with your actual credentials

export const supabaseConfig = {
    // Your Supabase project URL
    url: 'https://your-project-id.supabase.co',
    
    // Your Supabase anon/public key
    anonKey: 'your-anon-key-here',
    
    // Auth configuration
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
    },
    
    // OAuth providers configuration
    oauth: {
        google: {
            enabled: true,
            clientId: 'your-google-client-id.apps.googleusercontent.com'
        },
        github: {
            enabled: true,
            clientId: 'your-github-client-id'
        }
    },
    
    // Email templates configuration
    email: {
        confirmationRedirectTo: `${window.location.origin}/dashboard.html`,
        resetPasswordRedirectTo: `${window.location.origin}/auth.html?mode=reset`
    }
};

// Instructions for setup:
// 1. Create a new Supabase project at https://supabase.com
// 2. Go to Settings > API to get your URL and anon key
// 3. Go to Authentication > Settings to configure OAuth providers
// 4. Go to Authentication > URL Configuration to set redirect URLs
// 5. Run the schema_new.sql file in your Supabase SQL editor
// 6. Copy this file to supabase-config.js and update the values
