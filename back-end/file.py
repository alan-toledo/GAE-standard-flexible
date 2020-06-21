class File:
    def __init__(self, filename, bucket):
        self.headers, self.order, self.temp_values, self.filename, self.bucket = {},{},{},filename,bucket
        self.process()
    
    def process(self):
        if  self.filename != None:
            blob = self.bucket.get_blob(self.filename)
            raw_file = blob.download_as_string().decode('utf8').split('\n')
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