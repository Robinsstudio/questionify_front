const app = require('express')();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const { join } = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const cloud = 'cloud';

const handleError = (error, response) => {
	console.log(error);
	response.status(500).end();
}

app.use(bodyParser.json());

app.post(/FolderRequest/, (req, res) => {
	const { body: { folder } } = req;
	getFolder(folder).then(fold => res.json(fold)).catch( (err) => handleError(err, res) );
});

app.post(/FolderCreate/, (req, res) => {
	const { body: { folder } } = req;
	createFolder(folder).then( () => res.status(200).end() ).catch( (err) => handleError(err, res) );
});

app.post(/FileRename/, (req, res) => {
	const { body: { file, name } } = req;
	renameFile(file, name).then( () => res.status(200).end() ).catch( (err) => handleError(err, res) );
});

app.post(/FileRemove/, (req, res) => {
	const { body: { file } } = req;
	removeFile(file).then( () => res.status(200).end() ).catch( (err) => handleError(err, res) );
});

app.post(/FileRequest/, (req, res) => {
	const { body: { file } } = req;
	getFile(file).then( (file) => res.json(file) ).catch( (err) => handleError(err, res) );
});

app.post(/FilesRequest/, (req, res) => {
	const { body: { files } } = req;
	getFiles(files).then( (files) => res.json(files) ).catch( (err) => handleError(err, res) );
});

app.post(/QuestionSave/, (req, res) => {
	const { body: { file, question } } = req;
	saveQuestion(file, question).then( () => res.status(200).end() ).catch( (err) => handleError(err, res) );
})

const createFolder = (folder) => fs.mkdirAsync(join(cloud, ...folder))

const getFile = async (file) => {
	const data = JSON.parse(await fs.readFileAsync(join(cloud, ...file)));
	return { name: file.slice(-1)[0], type: data.type, data };
}

const getFiles = async (files) => {
	return await Promise.all(files.map(file => getFile(file)));
}

const getFolder = async (folder) => {
	return {
		folder,
		files: await Promise.all((await fs.readdirAsync(join(cloud, ...folder))).map(async(name) => {
			if ((await fs.lstatAsync(join(cloud, ...folder, name))).isDirectory()) {
				return { name, type: 'folder' };
			}
			return getFile(folder.concat(name));
		}))
	}
}

const removeFile = (file) => removeFileRecursive(join(cloud, ...file));

const removeFileRecursive = async (file) => {
	if ((await fs.lstatAsync(file)).isDirectory()) {
		await Promise.all((await fs.readdirAsync(file)).map(async(sub) => await removeFileRecursive(join(file, sub))))
		await fs.rmdirAsync(file);
	} else {
		await fs.unlinkAsync(file);
	}
}

const renameFile = (file, name) => fs.renameAsync(join(cloud, ...file), join(cloud, ...file.slice(0, -1), name))

const saveQuestion = (file, question) => fs.writeFileAsync(join(cloud, ...file), question);

http.listen(8080);