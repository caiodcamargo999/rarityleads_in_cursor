const SUPABASE_URL = 'https://yejheyrdsucgzpzwxuxs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllamhleXJkc3VjZ3pwend4dXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MDg2NzQsImV4cCI6MjA2NDM4NDY3NH0.NzCJ8i3SKpABO6ykWRX3nHDYmjVB82KL1wfgaY3trM4';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getSessionUserId() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = '/auth.html';
    return null;
  }
  return session.user.id;
}

async function fetchAnalyticsData(userId) {
  // Fetch leads
  const { data: leads = [] } = await supabase
    .from('leads')
    .select('id, stage, status, created_at')
    .eq('user_id', userId);

  // Fetch campaigns
  const { data: campaigns = [] } = await supabase
    .from('campaigns')
    .select('id, platform, status, created_at')
    .eq('user_id', userId);

  // Fetch appointments
  const { data: appointments = [] } = await supabase
    .from('appointments')
    .select('id, status, created_at')
    .eq('user_id', userId);

  // Aggregate for charts
  // Overview: qualified leads (status = 'qualified'), appointments scheduled
  const qualifiedLeads = leads.filter(l => l.status === 'qualified').length;
  const appointmentsScheduled = appointments.length;

  // Funnel: count by stage
  const funnelStages = ['Visited', 'Contacted', 'Qualified', 'Booked', 'Closed'];
  const funnelCounts = funnelStages.map(stage => leads.filter(l => l.stage === stage).length);

  // Campaigns: count by platform
  const platforms = ['Google', 'Meta', 'LinkedIn', 'WhatsApp'];
  const campaignCounts = platforms.map(p => campaigns.filter(c => c.platform === p).length);

  // Overview chart: leads per month (last 6 months)
  const months = Array.from({length: 6}, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return d.toLocaleString('default', { month: 'short' });
  });
  const leadsPerMonth = Array(6).fill(0);
  leads.forEach(l => {
    const d = new Date(l.created_at);
    const idx = 5 - (new Date().getMonth() - d.getMonth());
    if (idx >= 0 && idx < 6) leadsPerMonth[idx]++;
  });

  return {
    qualifiedLeads,
    appointmentsScheduled,
    funnelCounts,
    campaignCounts,
    leadsPerMonth,
    months
  };
}

// Tab switching logic
function setActiveTab(tabName) {
  document.querySelectorAll('.analytics-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabName);
    tab.setAttribute('aria-selected', tab.dataset.tab === tabName ? 'true' : 'false');
  });
  document.querySelectorAll('.analytics-section').forEach(section => {
    section.classList.toggle('active', section.id === tabName);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  // Tab switching
  document.querySelectorAll('.analytics-tab').forEach(tab => {
    tab.addEventListener('click', () => setActiveTab(tab.dataset.tab));
  });

  // Auth/session check and fetch data
  const userId = await getSessionUserId();
  if (!userId) return;
  const metrics = await fetchAnalyticsData(userId);

  // Overview Chart
  const overviewCtx = document.getElementById('overview-chart').getContext('2d');
  new Chart(overviewCtx, {
    type: 'line',
    data: {
      labels: metrics.months,
      datasets: [{
        label: 'Qualified Leads',
        data: metrics.leadsPerMonth,
        borderColor: '#D50057',
        backgroundColor: 'rgba(213,0,87,0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#D50057',
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        x: { grid: { color: '#2e2860' }, ticks: { color: '#bdb8e3' } },
        y: { grid: { color: '#2e2860' }, ticks: { color: '#bdb8e3' } }
      }
    }
  });

  // Funnel Chart
  const funnelCtx = document.getElementById('funnel-chart').getContext('2d');
  new Chart(funnelCtx, {
    type: 'bar',
    data: {
      labels: ['Visited', 'Contacted', 'Qualified', 'Booked', 'Closed'],
      datasets: [{
        label: 'Leads',
        data: metrics.funnelCounts,
        backgroundColor: [
          '#D50057', '#9B00C8', '#B044FF', '#5DB5FF', '#0046FF'
        ],
        borderRadius: 8
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { mode: 'nearest', intersect: true }
      },
      scales: {
        x: { grid: { color: '#2e2860' }, ticks: { color: '#bdb8e3' } },
        y: { grid: { color: '#2e2860' }, ticks: { color: '#bdb8e3' } }
      }
    }
  });

  // Campaign Performance Chart
  const campaignCtx = document.getElementById('campaign-chart').getContext('2d');
  new Chart(campaignCtx, {
    type: 'bar',
    data: {
      labels: ['Google', 'Meta', 'LinkedIn', 'WhatsApp'],
      datasets: [{
        label: 'Campaigns',
        data: metrics.campaignCounts,
        backgroundColor: [
          '#D50057', '#9B00C8', '#5DB5FF', '#0046FF'
        ],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        x: { grid: { color: '#2e2860' }, ticks: { color: '#bdb8e3' } },
        y: { grid: { color: '#2e2860' }, ticks: { color: '#bdb8e3' } }
      }
    }
  });
});

// Export analytics as CSV
function exportAnalytics() {
  // Example: export mock metrics
  const rows = [
    ['Metric', 'Value'],
    ['Qualified Leads', 'see dashboard'],
    ['Appointments', 'see dashboard'],
    ['Benchmarked Above Industry', 'Yes']
  ];
  let csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'analytics.csv'; a.click();
  URL.revokeObjectURL(url);
} 