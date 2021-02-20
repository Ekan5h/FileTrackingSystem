from flask import Flask, render_template , request , jsonify
from flask_login import LoginManager, login_required, logout_user, current_user
from models import *

from blueprints.auth import auth
from blueprints.scan import scan
from blueprints.user_ops import user_ops
from blueprints.office_ops import office_ops


app = Flask(__name__)
app.register_blueprint(auth)
app.register_blueprint(scan)
app.register_blueprint(user_ops)
app.register_blueprint(office_ops)

app.secret_key = b'\n\x7f&J\xae\xce&\xea\x05e\xdb\x7f\xd3\xbc\x1a6'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sqlite3.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(token):
    return Users.query.filter_by(token=token).first()

@app.route('/home')
def home():
	return render_template('index.jinja2')

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

if __name__ == '__main__':
	app.run(debug = True, host='0.0.0.0')