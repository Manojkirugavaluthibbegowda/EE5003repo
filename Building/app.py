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

def update_historical_data(new_data):
    for entry in new_data:
        device = entry['device']
        consumption = entry['consumption']
        historical_data[device].append(consumption)

def calculate_averages():
    averages = {}
    for device, consumptions in historical_data.items():
        if consumptions:
            averages[device] = round(sum(consumptions) / len(consumptions), 3)
        else:
            averages[device] = 0
    return averages

def calculate_totals():
    totals = {}
    for device, consumptions in historical_data.items():
        totals[device] = round(sum(consumptions), 3)
    return totals

@app.route('/data')
def get_data():
    new_data = data_generator.generate_device_data()
    update_historical_data(new_data)
    return jsonify({d['device']: d['consumption'] for d in new_data})

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
