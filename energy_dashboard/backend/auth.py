from flask import Blueprint, render_template, request, redirect, url_for, session
import sqlite3

auth = Blueprint('auth', __name__)

db_path = 'energy_data.db'

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        conn = sqlite3.connect(db_path)
        c = conn.cursor()
        c.execute("SELECT * FROM users WHERE username=? AND password=?", (username, password))
        user = c.fetchone()
        conn.close()
        if user:
            session['logged_in'] = True
            return redirect(url_for('main.dashboard'))
        else:
            return "Invalid credentials"
    return render_template('login.html')

@auth.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        conn = sqlite3.connect(db_path)
        c = conn.cursor()
        c.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                  (username, email, password))
        conn.commit()
        conn.close()
        return redirect(url_for('auth.login'))
    return render_template('register.html')

@auth.route('/forgot_password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        email = request.form['email']
        # Handle the forgot password logic here (e.g., send a reset link)
        return "A password reset link has been sent to your email."
    return render_template('forgot_password.html')

@auth.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('auth.login'))
