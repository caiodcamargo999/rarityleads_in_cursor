// Initialize all dashboard charts
export function initializeCharts() {
    initializeFunnelChart();
    initializeCampaignChart();
}

// Funnel Chart
function initializeFunnelChart() {
    const ctx = document.getElementById('funnelChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Impressions', 'Clicks', 'Leads', 'Qualified', 'Appointments', 'Closed'],
            datasets: [{
                label: 'Acquisition Funnel',
                data: [1000, 500, 100, 50, 25, 10],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.2)',
                    'rgba(99, 102, 241, 0.3)',
                    'rgba(99, 102, 241, 0.4)',
                    'rgba(99, 102, 241, 0.5)',
                    'rgba(99, 102, 241, 0.6)',
                    'rgba(99, 102, 241, 0.7)'
                ],
                borderColor: [
                    'rgba(99, 102, 241, 1)',
                    'rgba(99, 102, 241, 1)',
                    'rgba(99, 102, 241, 1)',
                    'rgba(99, 102, 241, 1)',
                    'rgba(99, 102, 241, 1)',
                    'rgba(99, 102, 241, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const total = context.dataset.data[0];
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${value} (${percentage}%)`;
                        }
                    }
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
                        display: false
                    },
                    ticks: {
                        color: '#94A3B8'
                    }
                }
            }
        }
    });
}

// Campaign Performance Chart
function initializeCampaignChart() {
    const ctx = document.getElementById('campaignChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Leads',
                    data: [12, 19, 15, 17, 22, 25, 20],
                    borderColor: 'rgba(99, 102, 241, 1)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Conversions',
                    data: [5, 8, 6, 7, 9, 10, 8],
                    borderColor: 'rgba(16, 185, 129, 1)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#94A3B8'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
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
                        display: false
                    },
                    ticks: {
                        color: '#94A3B8'
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// Update chart data
export function updateChartData(chartId, newData) {
    const chart = Chart.getChart(chartId);
    if (!chart) return;

    chart.data.datasets.forEach((dataset, index) => {
        dataset.data = newData[index];
    });
    chart.update();
}

// Update funnel period
export function updateFunnelPeriod(days) {
    // Fetch new data for the selected period
    fetchFunnelData(days).then(data => {
        updateChartData('funnelChart', [data]);
    });
}

// Fetch funnel data from API
async function fetchFunnelData(days) {
    // TODO: Implement API call to fetch funnel data
    return [1000, 500, 100, 50, 25, 10]; // Placeholder data
} 