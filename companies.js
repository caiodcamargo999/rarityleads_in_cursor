// Companies Module
const Companies = {
    supabase: null,
    companiesData: [],
    filteredCompanies: [],

    async init() {
        this.supabase = window.AppUtils ? window.AppUtils.initSupabase() : null;
        await this.checkAuth();
        this.bindEvents();
        this.loadCompanies();
        if (typeof feather !== 'undefined') feather.replace();
    },

    async checkAuth() {
        if (!this.supabase) return;
        const { data: { session } } = await this.supabase.auth.getSession();
        if (!session) {
            window.location.href = '/auth.html';
        }
    },

    bindEvents() {
        const addBtn = document.getElementById('add-first-company');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showAddCompanyModal());
        }
        const clearBtn = document.getElementById('clear-filters');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearFilters());
        }
        const searchInput = document.getElementById('companies-search');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterCompanies());
        }
        const industryFilter = document.getElementById('industry-filter');
        if (industryFilter) {
            industryFilter.addEventListener('change', () => this.filterCompanies());
        }
        const sizeFilter = document.getElementById('size-filter');
        if (sizeFilter) {
            sizeFilter.addEventListener('change', () => this.filterCompanies());
        }
    },

    async loadCompanies() {
        try {
            if (!this.supabase) return;
            const { data, error } = await this.supabase
                .from('companies')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            this.companiesData = data || [];
            this.filteredCompanies = [...this.companiesData];
            this.renderCompanies();
            this.updateMetrics();
        } catch (error) {
            console.error('Failed to load companies:', error);
            this.companiesData = [];
            this.filteredCompanies = [];
            this.renderCompanies();
            this.updateMetrics();
        }
    },

    filterCompanies() {
        const searchTerm = document.getElementById('companies-search').value.toLowerCase();
        const industry = document.getElementById('industry-filter').value;
        const size = document.getElementById('size-filter').value;
        this.filteredCompanies = this.companiesData.filter(company => {
            const matchesSearch = !searchTerm ||
                (company.name && company.name.toLowerCase().includes(searchTerm));
            const matchesIndustry = !industry || (company.data && company.data.industry === industry);
            const matchesSize = !size || (company.data && company.data.size === size);
            return matchesSearch && matchesIndustry && matchesSize;
        });
        this.renderCompanies();
    },

    clearFilters() {
        document.getElementById('companies-search').value = '';
        document.getElementById('industry-filter').value = '';
        document.getElementById('size-filter').value = '';
        this.filterCompanies();
    },

    renderCompanies() {
        const grid = document.getElementById('companies-grid');
        const empty = document.getElementById('companies-empty');
        if (!grid || !empty) return;
        if (this.filteredCompanies.length === 0) {
            grid.innerHTML = '';
            empty.style.display = 'block';
            return;
        }
        empty.style.display = 'none';
        grid.innerHTML = this.filteredCompanies.map(company => `
            <div class="company-card">
                <div class="company-header">
                    <h4>${company.name || 'Unnamed Company'}</h4>
                </div>
                <div class="company-details">
                    <div><strong>Industry:</strong> ${company.data?.industry || '-'}</div>
                    <div><strong>Size:</strong> ${company.data?.size || '-'}</div>
                    <div><strong>Created:</strong> ${new Date(company.created_at).toLocaleDateString()}</div>
                </div>
            </div>
        `).join('');
    },

    updateMetrics() {
        document.getElementById('total-companies').textContent = this.companiesData.length;
        // For demo, targeted/contacted/converted are zero or can be calculated if you have such data
        document.getElementById('targeted-companies').textContent = 0;
        document.getElementById('contacted-companies').textContent = 0;
        document.getElementById('converted-companies').textContent = 0;
    },

    showAddCompanyModal() {
        // For now, just prompt for a name and add a company
        const name = prompt('Enter company name:');
        if (name) {
            this.addCompany({ name });
        }
    },

    async addCompany({ name }) {
        try {
            if (!this.supabase) return;
            const { data, error } = await this.supabase
                .from('companies')
                .insert([{ name, data: {} }])
                .select();
            if (error) throw error;
            this.companiesData.unshift(data[0]);
            this.filterCompanies();
            this.updateMetrics();
        } catch (error) {
            alert('Failed to add company');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.Companies) window.Companies.init();
}); 