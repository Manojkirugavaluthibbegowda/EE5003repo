from flask import Flask, jsonify, render_template
from flask_cors import CORS
import data_generator
import time

app = Flask(__name__)
CORS(app)

@app.route('/data')
def get_data():
    data = data_generator.generate_device_data()
    return jsonify(data)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
