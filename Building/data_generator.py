import random
from datetime import datetime

def generate_device_data():
    devices = [
        {"name": "LED Bulb", "min_kwh": 0.001, "max_kwh": 0.005},  # ~1-5Wh (0.001-0.005 kWh)
        {"name": "Washing Machine", "min_kwh": 0.8, "max_kwh": 1.2},  # ~1.0 kWh per cycle
        {"name": "Refrigerator", "min_kwh": 0.1, "max_kwh": 0.2},  # ~100-200Wh (0.1-0.2 kWh)
        {"name": "Centralized Heater", "min_kwh": 1.5, "max_kwh": 2.5},  # ~1.5-2.5 kWh
    ]
    data = []

    timestamp = datetime.now().strftime("%H:%M:%S")  # Time as the x-axis label

    for device in devices:
        consumption = random.uniform(device["min_kwh"], device["max_kwh"])  # Consumption in kWh
        data.append({
            "device": device["name"],
            "consumption": round(consumption, 3),
            "timestamp": timestamp
        })

    return data
