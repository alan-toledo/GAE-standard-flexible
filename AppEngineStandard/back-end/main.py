# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START gae_python37_render_template]
import os
import json
from stats import Stats
from file import File
import gcsfs
from flask import Flask, render_template, request

CLOUD_BUCKET = os.environ.get('GCLOUD_STORAGE_BUCKET')
fs = gcsfs.GCSFileSystem(token='YOUR_CREDENTIALS')

app = Flask(__name__)

@app.route('/')
def root():
    return render_template('index.html')

@app.route("/process")
def process():
    
    filename = request.args.get('filename', default = None, type = str)  
    #Class File: File is stored fully in memory file to process.
    myFile = File(fs, filename, CLOUD_BUCKET)
    for header in myFile.headers:
        #Class Stats: Compute stats from a column with values.
        myStats = Stats(myFile.temp_values[header])
        myStats.stats_from_scratch()
        myStats.std_from_scratch()
        myFile.headers[header]['min'] = myStats.min
        myFile.headers[header]['max'] = myStats.max
        myFile.headers[header]['n'] = myStats.n
        myFile.headers[header]['mean'] = myStats.mean
        myFile.headers[header]['std'] = myStats.std
    print(json.dumps(myFile.headers, sort_keys=True))
    return json.dumps(myFile.headers, sort_keys=True)

if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    # Flask's development server will automatically serve static files in
    # the "static" directory. See:
    # http://flask.pocoo.org/docs/1.0/quickstart/#static-files. Once deployed,
    # App Engine itself will serve those files as configured in app.yaml.
    app.run(host='127.0.0.1', port=8181, debug=True)
# [START gae_python37_render_template]