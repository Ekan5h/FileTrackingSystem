from main import app, db
from models import *

f = open('offices.tsv', 'r')

offices = [x.split('\t') for x in f.read().split('\n')]
departments = [
                'Computer Science and Engineering', 
                'Electrical Engineering', 
                'Mechanical Engineering', 
                'Chemical Engineering',
                'Civil Engineering',
                'Biomedical Engineering',
                'Humanities and Social Sciences',
                'Maths Department',
                'Physics Department',
                'Chemistry Department',
                'Metallurgical and Materials Engineering',
                'Other'
            ]

with app.app_context():
    OfficeEmails.query.delete()

    for name, _, email, category in offices:
        obj = OfficeEmails(email, name, 'IITRPR', category)
        db.session.add(obj)
        print("Office: {} added!".format(name))

    db.session.commit()

    for dept in departments:
        obj = Department(dept)
        db.session.add(obj)
        print("Department: {} added!".format(name))

    db.session.commit()