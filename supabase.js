import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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