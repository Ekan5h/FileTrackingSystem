from flask import Flask, render_template , request , jsonify, Blueprint
from flask_login import login_required
from modules.pHashDB.ocr import readTag
from PIL import Image
from models import *
import numpy as np
import io

scan = Blueprint('scan', __name__, template_folder='templates')

# memory = MaskMemory(69, 119)

# @scan.route('/firstScan' , methods=['POST'])
# def firstScan():
# 	try:
# 		file = request.files['image'].read() ## byte file
# 		npimg = np.fromstring(file, np.uint8)
# 		img = cv2.imdecode(npimg,cv2.IMREAD_COLOR)
# 		######### Do preprocessing here ################
# 		memory.remember_process(img)
# 		################################################
# 		return jsonify({'error':False})
# 	except Exception as e:
# 		print("[Exception] ", e)
# 		return jsonify({'error':True, 'msg':str(e)})

@scan.route('/scan' , methods=['POST'])
@login_required
def scanImage():
	file = io.BytesIO(request.files['image'].read()) ## byte file
	# print(algorithm)
	# npimg = np.fromstring(file, np.uint8)
	# img = cv2.imdecode(npimg,cv2.IMREAD_COLOR)
	# ######### Do preprocessing here ################
	# id = memory.identify_process(img)
	# ################################################
	id = readTag(file)
	return jsonify({'id':id})