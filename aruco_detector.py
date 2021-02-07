import numpy as np
import cv2

img = cv2.cvtColor(cv2.imread('test.png'), cv2.COLOR_BGR2GRAY)

arucoDict = cv2.aruco.Dictionary_get(cv2.aruco.DICT_4X4_250)
arucoParams = cv2.aruco.DetectorParameters_create()
corners, ids, _ = cv2.aruco.detectMarkers(img, arucoDict, parameters=arucoParams)

corners = [corners[i] for i in sorted(range(4), key=lambda x:ids[x])]

tie_points = np.array([
    [1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0],
    [1, 700, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 700, 0, 0],
    [1, 0, 300, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 300, 0],
    [1, 700, 300, 210000, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 700, 300, 210000]
])
final = []

for i in range(4):
    x, y = 0, 0
    for p in corners[i][0]:
        x += p[0]
        y += p[1]
    x = int(round(x/4))
    y = int(round(y/4))
    final.extend([[x],[y]])
    # img = cv2.circle(img, (x,y), 10, (255,255,255), -1)

final = np.array(final)

transform = np.linalg.inv(tie_points)@final

cropped = np.zeros((300,700), dtype="uint8")

for i in range(700):
    for j in range(300):
        x = (np.array([1, i, j, i*j, 0, 0, 0, 0])@transform)[0]
        y = (np.array([0, 0, 0, 0, 1, i, j, i*j])@transform)[0]
        cropped[j][i] = img[int(y)][int(x)]

cropped = cv2.blur(cropped[10:-10,110:590],(5,5))
#cropped = cv2.adaptiveThreshold(cropped, 255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV,11,5)
#cropped = cv2.erode(cropped, np.ones((3,3),np.uint8), iterations=1)
#cropped = cv2.dilate(cropped, np.ones((3,3),np.uint8), iterations=1)

cv2.imshow('Cropped',cropped)
cv2.waitKey(0)