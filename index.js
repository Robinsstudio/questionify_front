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
	const { body: { folder, file, name } } = req;
	renameFile(folder, file, name).then( () => res.status(200).end() ).catch( (err) => handleError(err, res) );
});

app.post(/FileRemove/, (req, res) => {
	const { body: { file, folder } } = req;
	removeFile(folder, file).then( () => res.status(200).end() ).catch( (err) => handleError(err, res) );
});

const createFolder = async (folder) => fs.mkdirAsync(join(cloud, ...folder))

const getFolder = async (folder = []) => {
	return {
		folder,
		files: await Promise.all((await fs.readdirAsync(join(cloud, ...folder))).map(async(name) => {
			return {name: name, type: ((await fs.lstatAsync(join(cloud, ...folder, name))).isDirectory() ? 'folder' : 'file')};
		}))
	}
}

const removeFile = (folder, file) => {
	return removeFileRecursive(join(cloud, ...folder, file));
}

const removeFileRecursive = async (file) => {
	if ((await fs.lstatAsync(file)).isDirectory()) {
		await Promise.all((await fs.readdirAsync(file)).map(async(sub) => await removeFileRecursive(join(file, sub))))
		await fs.rmdirAsync(file);
	} else {
		await fs.unlinkAsync(file);
	}
}

const renameFile = async (folder, file, name) => {
	return fs.renameAsync(join(cloud, ...folder, file), join(cloud, ...folder, name));
}

http.listen(8080);