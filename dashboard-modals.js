// Initialize all dashboard modals
export function initializeModals() {
    initializeCreateCampaignModal();
    initializeCreateSequenceModal();
    initializeFilterLeadsModal();
}

// Create Campaign Modal
function initializeCreateCampaignModal() {
    const modal = document.getElementById('create-campaign-modal');
    const trigger = document.getElementById('create-campaign-btn');
    
    if (!modal || !trigger) return;

    // Create modal content
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Create New Campaign</h2>
                <button class="close-modal">&times;</button>
            </div>
            <form id="create-campaign-form">
                <div class="form-group">
                    <label for="campaign-name">Campaign Name</label>
                    <input type="text" id="campaign-name" required>
                </div>
                <div class="form-group">
                    <label for="campaign-platform">Platform</label>
                    <select id="campaign-platform" required>
                        <option value="facebook">Facebook Ads</option>
                        <option value="google">Google Ads</option>
                        <option value="linkedin">LinkedIn Ads</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="campaign-objective">Objective</label>
                    <select id="campaign-objective" required>
                        <option value="leads">Lead Generation</option>
                        <option value="awareness">Brand Awareness</option>
                        <option value="conversions">Conversions</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="campaign-budget">Daily Budget</label>
                    <input type="number" id="campaign-budget" min="1" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Create Campaign</button>
                    <button type="button" class="btn-secondary close-modal">Cancel</button>
                </div>
            </form>
        </div>
    `;

    // Show modal
    trigger.addEventListener('click', () => {
        modal.classList.add('active');
    });

    // Hide modal
    modal.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    });

    // Handle form submission
    const form = modal.querySelector('#create-campaign-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            // TODO: Implement API call to create campaign
            console.log('Creating campaign:', data);
            modal.classList.remove('active');
        } catch (error) {
            console.error('Error creating campaign:', error);
        }
    });
}

// Create Sequence Modal
function initializeCreateSequenceModal() {
    const modal = document.getElementById('create-sequence-modal');
    const trigger = document.getElementById('create-sequence-btn');
    
    if (!modal || !trigger) return;

    // Create modal content
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Create Automation Sequence</h2>
                <button class="close-modal">&times;</button>
            </div>
            <form id="create-sequence-form">
                <div class="form-group">
                    <label for="sequence-name">Sequence Name</label>
                    <input type="text" id="sequence-name" required>
                </div>
                <div class="form-group">
                    <label for="sequence-platform">Platform</label>
                    <select id="sequence-platform" required>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="sequence-trigger">Trigger</label>
                    <select id="sequence-trigger" required>
                        <option value="lead_created">New Lead</option>
                        <option value="lead_qualified">Lead Qualified</option>
                        <option value="appointment_scheduled">Appointment Scheduled</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="sequence-steps">Steps</label>
                    <div id="sequence-steps">
                        <div class="sequence-step">
                            <input type="text" placeholder="Message content" required>
                            <select required>
                                <option value="0">Immediately</option>
                                <option value="1">After 1 hour</option>
                                <option value="24">After 24 hours</option>
                            </select>
                            <button type="button" class="remove-step">Remove</button>
                        </div>
                    </div>
                    <button type="button" class="btn-secondary" id="add-step">Add Step</button>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Create Sequence</button>
                    <button type="button" class="btn-secondary close-modal">Cancel</button>
                </div>
            </form>
        </div>
    `;

    // Show modal
    trigger.addEventListener('click', () => {
        modal.classList.add('active');
    });

    // Hide modal
    modal.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    });

    // Add step
    const addStepBtn = modal.querySelector('#add-step');
    const stepsContainer = modal.querySelector('#sequence-steps');
    
    addStepBtn.addEventListener('click', () => {
        const step = document.createElement('div');
        step.className = 'sequence-step';
        step.innerHTML = `
            <input type="text" placeholder="Message content" required>
            <select required>
                <option value="0">Immediately</option>
                <option value="1">After 1 hour</option>
                <option value="24">After 24 hours</option>
            </select>
            <button type="button" class="remove-step">Remove</button>
        `;
        stepsContainer.appendChild(step);
    });

    // Remove step
    stepsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-step')) {
            e.target.parentElement.remove();
        }
    });

    // Handle form submission
    const form = modal.querySelector('#create-sequence-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            // TODO: Implement API call to create sequence
            console.log('Creating sequence:', data);
            modal.classList.remove('active');
        } catch (error) {
            console.error('Error creating sequence:', error);
        }
    });
}

// Filter Leads Modal
function initializeFilterLeadsModal() {
    const modal = document.getElementById('filter-leads-modal');
    const trigger = document.getElementById('filter-leads-btn');
    
    if (!modal || !trigger) return;

    // Create modal content
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Filter Leads</h2>
                <button class="close-modal">&times;</button>
            </div>
            <form id="filter-leads-form">
                <div class="form-group">
                    <label for="filter-date-range">Date Range</label>
                    <select id="filter-date-range">
                        <option value="7">Last 7 days</option>
                        <option value="30" selected>Last 30 days</option>
                        <option value="90">Last 90 days</option>
                        <option value="custom">Custom Range</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="filter-status">Status</label>
                    <select id="filter-status" multiple>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="appointment">Appointment Set</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="filter-source">Source</label>
                    <select id="filter-source" multiple>
                        <option value="facebook">Facebook</option>
                        <option value="google">Google</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="website">Website</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="filter-score">Lead Score</label>
                    <div class="range-inputs">
                        <input type="number" id="filter-score-min" min="0" max="10" placeholder="Min">
                        <input type="number" id="filter-score-max" min="0" max="10" placeholder="Max">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Apply Filters</button>
                    <button type="button" class="btn-secondary" id="reset-filters">Reset</button>
                    <button type="button" class="btn-secondary close-modal">Cancel</button>
                </div>
            </form>
        </div>
    `;

    // Show modal
    trigger.addEventListener('click', () => {
        modal.classList.add('active');
    });

    // Hide modal
    modal.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    });

    // Handle form submission
    const form = modal.querySelector('#filter-leads-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            // TODO: Implement API call to filter leads
            console.log('Filtering leads:', data);
            modal.classList.remove('active');
        } catch (error) {
            console.error('Error filtering leads:', error);
        }
    });

    // Reset filters
    const resetBtn = modal.querySelector('#reset-filters');
    resetBtn.addEventListener('click', () => {
        form.reset();
    });
} 