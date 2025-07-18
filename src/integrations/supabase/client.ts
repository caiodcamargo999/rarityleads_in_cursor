
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pihkmthfiszfsdacfqfb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpaGttdGhmaXN6ZnNkYWNmcWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyMDgyOTksImV4cCI6MjA2Mzc4NDI5OX0.JVBeOZCQtvo35bgYRS3OnnWW5F9B_6PQ2mP86gvMzGw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})
