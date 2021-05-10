from main import app, db
from models import *

f = open('offices.tsv', 'r')

offices = [x.split('\t') for x in f.read().split('\n')]


with app.app_context():
    OfficeEmails.query.delete()

    for name, _, email in offices:
        obj = OfficeEmails(email, name, 'IITRPR')
        db.session.add(obj)
        print("Office: {} added!".format(name))

    db.session.commit()