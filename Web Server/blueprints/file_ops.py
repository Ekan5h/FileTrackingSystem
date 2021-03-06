from flask import Flask, render_template , request , jsonify, Blueprint
from flask_login import login_required, current_user
from datetime import datetime, timedelta
from modules.crypt import crypt
from random import random
from models import *
from modules.pHashDB.ocr import search_tree
import modules.email_client.email as email

file_ops = Blueprint('file_ops', __name__, template_folder='templates')

@file_ops.route('/createFile' , methods=['POST'])
@login_required
def createFile():
    try:
        name, type, submitted_to = [request.form[x] for x in ['name', 'type', 'submitted_to']]
        new_file = Files(name, current_user.login_email, type, submitted_to)
        db.session.add(new_file)
        db.session.commit()
        tag = crypt.encrypt(new_file.id)
        search_tree.add(tag)
        return jsonify({'tag':tag})
    except Exception as e:
        return jsonify({'error':True, 'msg':str(e)})


@file_ops.route('/confirmFile' , methods=['POST'])
@login_required
def confirmFile():
    try:
        f = Files.query.filter_by(id=crypt.decrypt(request.form['tag'])).first()
        f.confirmed = True
        db.session.commit()
        return jsonify({'error':False})
    except:
        return jsonify({'error':True})

@file_ops.route('/showFiles', methods=['GET'])
@login_required
def showFiles():
    try:
        fs = Files.query.filter(Files.created_by==current_user.login_email, Files.confirmed).all()
        ret = [{'name':x.name, 
                'tag':crypt.encrypt(x.id),
                'type':x.category,
                'location':x.location
                } for x in fs]
        return jsonify(ret)
    except:
        return jsonify({'error':True})

@file_ops.route('/updateFile', methods=['POST'])
@login_required
def updateFile():
    try:
        tag, type, office, next_location, remarks = [request.form[x] for x in ['tag','type', 'office','next','remarks']]
        if type == 'A':
            id = crypt.decrypt(tag)
            f = Files.query.filter_by(id=id).first()
            fl = FileLogs(id, office, 'Transit' if next_location else 'Final-A', remarks)
            f.location = next_location
            db.session.add(fl)
            db.session.commit()
        elif type == 'D':
            id = crypt.decrypt(tag)
            f = Files.query.filter_by(id=id)
            fl = FileLogs(id, office, 'Final-D', remarks)
            f.location = ''
            db.session.add(fl)
            db.session.commit()
        else:
            id = crypt.decrypt(tag)
            f = Files.query.filter_by(id=id)
            email.sendMail("IMP: Input Required", f.created_by, "Hi there!\nYour file id: {} requires your input at {}.".format(tag, office))
        return jsonify({'error':False})
    except:
        return jsonify({'error':True})

@file_ops.route('/fileHistory', methods=['GET'])
@login_required
def fileHistory():
    try:
        tag = request.args['tag']
        id = crypt.decrypt(tag)
        f = Files.query.filter_by(id=id).first()
        fls = FileLogs.query.filter_by(file_id=id).all()
        ret = { 'name':f.name,
                'hist': [{'location':x.location, 
                'time':x.time,
                'type':x.outcome,
                'remarks':x.remarks
                } for x in fls]
            }
        if (f.location):
            ret['hist'].append({'location':f.location, 'time':datetime.now(), 'type':'Current'})
        return jsonify(ret)
    except Exception as e:
        return jsonify({'error':True, 'msg':str(e)})
