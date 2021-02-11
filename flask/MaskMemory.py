import numpy as np
import cv2 
from imagehash import phash
from utils import preprocessImage
from PIL import Image

class MaskMemory:
    def __init__(self, height, width):
        self.HEIGHT = height
        self.WIDTH =  width
        self.frame = [[set() for _ in range(width)] for _ in range(height)]
        self.total = {}
        self.id = 0
        self.hashes = {}
    
    def remember(self, id, img, mask):
        count = 0
        print(img)
        self.hashes[id] = phash(img)
        for i in range(self.WIDTH):
            for j in range(self.HEIGHT):
                if mask[j][i]: 
                    count += 1
                    self.frame[j][i].add(id)
        self.total[id] = count

    def remember_process(self, img):
        # Input is CV2 read image
        cropped, mask = preprocessImage(img)
        self.remember(self.id, Image.fromarray(cropped), mask)
        self.id += 1
        print("Scanned")

    def identify(self, mask, algo="MAX_IOU"):
        if algo == "MAX_IOU":
            truePos = {}
            count = 0
            for i in range(self.WIDTH):
                for j in range(self.HEIGHT):
                    if mask[j][i]: 
                        count += 1
                        for id in self.frame[j][i]:
                            if id in truePos.keys():
                                truePos[id] += 1
                            else:
                                truePos[id] = 1
            max_iou = 0
            max_iou_id = -1
            for id in truePos.keys():
                inter = truePos[id]
                union = self.total[id] + count - inter
                if inter/union > max_iou:
                    max_iou = inter/union
                    max_iou_id = id
            return max_iou_id
        elif algo == "PHASH":
            h = phash(mask)
            min_diff_id = -1
            min_diff = float("inf")
            for id in self.hashes.keys():
                if self.hashes[id]-h < min_diff:
                    min_diff = self.hashes[id]-h
                    min_diff_id = id
            return min_diff_id
        else:
            raise Exception("Unknown algorithm")

    def identify_process(self, img, algo):
        # Input is CV2 read image
        cropped, mask = preprocessImage(img)
        id = self.identify(Image.fromarray(cropped), algo)
        print("Dehashed")
        return id