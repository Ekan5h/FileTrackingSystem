import cv2

img = cv2.imread('test.png')

arucoDict = cv2.aruco.Dictionary_get(cv2.aruco.DICT_4X4_250)
arucoParams = cv2.aruco.DetectorParameters_create()
corners, ids, rejected = cv2.aruco.detectMarkers(img, arucoDict, parameters=arucoParams)
for i in range(len(ids)):
    x, y = 0, 0
    for p in corners[i][0]:
        x += p[0]
        y += p[1]
    x = int(round(x/4))
    y = int(round(y/4))
    img = cv2.circle(img, (x,y), 10, (0,255,0), -1)
    img = cv2.putText(img, str(ids[i][0]), (x,y), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,255), 2, cv2.LINE_AA) 
cv2.imshow('',img)
cv2.waitKey(0)