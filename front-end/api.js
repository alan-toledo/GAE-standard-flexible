const express = require('express');
const router = express.Router();
const Multer = require('multer');
const fs = require('fs');
const path = require('path');
const {Datastore} = require('@google-cloud/datastore');
const {Storage} = require('@google-cloud/storage');

const CLOUD_BUCKET =  process.env.GCLOUD_STORAGE_BUCKET || 'appdataanalytics_file';

let keyFilename = path.join(__dirname, './credentials/AppDataAnalytics-9a7ad22f250e.json');
let obj = JSON.parse(fs.readFileSync(keyFilename, 'utf8'));
let projectId = obj["project_id"];
const storage = new Storage({projectId, keyFilename}); // Instantiate a storage client
const datastore = new Datastore({projectId, keyFilename}); // Instantiate a datastore client

// Multer is required to process file uploads and make them available via req.files.
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 50 * 1024 * 1024, // no larger than 50mb, you can change as needed.
    },
});


const BUCKET = storage.bucket(CLOUD_BUCKET);

function getPublicUrl (filename) {
	return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
}

async function insertRegister(register) {
	return datastore.save({key: datastore.key('file'), data: register});
}

async function getRegisters() {
	const query = datastore.createQuery('file').order('last_modified', {descending: true})
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
			await deleteRegister(fileId);
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
			const fileId = parseInt(req.params.fileId) //Important Parse
			const register = {name: req.body['name'], url: req.body['url'], last_modified: new Date()}
			await editRegister(fileId, register);
			req.body['last_modified'] = register['last_modified'];
			res.status(200).send(req.body);
		} catch (err) {
			res.status(500).send({status: "error", message: err.message});
		}
	})();
});

router.get('/files', (req, res, next) => {
	console.log('/files');
	(async() => {
		try {
			let result = await getRegisters();
			let files = result[0].map(function(x) {
				x['id'] = x[datastore.KEY].id
				return x;
			});
			res.status(200).send(files);
		} catch (err) {
			res.status(500).send({status:"error", message: err.message});
		}
	})();
});

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
				await insertRegister(register);
				res.status(200).send(req.file.cloudStoragePublicUrl);
			})();

		});
	});
	stream.end(req.file.buffer);
});

  
module.exports = router