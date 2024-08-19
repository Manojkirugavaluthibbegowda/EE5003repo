from flask import Flask, jsonify, render_template
from flask_cors import CORS
import data_generator

app = Flask(__name__)
CORS(app)

# In-memory storage for historical data
historical_data = {
    "LED Bulb": [],
    "Washing Machine": [],
    "Refrigerator": [],
    "Centralized Heater": []
}

total_consumption = {
    "LED Bulb": 0,
    "Washing Machine": 0,
    "Refrigerator": 0,
    "Centralized Heater": 0
}

def update_historical_data(new_data):
    for entry in new_data:
        device = entry['device']
        consumption = entry['consumption']
        timestamp = entry['timestamp']
        historical_data[device].append({"consumption": consumption, "timestamp": timestamp})
        total_consumption[device] += consumption  # Accumulate the total consumption
        if len(historical_data[device]) > 10:  # Limit history to last 10 entries for simplicity
            historical_data[device].pop(0)

def calculate_averages():
    averages = {}
    for device, entries in historical_data.items():
        if entries:
            total_consumption = sum(entry['consumption'] for entry in entries)
            averages[device] = round(total_consumption / len(entries), 3)
        else:
            averages[device] = 0
    return averages

def calculate_totals():
    # Simply return the accumulated total consumption
    return total_consumption

@app.route('/data')
def get_data():
    new_data = data_generator.generate_device_data()
    update_historical_data(new_data)
    return jsonify(historical_data)

@app.route('/averages')
def get_averages():
    averages = calculate_averages()
    return jsonify(averages)

@app.route('/totals')
def get_totals():
    totals = calculate_totals()
    return jsonify(totals)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
