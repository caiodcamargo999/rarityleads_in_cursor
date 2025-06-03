import { supabase } from './supabase.js';

// Campaign API
export async function createCampaign(campaignData) {
    try {
        const { data, error } = await supabase
            .from('campaigns')
            .insert([campaignData])
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error creating campaign:', error);
        throw error;
    }
}

export async function getCampaigns() {
    try {
        const { data, error } = await supabase
            .from('campaigns')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        throw error;
    }
}

// Sequence API
export async function createSequence(sequenceData) {
    try {
        const { data, error } = await supabase
            .from('sequences')
            .insert([sequenceData])
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error creating sequence:', error);
        throw error;
    }
}

export async function getSequences() {
    try {
        const { data, error } = await supabase
            .from('sequences')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching sequences:', error);
        throw error;
    }
}

// Leads API
export async function getLeads(filters = {}) {
    try {
        let query = supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        // Apply filters
        if (filters.dateRange) {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - filters.dateRange);
            query = query.gte('created_at', startDate.toISOString());
        }

        if (filters.status && filters.status.length > 0) {
            query = query.in('status', filters.status);
        }

        if (filters.source && filters.source.length > 0) {
            query = query.in('source', filters.source);
        }

        if (filters.scoreMin !== undefined) {
            query = query.gte('score', filters.scoreMin);
        }

        if (filters.scoreMax !== undefined) {
            query = query.lte('score', filters.scoreMax);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching leads:', error);
        throw error;
    }
}

export async function updateLeadStatus(leadId, status) {
    try {
        const { data, error } = await supabase
            .from('leads')
            .update({ status })
            .eq('id', leadId)
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error updating lead status:', error);
        throw error;
    }
}

// Analytics API
export async function getFunnelData(days = 30) {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const { data, error } = await supabase
            .from('leads')
            .select('status, created_at')
            .gte('created_at', startDate.toISOString());

        if (error) throw error;

        // Process data to get funnel metrics
        const funnel = {
            impressions: 0,
            clicks: 0,
            leads: data.length,
            qualified: data.filter(lead => lead.status === 'qualified').length,
            appointments: data.filter(lead => lead.status === 'appointment').length,
            closed: data.filter(lead => lead.status === 'closed').length
        };

        return funnel;
    } catch (error) {
        console.error('Error fetching funnel data:', error);
        throw error;
    }
}

export async function getCampaignPerformance(days = 7) {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const { data, error } = await supabase
            .from('campaign_metrics')
            .select('*')
            .gte('date', startDate.toISOString())
            .order('date', { ascending: true });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching campaign performance:', error);
        throw error;
    }
}

// User Profile API
export async function getUserProfile() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error('No user found');

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}

export async function updateUserProfile(profileData) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error('No user found');

        const { data, error } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', user.id)
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
} 