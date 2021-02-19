from flask import Flask, render_template , request , jsonify, Blueprint
from flask_login import current_user, logout_user, login_required
from datetime import datetime, timedelta
from random import random
from models import *

user_ops = Blueprint('user_ops', __name__, template_folder='templates')

@user_ops.route('/setName' , methods=['POST'])
@login_required
def setName():
    try:
        name = request.form['name']
        if len(name):
            current_user.name = name
            db.session.commit()
            return jsonify({'error':False})
        else:
            return jsonify({'error':True, 'msg':'Enter a name!'})
    except Exception as e:
        return jsonify({'error':True, 'msg':str(e)})
    return "AddEmail"


@user_ops.route('/amiloggedin')
def amiloggedin():
    return jsonify({'logged':current_user.is_authenticated})

@user_ops.route('/logout')
@login_required
def logout():
    logout_user()
    return 'Successful'
