import pandas as pd

class File:
    def __init__(self, fs, filename, bucket):
        self.headers, self.order, self.temp_values, self.fs, self.filename, self.bucket = {},{},{},fs,filename,bucket
        self.process()
    
    def process(self):
        if  self.filename != None:
            with self.fs.open(self.bucket + '/' + self.filename, 'rb') as f:
                model = pd.read_csv(f)
                stats = model.describe()
                for header in model.columns:
                    current_stat = stats[header]
                    self.headers[header] = {'min': current_stat['min'], 'max': current_stat['max'], 'mean': current_stat['mean'], 'std': current_stat['std'],'n': current_stat['count']}