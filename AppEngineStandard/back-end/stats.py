class Stats:
    def __init__(self, lst):
        self.min, self.max, self.n, self.mean, self.std, self.lst  = None, None, 0, None, None, lst

    def stats_from_scratch(self):
        sum = 0.0
        for value in self.lst:
            sum += value
            self.n += 1
            if self.min == None or self.min > value:
                self.min = value
            if self.max == None or self.max < value:
                self.max = value
        if self.n > 0:
            self.mean = float(sum/self.n)
    
    def std_from_scratch(self):
        sum = 0.0
        if self.n > 0:
            for value in self.lst:
                sum += (value - self.mean) ** 2
            if sum > 0:
                self.std = float(sum/self.n) ** 0.5