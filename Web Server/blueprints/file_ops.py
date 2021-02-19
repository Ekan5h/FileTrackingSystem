from flask import Flask, render_template , request , jsonify, Blueprint
from datetime import datetime, timedelta
from random import random
from models import *

file_ops = Blueprint('file_ops', __name__, template_folder='templates')
