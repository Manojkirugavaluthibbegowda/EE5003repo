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

function updateChart(chart, data, deviceName, viewLabel, dynamicMax, isTimeSeries, chartType) {
    if (isTimeSeries) {
        // Handle the time series data for Current Consumption
        const timestamps = data.map(entry => entry.timestamp);
        const consumptions = data.map(entry => entry.consumption);
        chart.data.labels = timestamps;
        chart.data.datasets[0].data = consumptions;

        // Display the current value in the label
        const currentValue = consumptions[consumptions.length - 1];
        chart.data.datasets[0].label = `${deviceName} Energy Consumption (${currentValue} kWh)`;

        // Adjust y-axis dynamically
        const maxYValue = Math.max(...consumptions);
        chart.options.scales.y.max = dynamicMax ? maxYValue * 1.1 : chart.originalMax;
    } else {
        // Handle single value data for Average/Total Consumption
        chart.data.labels = [deviceName + " (" + viewLabel + ")"];
        chart.data.datasets[0].data = [data[deviceName]];
        chart.data.datasets[0].label = `${deviceName} Energy Consumption (kWh)`;

        // Dynamically adjust the y-axis in Total Consumption
        if (dynamicMax) {
            const maxYValue = data[deviceName];
            chart.options.scales.y.max = maxYValue * 1.1;  // Add 10% buffer
        } else {
            chart.options.scales.y.max = chart.originalMax;  // Reset to original max value
        }
    }

    // Update the chart type
    if (chart.config.type !== chartType) {
        chart.config.type = chartType;
        chart.update();  // Re-render the chart when type changes
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
    const isTimeSeries = view === "0";  // Show time series only for "Current Consumption"
    const chartType = view === "0" ? 'line' : 'bar';  // Line chart for Current, Bar chart for Average/Total

    updateChart(charts.ledBulbChart, isTimeSeries ? data["LED Bulb"] : data, "LED Bulb", viewLabel, dynamicMax, isTimeSeries, chartType);
    updateChart(charts.washingMachineChart, isTimeSeries ? data["Washing Machine"] : data, "Washing Machine", viewLabel, dynamicMax, isTimeSeries, chartType);
    updateChart(charts.refrigeratorChart, isTimeSeries ? data["Refrigerator"] : data, "Refrigerator", viewLabel, dynamicMax, isTimeSeries, chartType);
    updateChart(charts.centralizedHeaterChart, isTimeSeries ? data["Centralized Heater"] : data, "Centralized Heater", viewLabel, dynamicMax, isTimeSeries, chartType);
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
            type: 'line',  // Start with line chart for Current Consumption
            data: {
                labels: [],
                datasets: [{
                    label: 'Energy Consumption (kWh)',
                    data: [],
                    fill: false,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',  // For bar chart
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 0.005  // Set max according to expected LED Bulb consumption
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    }
                }
            }
        }),
        washingMachineChart: new Chart(ctxs.washingMachineChart, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Energy Consumption (kWh)',
                    data: [],
                    fill: false,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',  // For bar chart
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 2.0  // Set max according to expected Washing Machine consumption
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    }
                }
            }
        }),
        refrigeratorChart: new Chart(ctxs.refrigeratorChart, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Energy Consumption (kWh)',
                    data: [],
                    fill: false,
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',  // For bar chart
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 0.3  // Set max according to expected Refrigerator consumption
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    }
                }
            }
        }),
        centralizedHeaterChart: new Chart(ctxs.centralizedHeaterChart, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Energy Consumption (kWh)',
                    data: [],
                    fill: false,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',  // For bar chart
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 5.0  // Set max according to expected Centralized Heater consumption
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Time'
                        }
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
