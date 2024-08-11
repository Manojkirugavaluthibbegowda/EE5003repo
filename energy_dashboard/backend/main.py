from flask import Blueprint, render_template, session, redirect, url_for

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/dashboard')
def dashboard():
    if 'logged_in' not in session:
        return redirect(url_for('auth.login'))
    return render_template('dashboard.html')
