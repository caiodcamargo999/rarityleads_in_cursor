// Dashboard functionality with auth protection
import { handleSignOut } from './auth-handlers.js';

document.addEventListener('DOMContentLoaded', function() {
    console.log('📊 Dashboard: Starting initialization...');

    // Dashboard will only load if auth protection passes
    // (auth protection is handled in dashboard.html)
    initializeDashboard();
});

function initializeDashboard() {
    // Initialize sidebar toggle
    initializeSidebarToggle();

    // Initialize tooltips
    initializeTooltips();

    // Initialize charts
    initializeCharts();

    // Initialize interactive elements
    initializeInteractiveElements();

    // Simulate real-time updates
    startRealTimeUpdates();
}

function initializeSidebarToggle() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 &&
                !sidebar.contains(e.target) &&
                !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }
}

function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');

    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-popup';
    tooltip.textContent = e.target.getAttribute('data-tooltip');
    document.body.appendChild(tooltip);

    const rect = e.target.getBoundingClientRect();
    tooltip.style.position = 'absolute';
    tooltip.style.top = `${rect.bottom + 5}px`;
    tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip-popup');
    if (tooltip) {
        tooltip.remove();
    }
}

function initializeCharts() {
    // Initialize leads chart
    const leadsChart = document.getElementById('leads-chart');
    if (leadsChart) {
        const ctx = leadsChart.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Leads Generated',
                    data: [65, 89, 120, 151, 189, 247],
                    borderColor: '#8B5CF6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#94A3B8'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#94A3B8'
                        }
                    }
                }
            }
        });
    }
}

function initializeInteractiveElements() {
    // Add click handlers for action buttons
    const actionButtons = document.querySelectorAll('.action-btn, .action-btn-small');
    actionButtons.forEach(button => {
        button.addEventListener('click', handleActionClick);
    });

    // Add hover effects for cards
    const cards = document.querySelectorAll('.stat-card, .activity-item, .lead-item, .campaign-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-2px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Period selector functionality
    const periodSelect = document.getElementById('analytics-period');
    if (periodSelect) {
        periodSelect.addEventListener('change', (e) => {
            updateAnalyticsPeriod(e.target.value);
        });
    }
}

function handleActionClick(e) {
    const button = e.currentTarget;
    const originalText = button.innerHTML;

    // Show loading state
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    button.disabled = true;

    // Simulate API call
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;

        // Show success message
        showNotification('Action completed successfully!', 'success');
    }, 1500);
}

function updateAnalyticsPeriod(period) {
    console.log(`Updating analytics for ${period} days`);
    // Here you would typically fetch new data and update charts
    showNotification(`Analytics updated for last ${period} days`, 'info');
}

function startRealTimeUpdates() {
    // Simulate real-time updates every 30 seconds
    setInterval(() => {
        updateMetrics();
    }, 30000);
}

function updateMetrics() {
    // Simulate metric updates
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(value => {
        if (value.textContent.includes('$')) {
            // Update revenue
            const current = parseFloat(value.textContent.replace(/[$,]/g, ''));
            const newValue = current + Math.floor(Math.random() * 100);
            value.textContent = `$${newValue.toLocaleString()}`;
        } else if (value.textContent.includes('%')) {
            // Update percentage
            const current = parseFloat(value.textContent.replace('%', ''));
            const change = (Math.random() - 0.5) * 2; // -1 to 1
            const newValue = Math.max(0, Math.min(100, current + change));
            value.textContent = `${newValue.toFixed(1)}%`;
        }
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });

    // Set background color based on type
    const colors = {
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

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

    // Sign out handler using clean auth handler
    const signOutBtn = document.getElementById('sign-out-btn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', async () => {
            try {
                console.log('👋 Dashboard: Signing out user...');
                const result = await handleSignOut();
                if (result.error) {
                    throw result.error;
                }
                console.log('✅ Dashboard: Sign out successful');
                // handleSignOut will handle redirect
            } catch (error) {
                console.error('❌ Dashboard: Sign out failed:', error);
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