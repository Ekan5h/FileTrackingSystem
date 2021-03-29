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
        if 'transfer_to' in request.form.keys():
            newTransferRequest = TransferRequest(new_file.id, name, current_user.login_email, request.form['transfer_to'])
            db.session.add(newTransferRequest)
            db.session.commit()
        return jsonify({'tag':tag})
    except Exception as e:
        return jsonify({'error':True, 'msg':str(e)})


@file_ops.route('/confirmTransfer', methods=['POST'])
@login_required
def confirmeTransfer():
    try:
        t_id = request.form['t_id']
        tranfer = TransferRequest.filter_by(id=t_id).first()
        f = Files.filter_by(id=transfer.file_id)
        f.created_by = tranfer.to_id
        log = FileLogs(f.id, tranfer.from_id, "Ownership transfered", "To " + tranfer.to_id)
        db.session.add(log)
        db.session.delete(tranfer)
        db.session.commit()
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

# Show files created by me
@file_ops.route('/showFiles', methods=['GET'])
@login_required
def showFiles():
    try:
        fs = Files.query.filter_by(created_by=current_user.login_email).all()
        ret = [{'name':x.name, 
                'trackingID':crypt.encrypt(x.id),
                'type':x.category,
                'time':x.created_on,
                'status':str(str('Currently with ' + x.location) if x.confirmed else str('Sent to ' + x.location)) if x.location else 'File Processed'
                } for x in fs]
        ret = sorted(ret, key=lambda x: x['time'], reverse=True)
        return jsonify(ret)
    except Exception as e:
        print(e)
        return jsonify({'error':True})

# Show Files waiting to be transfered
@file_ops.route('/showTransfers', methods=['GET'])
@login_required
def showTransfers():
    try:
        tranfers = TransferRequest.filter_by(to_id=current_user.login_email).all()
        ret = [{'t_id':x.id,
                'from':x.from_id,
                'name':x.name, 
                'trackingID':crypt.encrypt(x.id),
                } for x in tranfers]
        return jsonify(ret)
    except:
        return jsonify({'error':True})

# Show Files sent to me but not received
@file_ops.route('/showQueue', methods=['GET'])
@login_required
def showQueue():
    try:
        office = request.args['office']
        fs = Files.query.filter(Files.location == office, Files.confirmed == False).all()
        ret = [{'name':x.name, 
                'trackingID':crypt.encrypt(x.id),
                'status':x.created_by,
                'time':x.created_on,
                'type':x.category
                } for x in fs]
        ret = sorted(ret, key=lambda x: x['time'], reverse=True)
        return jsonify(ret)
    except:
        return jsonify({'error':True})

# Show Files sent to me and received
@file_ops.route('/showReceived', methods=['GET'])
@login_required
def showReceived():
    try:
        office = request.args['office']
        fs = Files.query.filter(Files.location == office, Files.confirmed == True).all()
        ret = [{'name':x.name, 
                'trackingID':crypt.encrypt(x.id),
                'status': x.created_by,
                'time':x.created_on,
                'type':x.category
                } for x in fs]
        ret = sorted(ret, key=lambda x: x['time'], reverse=True)
        return jsonify(ret)
    except:
        return jsonify({'error':True})

@file_ops.route('/confirmed', methods=['GET'])
@login_required
def Confirmed():
    try:
        tag = request.args['tag']
        office = request.args['office']
        id = crypt.decrypt(tag)
        fs = Files.query.filter_by(id=id).first()
        if(fs.location != office):
            return jsonify({'error':True})
        return jsonify({'name':fs.name, 'confirmed':fs.confirmed})
        return jsonify(ret)
    except:
        return jsonify({'error':True})

@file_ops.route('/showProcessed', methods=['GET'])
@login_required
def showProcessed():
    try:
        office = request.args['office']
        fs = FileLogs.query.filter_by(location=office).all()
        fileids = list(set([x.file_id for x in fs]))
        print(fileids)
        files = [Files.query.filter_by(id=x).first() for x in fileids]
        ret = [{'name':x.name, 
                'trackingID':crypt.encrypt(x.id),
                'status': x.created_by,
                'time':x.created_on,
                'type':x.category
                } for x in files]
        ret = sorted(ret, key=lambda x: x['time'], reverse=True)
        print(ret)
        return jsonify(ret)
    except Exception as e:
        print(e)
        return jsonify({'error':True})


@file_ops.route('/updateFile', methods=['POST'])
@login_required
def updateFile():
    try:
        tag, typ, office, next_location, remarks = [request.form[x] for x in ['tag','type', 'office','next','remarks']]
        typ = int(typ)
        if typ in [1, 3, 4]:
            id = crypt.decrypt(tag)
            f = Files.query.filter_by(id=id).first()
            fl = FileLogs(id, office, 'Passed on' if next_location else ('Approved and Returned' if typ==3 else 'Approved and Kept'), remarks)
            f.location = next_location
            f.confirmed = False
            db.session.add(fl)
            db.session.commit()
        elif typ in [5,6]:
            id = crypt.decrypt(tag)
            f = Files.query.filter_by(id=id).first()
            fl = FileLogs(id, office, 'Not Approved and Returned' if typ==5 else 'Not Approved and Kept' , remarks)
            f.location = ''
            db.session.add(fl)
            db.session.commit()
        else:
            if not next_location:
                id = crypt.decrypt(tag)
                f = Files.query.filter_by(id=id).first()
                email.sendMail("IMP: Input Required", f.created_by, "Hi there!\nYour file id: {}, {}, requires your input at {}.\n\n'{}'".format(tag, f.name, office, remarks))
            else:
                id = crypt.decrypt(tag)
                f = Files.query.filter_by(id=id).first()
                fl = FileLogs(id, office, 'Sent for clarification', remarks)
                f.location = next_location
                f.confirmed = False
                db.session.add(fl)
                db.session.commit()
        return jsonify({'error':False})
    except Exception as e:
        return jsonify({'error':True})

@file_ops.route('/fileHistory', methods=['GET'])
@login_required
def fileHistory():
    try:
        tag = request.args['tag']
        id = crypt.decrypt(tag)
        f = Files.query.filter_by(id=id).first()
        fls = FileLogs.query.filter_by(file_id=id).all()
        tags = Tags.query.filter(Tags.file_id == id, Tags.email == current_user.login_email).all()
        tags = [x.tag for x in tags]
        ret = { 'name':f.name,
                'token':tag,
                'tags':tags,
                'history': [{'location':x.location, 
                'date':x.time,
                'action':x.outcome + " by " + x.location,
                'remarks':x.remarks
                } for x in fls]
            }
        if (f.location and not f.confirmed):
            ret['history'].append({'location':f.location, 'date':datetime.now(), 'action':'Sent to ' + f.location, 'remarks':''})
        elif (f.location):
            ret['history'].append({'location':f.location, 'date':datetime.now(), 'action':'Received by ' + f.location, 'remarks':''})
        
        ret['history'] = sorted(ret['history'], key=lambda x: x['date'], reverse=True)
        return jsonify(ret)
    except Exception as e:
        return jsonify({'error':True, 'msg':str(e)})





















@file_ops.route('/fileTag', methods=['POST'])
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

@file_ops.route('/fileTagSearch', methods=['POST'])
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

@file_ops.route('/fileTagComplete', methods=['GET'])
@login_required
def fileTagComplete():
    try:
        office, file_tag = [request.form[x] for x in ['office', 'file_tag']]
        fs = Tags.query.filter(Tags.email==current_user.login_email, Tags.tag.ilike("%" + file_tag + "%")).all()

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