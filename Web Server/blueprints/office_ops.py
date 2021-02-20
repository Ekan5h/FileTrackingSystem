from flask import Flask, render_template , request , jsonify, Blueprint, redirect, session
from flask_login import current_user, logout_user, login_required
from datetime import datetime, timedelta
from random import random
from models import *

office_ops = Blueprint('office_ops', __name__, template_folder='templates')

@office_ops.route('/admin', methods=['GET', 'POST'])
def login_institution():
    if request.method == 'POST':
        email = request.form['email']
        obj = Institutions.query.filter(Institutions.login_email == email).first()

        try:
            if obj:
                session['name'] = obj.name
                return redirect("addEmail")  
            else:
                return redirect("adminSignup")
        except Exception as e:
            return jsonify({'error':True, 'msg':str(e)})

    return render_template("admin.jinja2") 

@office_ops.route('/adminSignup', methods=['GET', 'POST'])
def signup_institution():
    if request.method == 'POST':
        email = request.form['email']
        name = request.form['name']

        try:
            obj = Institutions(email, name)
            db.session.add(obj)
            db.session.commit()

            return redirect('admin')
        except Exception as e:
            return jsonify({'error':True, 'msg':str(e)})

    return render_template("admin_signup.jinja2")

@office_ops.route('/addEmail' , methods=['GET', 'POST'])
def addEmail():
    try:
        if request.method == "POST":
            email = request.form['email']
            name = request.form['name']

            if len(session['name']) == 0:
                return render_template('admin.jinja2')

            if len(name) and len(email):
                institution = session['name']
                office_obj = OficeEmails(email, name, institution)
                db.session.add(office_obj)
                db.session.commit()
                return jsonify({'error':False})
            else:
                return jsonify({'error':True, 'msg':'Enter a name!'})
    except Exception as e:
        return jsonify({'error':True, 'msg':str(e) + session['name']})

    return render_template("addEmail.jinja2")