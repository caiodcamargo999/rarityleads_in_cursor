
// Leads Module
const Leads = {
    supabase: null,
    currentLanguage: 'en',
    leadsData: [],
    filteredLeads: [],
    currentTab: 'all',
    
    async init() {
        this.supabase = window.AppUtils ? window.AppUtils.initSupabase() : null;
        await this.checkAuth();
        await this.initI18n();
        this.bindEvents();
        this.loadLeads();
        feather.replace(); // Initialize Feather icons
    },
    
    async checkAuth() {
        if (!this.supabase) return;
        const { data: { session } } = await this.supabase.auth.getSession();
        if (!session || !session.user || !session.user.email_confirmed_at) {
            window.location.href = '/register.html';
            return;
        }
    },
    
    async initI18n() {
        if (window.i18n) {
            this.currentLanguage = await window.i18n.detectLanguage();
            await window.i18n.translatePage();
        }
    },
    
    bindEvents() {
        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
        
        // Tabs
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab));
        });
        
        // Search and filters
        document.getElementById('leads-search').addEventListener('input', (e) => this.filterLeads());
        document.getElementById('status-filter').addEventListener('change', () => this.filterLeads());
        document.getElementById('score-filter').addEventListener('change', () => this.filterLeads());
        document.getElementById('clear-filters').addEventListener('click', () => this.clearFilters());
        
        // Add lead buttons
        document.getElementById('add-lead-btn').addEventListener('click', () => this.openAddLeadModal());
        document.getElementById('add-first-lead').addEventListener('click', () => this.openAddLeadModal());
        
        // Lead Generation Form
        document.getElementById('lead-criteria-form').addEventListener('submit', (e) => this.handleLeadGeneration(e));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    },
    
    switchTab(activeTab) {
        // Update tab states
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });
        activeTab.classList.add('active');
        activeTab.setAttribute('aria-selected', 'true');
        
        // Show corresponding content
        const targetId = activeTab.getAttribute('aria-controls');
        document.querySelectorAll('[role="tabpanel"]').forEach(panel => {
            panel.style.display = 'none';
        });
        document.getElementById(targetId).style.display = '';
        
        this.currentTab = activeTab.id.replace('tab-', '');
        this.filterLeads();
    },
    
    handleKeyboard(e) {
        // Tab navigation with arrow keys
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const tabs = document.querySelectorAll('.tab');
            const activeTab = document.querySelector('.tab.active');
            const currentIndex = Array.from(tabs).indexOf(activeTab);
            
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                tabs[currentIndex - 1].click();
            } else if (e.key === 'ArrowRight' && currentIndex < tabs.length - 1) {
                tabs[currentIndex + 1].click();
            }
        }
    },
    
    async logout() {
        if (this.supabase) await this.supabase.auth.signOut();
        window.location.href = '/register.html';
    },
    
    async loadLeads() {
        try {
            if (!this.supabase) return;
            
            const { data, error } = await this.supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            this.leadsData = data || [];
            this.filteredLeads = [...this.leadsData];
            this.renderLeadsTable();
            this.updateMetrics();
            
        } catch (error) {
            console.error('Failed to load leads:', error);
            this.showError('Failed to load leads');
        }
    },
    
    filterLeads() {
        const searchTerm = document.getElementById('leads-search').value.toLowerCase();
        const statusFilter = document.getElementById('status-filter').value;
        const scoreFilter = document.getElementById('score-filter').value;
        
        this.filteredLeads = this.leadsData.filter(lead => {
            const matchesSearch = !searchTerm || 
                lead.lead_name?.toLowerCase().includes(searchTerm) ||
                lead.email?.toLowerCase().includes(searchTerm) ||
                lead.position?.toLowerCase().includes(searchTerm);
            
            const matchesStatus = !statusFilter || lead.status === statusFilter;
            
            const matchesScore = !scoreFilter || this.getScoreClass(lead.lead_score) === scoreFilter;
            
            return matchesSearch && matchesStatus && matchesScore;
        });
        
        this.renderLeadsTable();
    },
    
    clearFilters() {
        document.getElementById('leads-search').value = '';
        document.getElementById('status-filter').value = '';
        document.getElementById('score-filter').value = '';
        this.filterLeads();
    },
    
    renderLeadsTable() {
        const tbody = document.getElementById('leads-table-body');
        const emptyState = document.getElementById('leads-empty');
        
        if (this.filteredLeads.length === 0) {
            tbody.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        
        tbody.innerHTML = this.filteredLeads.map(lead => `
            <tr>
                <td>${lead.lead_name || 'N/A'}</td>
                <td>${lead.email || 'N/A'}</td>
                <td>${lead.position || 'N/A'}</td>
                <td><span class="score-badge score-${this.getScoreClass(lead.lead_score)}">${lead.lead_score || 0}</span></td>
                <td><span class="status-badge status-${lead.status || 'new'}">${this.formatStatus(lead.status)}</span></td>
                <td>${this.formatDate(lead.created_at)}</td>
                <td>
                    <button class="action-btn" onclick="Leads.editLead('${lead.id}')" data-i18n="leads.actions.edit">Edit</button>
                    <button class="action-btn" onclick="Leads.deleteLead('${lead.id}')" data-i18n="leads.actions.delete">Delete</button>
                </td>
            </tr>
        `).join('');
    },
    
    updateMetrics() {
        const total = this.leadsData.length;
        const hot = this.leadsData.filter(lead => lead.status === 'hot').length;
        const warm = this.leadsData.filter(lead => lead.status === 'warm').length;
        const converted = this.leadsData.filter(lead => lead.status === 'converted').length;
        
        document.getElementById('total-leads').textContent = total;
        document.getElementById('hot-leads').textContent = hot;
        document.getElementById('warm-leads').textContent = warm;
        document.getElementById('converted-leads').textContent = converted;
    },
    
    getScoreClass(score) {
        if (score >= 80) return 'high';
        if (score >= 50) return 'medium';
        return 'low';
    },
    
    formatStatus(status) {
        const statusMap = {
            'new': 'New',
            'warm': 'Warm',
            'hot': 'Hot',
            'cold': 'Cold',
            'converted': 'Converted'
        };
        return statusMap[status] || 'New';
    },
    
    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    },
    
    openAddLeadModal() {
        // Placeholder for add lead modal
        console.log('Opening add lead modal...');
        alert('Add lead functionality coming soon');
    },
    
    editLead(leadId) {
        // Placeholder for edit lead functionality
        console.log('Editing lead:', leadId);
        alert('Edit lead functionality coming soon');
    },
    
    deleteLead(leadId) {
        // Placeholder for delete lead functionality
        if (confirm('Are you sure you want to delete this lead?')) {
            console.log('Deleting lead:', leadId);
            alert('Delete lead functionality coming soon');
        }
    },
    
    showError(message) {
        console.error(message);
        // Placeholder for error display
    },

    // New lead generation functionality
    async handleLeadGeneration(event) {
        event.preventDefault();
        const customerType = document.getElementById('customer-type').value;
        const annualIncome = document.getElementById('annual-income').value;
        const targetEntity = document.getElementById('target-entity').value;
        const serviceType = document.getElementById('service-type').value;

        console.log('Generating leads with criteria:', { customerType, annualIncome, targetEntity, serviceType });

        // Simulate API call to generate leads
        const generatedLeads = await this.simulateLeadGeneration({
            customerType,
            annualIncome: parseInt(annualIncome),
            targetEntity,
            serviceType
        });

        this.leadsData = generatedLeads; // Replace existing leads with generated ones
        this.filterLeads(); // Re-render table with new leads
        this.updateMetrics();

        alert('Warm leads generated and displayed!');
    },

    async simulateLeadGeneration(criteria) {
        // This is a placeholder for actual lead generation logic.
        // In a real application, this would involve an API call to a backend service
        // that uses AI/ML to find and qualify leads based on the criteria.
        console.log("Simulating lead generation with criteria:", criteria);

        const dummyLeads = [
            {
                id: 'lead1',
                lead_name: 'Alice Smith',
                email: 'alice.smith@example.com',
                position: 'CEO',
                lead_score: 95,
                status: 'hot',
                created_at: new Date().toISOString(),
                contact: 'alice.smith@example.com'
            },
            {
                id: 'lead2',
                lead_name: 'Bob Johnson',
                email: 'bob.johnson@example.com',
                position: 'Marketing Director',
                lead_score: 88,
                status: 'hot',
                created_at: new Date().toISOString(),
                contact: '+1-555-123-4567'
            },
            {
                id: 'lead3',
                lead_name: 'Charlie Brown',
                email: 'charlie.brown@example.com',
                position: 'Sales Manager',
                lead_score: 72,
                status: 'warm',
                created_at: new Date().toISOString(),
                contact: 'charlie.brown@example.com'
            },
        ];

        // Filter dummy leads based on some simple criteria for demonstration
        return dummyLeads.filter(lead => {
            let matches = true;
            if (criteria.customerType === 'b2b' && lead.position === 'CEO') matches = true; // Simple B2B check
            if (criteria.annualIncome && lead.lead_score < (criteria.annualIncome / 1000)) matches = false; // Simple income check
            // Add more complex filtering based on criteria in a real scenario
            return matches;
        });
    }
};

// Initialize Leads when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.AuthGuard = new AuthGuard();
    Leads.init();
});
