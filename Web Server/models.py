from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from itsdangerous import URLSafeSerializer

db = SQLAlchemy()

serializer = URLSafeSerializer(b'\n\x7f&J\xae\xce&\xea\x05e\xdb\x7f\xd3\xbc\x1a6')

class OTP(db.Model):
    email = db.Column(db.String, primary_key=True)
    otp = db.Column(db.String)
    created_on = db.Column(db.DateTime)
 
    def __init__(self, email, otp):
        self.email = email
        self.otp = otp
        self.created_on = datetime.now()
 
    def __repr__(self):
        return f"{self.email}:{self.otp}"

class Institutions(db.Model):
    login_email = db.Column(db.String, unique=True)
    name = db.Column(db.String, primary_key=True)

    def __init__(self, login_email, name):
        self.login_email = login_email
        self.name = name

    def __repr__(self):
        return self.name

class OfficeEmails(db.Model):
    email = db.Column(db.String, primary_key=True)
    name = db.Column(db.String)
    institution = db.Column(db.String)

    def __init__(self, email, name, institution):
        self.email = email
        self.name = name
        self.institution = institution

    def __repr__(self):
        return self.name + ',' + self.institution

class Users(UserMixin, db.Model):
    login_email = db.Column(db.String, primary_key=True)
    name = db.Column(db.String)
    emails = db.Column(db.String, nullable=True)
    token = db.Column(db.String, unique=True)

    def __init__(self, login_email):
        self.login_email = login_email
        self.name = ''
        self.emails = ''
        self.token = serializer.dumps([self.login_email])

    def __repr__(self):
        return self.login_email

    def get_id(self):
        return str(self.token)

class Files(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    created_by = db.Column(db.String)
    category = db.Column(db.String)
    location = db.Column(db.String)
    tag_number = db.Column(db.Integer, nullable=True)
    
    def __init__(self, name, created_by, category, location, tag_number):
        self.name = name
        self.created_by = created_by
        self.category = category
        self.location = location
        self.tag_number = tag_number

    def __repr__(self):
        return self.created_by+': '+self.name+': '+self.location+': '+str(self.tag_number)

class Tags(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    file_id = db.Column(db.Integer)

    def __init__(self, id, file_id):
        self.id = id
        self.file_id = file_id

    def __repr__(self):
        return str(self.id) + " : " + str(self.file_id)

class FileLogs(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    file_id = db.Column(db.Integer)
    location = db.Column(db.String)
    time = db.Column(db.DateTime)

    def __init__(self, file_id, location):
        self.file_id = file_id
        self.location = location
        self.time = datetime.now()

    def __repr__(self):
        return str(self.id)+" "+self.location+" "+str(self.time)