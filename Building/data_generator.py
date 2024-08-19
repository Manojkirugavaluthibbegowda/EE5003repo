import random
from datetime import datetime

def generate_device_data():
    devices = [
        {"name": "LED Bulb", "min_kwh": 0.001, "max_kwh": 0.005},  # ~1-5Wh (0.001-0.005 kWh)
        {"name": "Washing Machine", "min_kwh": 0.3, "max_kwh": 2.0},  # ~0.3-2.0 kWh per cycle
        {"name": "Refrigerator", "min_kwh": 0.1, "max_kwh": 0.3},  # ~100-300Wh (0.1-0.3 kWh)
        {"name": "Centralized Heater", "min_kwh": 1.0, "max_kwh": 5.0},  # ~1.0-5.0 kWh
    ]
    data = []

    for device in devices:
        consumption = random.uniform(device["min_kwh"], device["max_kwh"])  # Consumption in kWh
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        data.append({
            "device": device["name"],
            "consumption": round(consumption, 3),  # Rounded to three decimal places
            "timestamp": timestamp
        })

    return data
