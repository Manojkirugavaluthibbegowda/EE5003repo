import random
from datetime import datetime

def generate_device_data():
    """
    Generates random electricity consumption data for various household devices.
    
    Each device has a predefined range of possible energy consumption values (in kWh).
    The function generates a random consumption value within this range for each device
    and returns a list of dictionaries containing the device name, consumption value,
    and the timestamp of when the data was generated.
    
    Returns:
        List[dict]: A list of dictionaries with each dictionary containing:
                    - 'device': Name of the device
                    - 'consumption': Randomly generated energy consumption in kWh
                    - 'timestamp': The time when the data was generated
    """
    devices = [
        {"name": "LED Bulb", "min_kwh": 0.001, "max_kwh": 0.005},  # LED Bulb: ~1-5Wh (0.001-0.005 kWh)
        {"name": "Washing Machine", "min_kwh": 0.8, "max_kwh": 1.2},  # Washing Machine: ~0.8-1.2 kWh per cycle
        {"name": "Refrigerator", "min_kwh": 0.1, "max_kwh": 0.2},  # Refrigerator: ~100-200Wh (0.1-0.2 kWh)
        {"name": "Centralized Heater", "min_kwh": 1.5, "max_kwh": 2.5},  # Centralized Heater: ~1.5-2.5 kWh
    ]
    
    data = []
    timestamp = datetime.now().strftime("%H:%M:%S")  # Current time as the timestamp

    for device in devices:
        # Generate a random consumption value within the specified range
        consumption = random.uniform(device["min_kwh"], device["max_kwh"])
        # Append the data for the device, rounded to 3 decimal places
        data.append({
            "device": device["name"],
            "consumption": round(consumption, 3),
            "timestamp": timestamp
        })

    return data
