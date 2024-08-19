async function fetchData() {
    const response = await fetch('/data');
    const data = await response.json();
    return data;
}

async function fetchAverages() {
    const response = await fetch('/averages');
    const averages = await response.json();
    return averages;
}

async function fetchTotals() {
    const response = await fetch('/totals');
    const totals = await response.json();
    return totals;
}

function updateChart(chart, data, deviceName, viewLabel) {
    chart.data.labels = [deviceName + " (" + viewLabel + ")"];
    chart.data.datasets[0].data = [data[deviceName]];
    chart.update();
}

function getSelectedView() {
    const selectedRadio = document.querySelector('.switch-container input[type="radio"]:checked');
    return selectedRadio.value;
}

async function updateData(charts) {
    const view = getSelectedView();
    let data;
    let viewLabel;

    if (view === "0") {
        data = await fetchData();
        viewLabel = "Current Consumption";
    } else if (view === "1") {
        data = await fetchAverages();
        viewLabel = "Average Consumption";
    } else if (view === "2") {
        data = await fetchTotals();
        viewLabel = "Total Consumption";
    }

    updateChart(charts.ledBulbChart, data, "LED Bulb", viewLabel);
    updateChart(charts.washingMachineChart, data, "Washing Machine", viewLabel);
    updateChart(charts.refrigeratorChart, data, "Refrigerator", viewLabel);
    updateChart(charts.centralizedHeaterChart, data, "Centralized Heater", viewLabel);
}

window.onload = async function() {
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

    // Update data every 5 seconds, regardless of the selected view
    setInterval(() => {
        updateData(charts);
    }, 1000);

    // Update data immediately when a radio button is changed
    const viewRadios = document.querySelectorAll('.switch-container input[type="radio"]');
    viewRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            updateData(charts);
        });
    });

    // Load initial data
    updateData(charts);
}
