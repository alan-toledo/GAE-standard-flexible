class File:
    def __init__(self, fs, filename, bucket):
        self.headers, self.order, self.temp_values, self.fs, self.filename, self.bucket = {},{},{},fs,filename,bucket
        self.process()
    
    def process(self):
        if  self.filename != None:
            with self.fs.open(self.bucket + '/' + self.filename, 'rb') as f:
                raw_file = f.read().decode('utf8').split('\n')

            for row_i, row in enumerate(raw_file):
                if row_i == 0:
                    list_headers = [str(x).replace('\r','') for x in row.split(',')]
                    for h_i, h in enumerate(list_headers):
                        if h not in self.headers:
                            #Basic stats
                            self.headers[h] = {'min': None, 'max': None, 'mean': None, 'std': None,'n': None}
                            self.order[h_i] = h
                            self.temp_values[h] = []
                else:
                    try:
                        #Store each column values
                        values = [float(x.replace('\r','')) for x in row.split(',')]
                        for value_i, value in enumerate(values):
                            self.temp_values[self.order[value_i]].append(value)
                    except ValueError:
                        print ("error", row_i)