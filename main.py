import glob
import cv2
from utils import preprocessImage
from MaskMemory import MaskMemory
from PIL import Image

mem = MaskMemory(69, 119)

imgs = glob.glob("test-data/*.jpg")
imgs1 = [f for f in imgs if len(f.split('.'))==2]
imgs2 = [f for f in imgs if len(f.split('.'))==3]

for img in imgs1:
    try:
        cropped, mask = preprocessImage(cv2.imread(img))
        mem.remember(img, Image.fromarray(cropped), mask)
        print("Scanned: "+img)
    except:
        print("Could not detect markers in "+img)

print("\nRecognition start!\n")

for img in imgs2:
    try:
        cropped, mask = preprocessImage(cv2.imread(img))
        id = mem.identify(Image.fromarray(cropped), algo="PHASH")
        if id.split('.')[0]!=img.split('.')[0]:
            print("Matched incorrectly! "+img+" : "+id)
        else:
            print("Matched Correctly "+img)
    except:
        print("Could not detect markers in "+img)