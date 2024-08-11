from flask import Flask
import sqlite3
from auth import auth as auth_blueprint
from main import main as main_blueprint

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Needed for session management

def init_db():
    conn = sqlite3.connect('energy_data.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (username TEXT, email TEXT, password TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS energy_usage
                 (device_id TEXT, energy_usage REAL, timestamp REAL)''')
    conn.commit()
    conn.close()

app.register_blueprint(auth_blueprint)
app.register_blueprint(main_blueprint)

@app.route('/api/energy_data', methods=['POST'])
def receive_data():
    data = request.json
    conn = sqlite3.connect('energy_data.db')
    c = conn.cursor()
    c.execute("INSERT INTO energy_usage (device_id, energy_usage, timestamp) VALUES (?, ?, ?)",
              (data['device_id'], data['energy_usage'], data['timestamp']))
    conn.commit()
    conn.close()
    return jsonify({"status": "success"}), 201

@app.route('/api/energy_data', methods=['GET'])
def get_data():
    conn = sqlite3.connect('energy_data.db')
    c = conn.cursor()
    c.execute("SELECT * FROM energy_usage")
    data = c.fetchall()
    conn.close()
    return jsonify(data), 200

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)
