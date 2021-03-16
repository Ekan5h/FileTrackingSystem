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
                'trackingID':crypt.encrypt(x.id),
                'type':x.category,
                'status':'Currently with ' + x.location if x.location else 'File Processed'
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
            office = OfficeEmails.query.filter_by(email=office).first().name
            fl = FileLogs(id, office, 'Passed on' if next_location else 'Approved', remarks)
            f.location = next_location
            db.session.add(fl)
            db.session.commit()
        elif type == 'D':
            id = crypt.decrypt(tag)
            f = Files.query.filter_by(id=id).first()
            office = OfficeEmails.query.filter_by(email=office).first().name
            fl = FileLogs(id, office, 'Denied', remarks)
            f.location = ''
            db.session.add(fl)
            db.session.commit()
        else:
            id = crypt.decrypt(tag)
            f = Files.query.filter_by(id=id).first()
            office = OfficeEmails.query.filter_by(email=office).first().name
            email.sendMail("IMP: Input Required", f.created_by, "Hi there!\nYour file id: {} requires your input at {}.\n\n'{}'".format(tag, office, remarks))
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
                'date':x.time,
                'action':x.outcome + " by " + x.location,
                'remarks':x.remarks
                } for x in fls]
            }
        if (f.location):
            ret['hist'].append({'location':f.location, 'date':datetime.now(), 'action':'Currently with ' + f.location, 'remarks':''})
        return jsonify(ret)
    except Exception as e:
        return jsonify({'error':True, 'msg':str(e)})

@file_ops.route('/fileTransfer', methods=['GET'])
@login_required
def fileTransfer():
    try:
        tag, office, transferee = [request.form[x] for x in ['tag', 'office','transferee']]
        id = crypt.decrypt(tag)
        f = Files.query.filter_by(id=id).first()
        f.created_by = transferee
        f.confirmed = False
        office = OfficeEmails.query.filter_by(email=office).first().name
        fl_by = FileLogs(id, office, 'Transfer', "Ownership transferred by")
        fl_to = FileLogs(id, transferee, 'Transfer', "Ownership transferred to")
        db.session.add(fl_by)
        db.session.add(fl_to)
        db.session.commit()

        return jsonify({"error": False})
    except Exception as e:
        return jsonify({'error': True, 'msg': str(e)})


@file_ops.route('/fileTag', methods=['GET'])
@login_required
def fileTag():
    try:
        tag, office, file_tag = [request.form[x] for x in ['tag', 'office', 'file_tag']]
        id = crypt.decrypt(tag)
        file_tag = Tags(id, file_tag, email)
        db.session.add(file_tag)
        db.session.commit()

        return jsonify({"error": False})
    except Exception as e:
        return jsonify({'error': True, 'msg': str(e)})

@file_ops.route('/fileTagSearch', methods=['GET'])
@login_required
def fileTagSearch():
    try:
        office, file_tag = [request.form[x] for x in ['office', 'file_tag']]
        fs = Tags.query.filter(Tags.email==current_user.login_email, Tags.tag == file_tag).all()

        for x in fs:
            f = Files.query.filter_by(id=x.file_id).first()
            ret.append(
                {
                    'name': f.name,
                    'tag': x.file_tag,
                    'trackingID': crypt.encrypt(f.id),
                    'type': f.category,
                    'status':'Currently with ' + f.location if f.location else 'File Processed'
                }
            )

        return jsonify(ret)
    except Exception as e:
        return jsonify({'error': True, 'msg': str(e)})