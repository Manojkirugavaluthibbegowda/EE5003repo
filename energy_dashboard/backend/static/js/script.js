document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/energy_data')
        .then(response => response.json())
        .then(data => {
            const labels = data.map(entry => new Date(entry[2] * 1000).toLocaleTimeString());
            const values = data.map(entry => entry[1]);
            
            // Line Chart
            const lineCtx = document.getElementById('energyLineChart').getContext('2d');
            new Chart(lineCtx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Energy Usage (Watts)',
                        data: values,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'minute'
                            }
                        },
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Bar Chart
            const barCtx = document.getElementById('energyBarChart').getContext('2d');
            new Chart(barCtx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Energy Usage (Watts)',
                        data: values,
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
        });
});
