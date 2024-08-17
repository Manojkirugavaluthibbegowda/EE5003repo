import random
import time
from datetime import datetime

def generate_device_data():
    devices = ["LED Bulb", "Washing Machine", "Refrigerator"]
    data = []

    for device in devices:
        consumption = random.uniform(5, 200)  # Random consumption between 5W and 200W
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        data.append({
            "device": device,
            "consumption": round(consumption, 2),
            "timestamp": timestamp
        })

    return data
