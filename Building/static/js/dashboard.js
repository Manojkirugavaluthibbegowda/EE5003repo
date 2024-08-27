// Maximum consumption limits for each device in kWh
const deviceLimits = {
    "LED Bulb": 0.005,  // Limit for LED Bulb
    "Washing Machine": 1.2,  // Limit for Washing Machine
    "Refrigerator": 0.2,  // Limit for Refrigerator
    "Centralized Heater": 2.5  // Limit for Centralized Heater
};

// Function to generate recommendations based on consumption
// Provides energy-saving tips tailored to the specific device
function generateRecommendations(deviceName, currentValue) {
    const recommendations = [];

    if (deviceName === "Centralized Heater") {
        recommendations.push("Consider lowering the thermostat a few degrees to save energy.");
        recommendations.push("Ensure windows and doors are properly sealed to prevent heat loss.");
    } else if (deviceName === "Washing Machine") {
        recommendations.push("Try using cold water settings to reduce energy consumption.");
        recommendations.push("Wash full loads to maximize efficiency.");
    } else if (deviceName === "Refrigerator") {
        recommendations.push("Check the door seals to ensure they're tight.");
        recommendations.push("Avoid placing hot food directly into the refrigerator.");
    } else if (deviceName === "LED Bulb") {
        recommendations.push("Turn off lights when not in use.");
        recommendations.push("Consider using natural light during the day.");
    }

    // Add a recommendation if the usage is close to the device's maximum limit
    if (currentValue >= 0.9 * deviceLimits[deviceName]) {
        recommendations.push("Your usage is approaching the maximum capacity. Consider reducing usage.");
    }

    return recommendations;
}

// Function to check for overconsumption and generate recommendations
// Triggers an alert if the consumption exceeds 90% of the device's maximum limit
function checkOverconsumption(deviceName, currentValue, timestamp) {
    const limit = deviceLimits[deviceName];
    if (currentValue >= 0.9 * limit) {
        const recommendations = generateRecommendations(deviceName, currentValue);
        showAlert(deviceName, currentValue, timestamp, recommendations);
    }
}

// Function to display an alert with recommendations
// Creates and displays an alert box with device details and energy-saving tips
function showAlert(deviceName, currentValue, timestamp, recommendations) {
    const alertBox = document.createElement('div');
    alertBox.classList.add('alert-box');
    alertBox.innerHTML = `
        <strong>Overconsumption Alert!</strong>
        <p>Device: ${deviceName}</p>
        <p>Consumption: ${currentValue} kWh</p>
        <p>Time: ${timestamp}</p>
        <strong>Recommendations:</strong>
        <ul>
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
    `;
    document.body.appendChild(alertBox);

    // Automatically remove the alert after 10 seconds
    setTimeout(() => {
        alertBox.remove();
    }, 10000);
}

// Function to update the chart with new data
// Updates the chart with the latest energy consumption data and handles overconsumption checks
function updateChart(chart, data, deviceName, viewLabel, dynamicMax, isTimeSeries, chartType) {
    if (isTimeSeries) {
        // Handle the time series data for Current Consumption
        const timestamps = data.map(entry => entry.timestamp);
        const consumptions = data.map(entry => entry.consumption);
        chart.data.labels = timestamps;
        chart.data.datasets[0].data = consumptions;

        // Display the current value in the label
        const currentValue = consumptions[consumptions.length - 1];
        const currentTimestamp = timestamps[timestamps.length - 1];
        chart.data.datasets[0].label = `${deviceName} Energy Consumption (${currentValue} kWh)`;

        // Check for overconsumption and generate recommendations
        checkOverconsumption(deviceName, currentValue, currentTimestamp);

        // Adjust y-axis dynamically based on data
        const maxYValue = Math.max(...consumptions);
        chart.options.scales.y.max = dynamicMax ? maxYValue * 1.1 : chart.originalMax;
    } else {
        // Handle single value data for Average/Total Consumption
        chart.data.labels = [deviceName + " (" + viewLabel + ")"];
        chart.data.datasets[0].data = [data[deviceName]];
        chart.data.datasets[0].label = `${deviceName} Energy Consumption (kWh)`;

        // Dynamically adjust the y-axis in Total Consumption view
        if (dynamicMax) {
            const maxYValue = data[deviceName];
            chart.options.scales.y.max = maxYValue * 1.1;  // Add 10% buffer
        } else {
            chart.options.scales.y.max = chart.originalMax;  // Reset to original max value
        }
    }

    // Update the chart type if it has changed
    if (chart.config.type !== chartType) {
        chart.config.type = chartType;
        chart.update();  // Re-render the chart when type changes
    }

    chart.update();
}

// Function to get the selected view (Current, Average, or Total Consumption)
// Determines which view the user has selected via radio buttons
function getSelectedView() {
    return document.querySelector('.switch-container input[type="radio"]:checked').value;
}

// Function to fetch and update the data for the charts
// Fetches data from the server based on the selected view and updates the corresponding charts
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

// Function to fetch the data from the server
// Requests data from the server depending on the selected view (Current, Average, or Total Consumption)
async function fetchData(view) {
    let url = '';
    if (view === "0") {
        url = '/data';
    } else if (view === "1") {
        url = '/averages';
    } else if (view === "2") {
        url = '/totals';
    }

    const response = await fetch(url);
    return await response.json();
}

// Initialize the charts and set up periodic data updates
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
                        max: 0.006  // Set max according to expected LED Bulb consumption
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

    // Continuously update data based on the selected view
    setInterval(() => {
        updateData(charts, currentView);
    }, 5000);

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
