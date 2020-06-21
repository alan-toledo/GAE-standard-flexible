const express = require('express');
const router = express.Router();
const Multer = require('multer');
const fs = require('fs');
const path = require('path');
const fetch = require("node-fetch");
const {Datastore} = require('@google-cloud/datastore');
const {Storage} = require('@google-cloud/storage');

const CLOUD_BUCKET =  process.env.GCLOUD_STORAGE_BUCKET;
const BACKEND =  'http://localhost:8181';


let keyFilename = path.join('PATH_YOUR_CREDENTIALS');
let obj = JSON.parse(fs.readFileSync(keyFilename, 'utf8'));
let projectId = obj["project_id"];

const storage = new Storage({projectId, keyFilename}); // Instantiate a storage client
const datastore = new Datastore({projectId, keyFilename}); // Instantiate a datastore client

// Multer is required to process file uploads and make them available via req.files.
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 500 * 1024 * 1024, // no larger than 500mb, you can change as needed.
    },
});


const BUCKET = storage.bucket(CLOUD_BUCKET);

function getPublicUrl (filename) {
	return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
}

async function insertRegister(register) {
	return datastore.save({key: datastore.key('file'), data: register});
}

let pageSize = 5;
let lastVisible = null;

async function getRegisters(step) {
    const query = datastore.createQuery('file');
    if (step == true && lastVisible != null){
        //Get a number of files according pageSize and lastVisible
        query.filter('last_modified', '<' , lastVisible).order('last_modified', {descending: true}).limit(pageSize);
    }else{
        query.order('last_modified', {descending: true}).limit(pageSize);
    }
	return datastore.runQuery(query);
};

async function deleteRegister(fileId) {
	const fileKey = datastore.key(['file', fileId]);
	return datastore.delete(fileKey);
};

async function editRegister(fileId, register) {
	const fileKey = datastore.key(['file', fileId]);
	return datastore.save({key: fileKey, data: register});
};

router.delete('/remove/:fileId/:filename', (req, res, next) => {
	console.log('/remove/:fileId/:filename', req.params.fileId, req.params.filename);
	(async() => {
		try {
			const fileId = parseInt(req.params.fileId)
            const filename = req.params.filename
            //Delete register in DataStore
            await deleteRegister(fileId);
             //Delete object file in BUCKET
			await BUCKET.file(filename).delete();
			res.status(200).send({fileId: fileId});
		} catch (err) {
			res.status(500).send({status: "error", message: err.message});
		}
	})();
});

router.put('/update/:fileId', (req, res, next) => {
	console.log('/update/:fileId', req.params.fileId, req.body);
	(async() => {
		try {
			const fileId = parseInt(req.params.fileId) //Important Parse to DataStore
			const register = {name: req.body['name'], url: req.body['url'], last_modified: new Date()}
			await editRegister(fileId, register);
			req.body['last_modified'] = register['last_modified'];
			res.status(200).send(req.body);
		} catch (err) {
			res.status(500).send({status: "error", message: err.message});
		}
	})();
});

router.get('/files/:step', (req, res, next) => {
	console.log('/files');
	(async() => {
		try {
            let result = await getRegisters('true' == req.params.step);
            //Transform data (map) to include id (auto-generated) in DataStore.
			let files = result[0].map(function(x) {
                x['id'] = x[datastore.KEY].id
                lastVisible = x['last_modified'];
				return x;
            });
			res.status(200).send(files);
		} catch (err) {
			res.status(500).send({status:"error", message: err.message});
		}
	})();
});

//A object file is uploaded a bucket, if it is successful, a register in datastore is created.
router.post('/upload', multer.single('file'), (req, res, next) => {
	console.log('/upload', req.file);
	if (!req.file) {
		res.status(400).send('No file uploaded.');
		return;
	}
	const name = Date.now();
	const file = BUCKET.file(name);
	const stream = file.createWriteStream({
		metadata: {
		  contentType: req.file.mimetype
		},
		resumable: false
	});
	stream.on('error', (err) => {
		req.file.cloudStorageError = err;
		next(err);
	});
	stream.on('finish', () => {
		req.file.cloudStorageObject = name;
		file.makePublic().then(() => {
			req.file.cloudStoragePublicUrl = getPublicUrl(name);
			(async() => {
				//body-parser --> req.body['name'])
				let register = {name: req.body['name'], url: req.file.cloudStoragePublicUrl, last_modified: new Date()}
                console.log('/upload -->', register);
                //Insert register in Datastore
				await insertRegister(register);
				res.status(200).send(req.file.cloudStoragePublicUrl);
			})();

		});
	});
	stream.end(req.file.buffer);
});

async function getResponse(url){
    try {
        const response = await fetch(url);
        const json = await response.json();
        return json;
    } catch (error) {
        console.log(error);
    }
};
//A object file is uploaded a bucket, if it is successful, a register in datastore is created.
router.get('/process/:filename', (req, res, next) => {
    console.log('/process')
    const filename = req.params.filename
    let url = BACKEND + '/process?filename=' + filename;
    (async() => {
		try {
            let response = await getResponse(url);
			res.status(200).send(response).end();
		} catch (err) {
			res.status(500).send({status:"error", message: err.message});
		}
	})();
});

  
module.exports = router