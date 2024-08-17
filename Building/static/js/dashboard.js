async function fetchData() {
    const response = await fetch('/data');
    const data = await response.json();
    return data;
}

function updateChart(chart, data) {
    const labels = data.map(d => d.device + " (" + d.timestamp + ")");
    const consumption = data.map(d => d.consumption);

    chart.data.labels = labels;
    chart.data.datasets[0].data = consumption;
    chart.update();
}

window.onload = async function() {
    const ctx = document.getElementById('energyChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Energy Consumption (W)',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    setInterval(async () => {
        const data = await fetchData();
        updateChart(chart, data);
    }, 5000); // Update every 5 seconds
}
