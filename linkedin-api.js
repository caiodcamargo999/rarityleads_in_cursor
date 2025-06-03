import { supabase } from './supabase.js';

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI;

// LinkedIn OAuth endpoints
const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const LINKEDIN_API_URL = 'https://api.linkedin.com/v2';

// Initialize LinkedIn connection
export async function initializeLinkedIn() {
    const user = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: linkedinToken, error } = await supabase
        .from('linkedin_tokens')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (error || !linkedinToken) {
        return getLinkedInAuthUrl();
    }

    return linkedinToken;
}

// Get LinkedIn authorization URL
function getLinkedInAuthUrl() {
    const scope = 'r_liteprofile r_emailaddress r_ads r_ads_reporting';
    const state = generateRandomString();
    
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: LINKEDIN_CLIENT_ID,
        redirect_uri: LINKEDIN_REDIRECT_URI,
        state,
        scope
    });

    return `${LINKEDIN_AUTH_URL}?${params.toString()}`;
}

// Exchange authorization code for access token
export async function exchangeCodeForToken(code) {
    const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: LINKEDIN_REDIRECT_URI,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET
    });

    const response = await fetch(LINKEDIN_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
    });

    if (!response.ok) {
        throw new Error('Failed to exchange code for token');
    }

    const data = await response.json();
    await saveLinkedInToken(data);
    return data;
}

// Save LinkedIn token to Supabase
async function saveLinkedInToken(tokenData) {
    const user = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
        .from('linkedin_tokens')
        .upsert({
            user_id: user.id,
            access_token: tokenData.access_token,
            expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
            refresh_token: tokenData.refresh_token
        });

    if (error) throw error;
}

// Fetch LinkedIn profile data
export async function getLinkedInProfile() {
    const token = await getValidLinkedInToken();
    
    const response = await fetch(`${LINKEDIN_API_URL}/me`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'cache-control': 'no-cache',
            'X-Restli-Protocol-Version': '2.0.0'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch LinkedIn profile');
    }

    return response.json();
}

// Fetch LinkedIn campaign data
export async function getLinkedInCampaigns() {
    const token = await getValidLinkedInToken();
    
    const response = await fetch(`${LINKEDIN_API_URL}/adCampaignsV2`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'cache-control': 'no-cache',
            'X-Restli-Protocol-Version': '2.0.0'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch LinkedIn campaigns');
    }

    return response.json();
}

// Get valid LinkedIn token (refreshes if expired)
async function getValidLinkedInToken() {
    const user = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: token, error } = await supabase
        .from('linkedin_tokens')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (error || !token) {
        throw new Error('No LinkedIn token found');
    }

    if (new Date(token.expires_at) <= new Date()) {
        return refreshLinkedInToken(token.refresh_token);
    }

    return token.access_token;
}

// Refresh LinkedIn token
async function refreshLinkedInToken(refreshToken) {
    const params = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET
    });

    const response = await fetch(LINKEDIN_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
    });

    if (!response.ok) {
        throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    await saveLinkedInToken(data);
    return data.access_token;
}

// Helper function to generate random string
function generateRandomString() {
    return Math.random().toString(36).substring(2, 15);
} 