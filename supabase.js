import { createClient } from '@supabase/supabase-js';

// Temporary configuration - replace with your actual Supabase credentials
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';

// For now, we'll create a mock client to prevent errors
const mockSupabase = {
    auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => {},
        signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        signOut: () => Promise.resolve({ error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: { message: 'Not configured' } })
    },
    from: () => ({
        insert: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
        select: () => ({
            eq: () => ({
                single: () => Promise.resolve({ data: null, error: { message: 'Not configured' } })
            })
        })
    })
};

export const supabase = mockSupabase;

// Helper function to check authentication
export async function checkAuth() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
        throw new Error('Not authenticated');
    }
    return user;
}

// Helper function to get user role
export async function getUserRole() {
    const user = await checkAuth();
    const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
    
    if (error) throw error;
    return data.role;
} 