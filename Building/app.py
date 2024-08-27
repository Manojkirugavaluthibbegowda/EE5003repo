import os
import json
from flask import Flask, jsonify, render_template
from flask_cors import CORS
import data_generator

app = Flask(__name__)
CORS(app)

# File to persist data
DATA_FILE = 'energy_data.json'

# In-memory storage for historical data and total consumption
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

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as file:
            data = json.load(file)
            return data.get('historical_data', {}), data.get('total_consumption', {})
    return historical_data, total_consumption

def save_data():
    with open(DATA_FILE, 'w') as file:
        json.dump({
            'historical_data': historical_data,
            'total_consumption': total_consumption
        }, file)

def update_historical_data(new_data):
    for entry in new_data:
        device = entry['device']
        consumption = entry['consumption']
        timestamp = entry['timestamp']
        historical_data[device].append({"consumption": consumption, "timestamp": timestamp})
        total_consumption[device] += consumption  # Accumulate the total consumption
        if len(historical_data[device]) > 10:  # Limit history to last 10 entries for simplicity
            historical_data[device].pop(0)
    save_data()  # Save data after each update

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
    # Load data from the file when the server starts
    historical_data, total_consumption = load_data()
    app.run(debug=True)
