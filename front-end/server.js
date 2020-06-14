// Copyright 2017 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// [START gae_node_request_example]
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser')
const api = require('./api');
const PORT = process.env.PORT || 8080;

/* Static Path */
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api', api);

app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}...`);
});

module.exports = app;