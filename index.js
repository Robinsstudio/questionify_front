const app = require('express')();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const { join } = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const cloud = 'cloud';
const public = 'public';

app.use(bodyParser.json())

.post(/FolderRequest/, async (req, res) => {
	res.json(await getFolder(req.body.folder));
})

.get(/.*/, (req, res) => {
	res.sendFile(decodeURIComponent(req.url), {root: join(__dirname, public)}, err => {
		if (err) {
			res.send("Error 404 - Page not found");
		}
	});
})

const getFolder = async (folder = []) => {
	return {
		folder,
		files: await Promise.all((await fs.readdirAsync(join(cloud, ...folder))).map(async(name) => {
			return {name: name, type: ((await fs.lstatAsync(join(cloud, ...folder, name))).isDirectory() ? 'folder' : 'file')};
		}))
	}
}

http.listen(8080);