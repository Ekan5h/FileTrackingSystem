import numpy as np

class MaskMemory:
    def __init__(self, height, width):
        self.HEIGHT = height
        self.WIDTH =  width
        self.frame = [[set() for _ in range(width)] for _ in range(height)]
        self.total = {}
    
    def remember(self, id, mask):
        count = 0
        for i in range(self.WIDTH):
            for j in range(self.HEIGHT):
                if mask[j][i]: 
                    count += 1
                    self.frame[j][i].add(id)
        self.total[id] = count

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
        else:
            raise Exception("Unknown algorithm")