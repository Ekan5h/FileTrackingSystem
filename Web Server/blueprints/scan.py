from flask import Flask, render_template , request , jsonify, Blueprint
from modules.pHashDB.MaskMemory import MaskMemory
from modules.pHashDB.utils import preprocessImage
from PIL import Image
from models import *
import numpy as np 
import cv2

scan = Blueprint('scan', __name__, template_folder='templates')

memory = MaskMemory(69, 119)

@scan.route('/firstScan' , methods=['POST'])
def firstScan():
	try:
		file = request.files['image'].read() ## byte file
		npimg = np.fromstring(file, np.uint8)
		img = cv2.imdecode(npimg,cv2.IMREAD_COLOR)
		######### Do preprocessing here ################
		memory.remember_process(img)
		################################################
		return jsonify({'error':False})
	except Exception as e:
		print("[Exception] ", e)
		return jsonify({'error':True, 'msg':str(e)})

@scan.route('/scan' , methods=['POST'])
def dehash_image():
	file = request.files['image'].read() ## byte file
	print(algorithm)
	npimg = np.fromstring(file, np.uint8)
	img = cv2.imdecode(npimg,cv2.IMREAD_COLOR)
	######### Do preprocessing here ################
	id = memory.identify_process(img)
	################################################
	return jsonify({'id':str(id)})