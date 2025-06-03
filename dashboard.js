import { initializeModals } from './dashboard-modals.js';
import { initializeCharts } from './dashboard-charts.js';
import { 
    getCampaigns, 
    getSequences, 
    getLeads, 
    getFunnelData, 
    getCampaignPerformance,
    getUserProfile
} from './dashboard-api.js';

const SUPABASE_URL = 'https://yejheyrdsucgzpzwxuxs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllamhleXJkc3VjZ3pwend4dXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MDg2NzQsImV4cCI6MjA2NDM4NDY3NH0.NzCJ8i3SKpABO6ykWRX3nHDYmjVB82KL1wfgaY3trM4';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Initialize dashboard
export async function initializeDashboard() {
    try {
        // Initialize UI components
        initializeModals();
        initializeCharts();

        // Load user profile
        const profile = await getUserProfile();
        updateUserInfo(profile);

        // Load dashboard data
        await loadDashboardData();

        // Set up event listeners
        setupEventListeners();
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showError('Failed to initialize dashboard. Please try refreshing the page.');
    }
}

// Update user information in the UI
function updateUserInfo(profile) {
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome back, ${profile.full_name}!`;
    }

    const roleSelect = document.getElementById('role-select');
    if (roleSelect) {
        roleSelect.value = profile.role;
    }
}

// Load all dashboard data
async function loadDashboardData() {
    try {
        // Load campaigns
        const campaigns = await getCampaigns();
        updateCampaignsList(campaigns);

        // Load sequences
        const sequences = await getSequences();
        updateSequencesList(sequences);

        // Load leads
        const userId = await getSessionUserId();
        if (!userId) return;
        const leads = await fetchLeads(userId);
        updateLeadsTable(leads);

        // Load funnel data
        const funnelData = await getFunnelData();
        updateFunnelChart(funnelData);

        // Load campaign performance
        const performanceData = await getCampaignPerformance();
        updateCampaignChart(performanceData);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError('Failed to load dashboard data. Please try refreshing the page.');
    }
}

// Update campaigns list
function updateCampaignsList(campaigns) {
    const campaignsList = document.querySelector('.campaigns-list');
    if (!campaignsList) return;

    campaignsList.innerHTML = campaigns.map(campaign => `
        <div class="campaign-card">
            <h3>${campaign.name}</h3>
            <div class="campaign-info">
                <span class="platform">${campaign.platform}</span>
                <span class="status ${campaign.status}">${campaign.status}</span>
            </div>
            <div class="campaign-metrics">
                <div class="metric">
                    <span class="label">Budget</span>
                    <span class="value">$${campaign.budget}</span>
                </div>
                <div class="metric">
                    <span class="label">Objective</span>
                    <span class="value">${campaign.objective}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Update sequences list
function updateSequencesList(sequences) {
    const sequencesList = document.querySelector('.sequences-list');
    if (!sequencesList) return;

    sequencesList.innerHTML = sequences.map(sequence => `
        <div class="sequence-card">
            <h3>${sequence.name}</h3>
            <div class="sequence-info">
                <span class="platform">${sequence.platform}</span>
                <span class="status ${sequence.status}">${sequence.status}</span>
            </div>
            <div class="sequence-details">
                <div class="detail">
                    <span class="label">Trigger</span>
                    <span class="value">${sequence.trigger}</span>
                </div>
                <div class="detail">
                    <span class="label">Steps</span>
                    <span class="value">${sequence.steps.length}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Update leads table
function updateLeadsTable(leads) {
    const leadsTable = document.querySelector('.leads-table tbody');
    if (!leadsTable) return;

    leadsTable.innerHTML = leads.map(lead => `
        <tr>
            <td>${lead.name || ''}</td>
            <td>${lead.email || ''}</td>
            <td>${lead.company || ''}</td>
            <td>${lead.status || ''}</td>
            <td>${lead.score != null ? lead.score : ''}</td>
            <td>
                <button class="btn-secondary" onclick="viewLead('${lead.id}')">View</button>
            </td>
        </tr>
    `).join('');
}

// Set up event listeners
function setupEventListeners() {
    // Role change handler
    const roleSelect = document.getElementById('role-select');
    if (roleSelect) {
        roleSelect.addEventListener('change', async (e) => {
            try {
                const newRole = e.target.value;
                await updateUserProfile({ role: newRole });
                window.location.reload();
            } catch (error) {
                console.error('Error updating role:', error);
                showError('Failed to update role. Please try again.');
            }
        });
    }

    // Sign out handler
    const signOutBtn = document.getElementById('sign-out-btn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', async () => {
            try {
                await supabase.auth.signOut();
                window.location.href = '/';
            } catch (error) {
                console.error('Error signing out:', error);
                showError('Failed to sign out. Please try again.');
            }
        });
    }
}

// Show error message
function showError(message) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.textContent = message;
    
    document.body.appendChild(errorContainer);
    
    setTimeout(() => {
        errorContainer.remove();
    }, 5000);
}

async function getSessionUserId() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = '/auth.html';
        return null;
    }
    return session.user.id;
}

async function fetchLeads(userId) {
    const { data: leads = [] } = await supabase
        .from('leads')
        .select('id, created_at, status, stage, source, score, name, email, company')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    return leads;
}

// Placeholder for view action
window.viewLead = function(id) {
    alert('View lead: ' + id);
};

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeDashboard); 