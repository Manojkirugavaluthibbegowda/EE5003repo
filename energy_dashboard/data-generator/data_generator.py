import random
import time
import requests

def generate_energy_data(device_id):
    energy_usage = round(random.uniform(50, 500), 2)
    timestamp = time.time()
    data = {
        'device_id': device_id,
        'energy_usage': energy_usage ,
        'timestamp': timestamp
    }
    return data

def send_data_to_server(data):
    url = 'http://localhost:5000/api/energy_data'
    response = requests.post(url, json=data)
    return response.status_code

if __name__ == "__main__":
    device_ids = ['device_1', 'device_2', 'device_3']
    while True:
        for device_id in device_ids:
            data = generate_energy_data(device_id)
            status = send_data_to_server(data)
            print(f"Sent data: {data}, Status: {status}")
        time.sleep(5)
