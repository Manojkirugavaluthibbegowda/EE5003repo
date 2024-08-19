async function fetchData(view) {
    if (view === "0") {
        const response = await fetch('/data');
        return await response.json();
    } else if (view === "1") {
        const response = await fetch('/averages');
        return await response.json();
    } else if (view === "2") {
        const response = await fetch('/totals');
        return await response.json();
    }
}

function updateChart(chart, data, deviceName, viewLabel, dynamicMax) {
    chart.data.labels = [deviceName + " (" + viewLabel + ")"];
    chart.data.datasets[0].data = [data[deviceName]];

    if (dynamicMax) {
        const currentValue = data[deviceName];
        chart.options.scales.y.max = currentValue * 1.1; // Adjust dynamically with a buffer
    } else {
        chart.options.scales.y.max = chart.originalMax; // Reset to original max value
    }

    chart.update();
}

function getSelectedView() {
    return document.querySelector('.switch-container input[type="radio"]:checked').value;
}

async function updateData(charts, view) {
    const data = await fetchData(view);
    const viewLabel = view === "0" ? "Current Consumption" : view === "1" ? "Average Consumption" : "Total Consumption";
    const dynamicMax = view === "2";  // Only enable dynamic max for "Total Consumption"

    updateChart(charts.ledBulbChart, data, "LED Bulb", viewLabel, dynamicMax);
    updateChart(charts.washingMachineChart, data, "Washing Machine", viewLabel, dynamicMax);
    updateChart(charts.refrigeratorChart, data, "Refrigerator", viewLabel, dynamicMax);
    updateChart(charts.centralizedHeaterChart, data, "Centralized Heater", viewLabel, dynamicMax);
}

window.onload = function() {
    const ctxs = {
        ledBulbChart: document.getElementById('ledBulbChart').getContext('2d'),
        washingMachineChart: document.getElementById('washingMachineChart').getContext('2d'),
        refrigeratorChart: document.getElementById('refrigeratorChart').getContext('2d'),
        centralizedHeaterChart: document.getElementById('centralizedHeaterChart').getContext('2d'),
    };

    const charts = {
        ledBulbChart: new Chart(ctxs.ledBulbChart, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Energy Consumption (kWh)',
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 0.005  // Set max according to expected LED Bulb consumption
                    }
                }
            }
        }),
        washingMachineChart: new Chart(ctxs.washingMachineChart, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Energy Consumption (kWh)',
                    data: [],
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 2.0  // Set max according to expected Washing Machine consumption
                    }
                }
            }
        }),
        refrigeratorChart: new Chart(ctxs.refrigeratorChart, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Energy Consumption (kWh)',
                    data: [],
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 0.3  // Set max according to expected Refrigerator consumption
                    }
                }
            }
        }),
        centralizedHeaterChart: new Chart(ctxs.centralizedHeaterChart, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Energy Consumption (kWh)',
                    data: [],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 5.0  // Set max according to expected Centralized Heater consumption
                    }
                }
            }
        }),
    };

    // Store original max values for each chart
    charts.ledBulbChart.originalMax = charts.ledBulbChart.options.scales.y.max;
    charts.washingMachineChart.originalMax = charts.washingMachineChart.options.scales.y.max;
    charts.refrigeratorChart.originalMax = charts.refrigeratorChart.options.scales.y.max;
    charts.centralizedHeaterChart.originalMax = charts.centralizedHeaterChart.options.scales.y.max;

    // Initial view set to "Current Consumption"
    let currentView = "0";

    // Continuously update data based on selected view
    setInterval(() => {
        updateData(charts, currentView);
    }, 1000);

    // Update data when the view is changed via radio buttons
    document.querySelectorAll('.switch-container input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', () => {
            currentView = getSelectedView();
            updateData(charts, currentView);
        });
    });

    // Initial data load
    updateData(charts, currentView);
}
