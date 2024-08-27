# EE5003repo 
This is the GitHub repository page for Master's project EE5003 of student 'Manoj Kirugavalu Thibbegowda' with student Id '23269080' .

# Title : Energy Usage Dashboard

# Project Overview :

The Energy Usage Dashboard is a web-based application that monitors and displays real-time electricity consumption for various household devices. The application provides insights into energy usage patterns and offers recommendations to optimize consumption. The dashboard includes charts for devices such as LED Bulbs, Washing Machines, Refrigerators, and Centralized Heaters, with options to view current, average, and total energy consumption.

1. Installation :
    Follow the steps below to set up and run the Energy Usage Dashboard on your local machine.

2. Prerequisites :
    Ensure you have the following installed on your system:

      - Python 3.7+: The application is built using Python, so you need Python installed on your machine.
      - pip: Python's package installer is required to install the necessary dependencies.

3. Clone the Repository :
    Start by cloning the repository from GitHub to your local machine:
       - [https://github.com/Manojkirugavaluthibbegowda/EE5003repo.git]

5. Create a Virtual Environment :
    It's recommended to create a virtual environment to isolate the project dependencies. You can create and           activate a virtual environment using the following commands:

    # Create a virtual environment
      - python -m venv venv

        # Activate the virtual environment (on Windows)
          - venv\Scripts\activate

        # Activate the virtual environment (on macOS/Linux)
          - source venv/bin/activate
              
6. Install Dependencies :
    Once the virtual environment is activated, install the required Python packages:
   
    - pip install -r requirements.txt
  
7. Run the Application :
    After installing the dependencies, you can start the Flask server to run the application:
   
    - python3 app.py
  
8. Access the Dashboard
    Open your web browser and go to http://127.0.0.1:5000/ to access the Energy Usage Dashboard.



# Data Persistence :
The application saves energy consumption data to a json file named 'energy_data.json' . This file ensures that the data is persisted across server restarts.

# Generating New Data :
The application generates random energy consumption data for each device. This data is continuously updated and displayed on the dashboard, providing a real-time view of energy usage.
