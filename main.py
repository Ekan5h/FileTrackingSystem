import cv2
from utils import preprocessImage
from MaskMemory import MaskMemory
from time import time

mem = MaskMemory(69, 119)

_, mask = preprocessImage(cv2.imread("test.png"))
mem.remember("test", mask)
#cv2.imshow("",mask)
#cv2.waitKey(0)

_, mask = preprocessImage(cv2.imread("test_scans/scan-1.1.png"))
mem.remember("scan 1", mask)

_, mask = preprocessImage(cv2.imread("test_scans/scan-2.1.png"))
mem.remember("scan 2", mask)

_, mask = preprocessImage(cv2.imread("test_scans/scan-1.2.png"))
print(mem.identify(mask))   # Complexity O( n*HEIGHT*WIDTH )

_, mask = preprocessImage(cv2.imread("test_scans/scan-2.2.png"))
print(mem.identify(mask))