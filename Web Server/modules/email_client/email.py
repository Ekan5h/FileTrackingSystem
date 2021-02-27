import smtplib
from configparser import ConfigParser
from email.mime.text import MIMEText

con = None
address = None

def config(filename='email.ini', section='gmail'):
    # create a parser
    parser = ConfigParser()
    # read config file
    parser.read(filename)
    # get section, default to postgresql
    db = {}
    if parser.has_section(section):
        params = parser.items(section)
        for param in params:
            db[param[0]] = param[1]
    else:
        raise Exception('Section {0} not found in the {1} file'.format(section, filename))
    return db


def connect():
    global con
    global address
    con = smtplib.SMTP('smtp.gmail.com', 587) 
    con.starttls()
    params = config() 
    address = params['username']
    con.login(params['username'], params['password'])
    print("Connected to gmail")

def disconnect():
    con.quit()

def sendMail(sub, rec, msg):
    connect()
    msg = MIMEText(msg)
    msg['Subject'] = sub
    msg['From'] = "File Tracker "+address
    msg['To'] = rec
    con.sendmail(address, rec, msg.as_string())
    print("Mail sent successfully!")
    print(msg)
    disconnect()