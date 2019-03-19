const app = require('express')();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const Promise = require('bluebird');
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });

const Question = mongoose.model('Question', {
	type: String,
	name: String,
	label: String,
	code: String,
	answers: [{
		label: String,
		correct: Boolean
	}],
	idParent: ObjectId
});

const MultipleChoice  = mongoose.model('MultipleChoice', {
	type: String,
	name: String,
	questions: [{ idQuestion: ObjectId }],
	idParent: ObjectId
});

const Folder = mongoose.model('Folder', {
	type: String,
	name: String,
	idParent: ObjectId
});

app.use(bodyParser.json());

app.post(/CreateFolder/, (req, res) => {
	const folderData = req.body;
	new Folder({ ...folderData, type: 'folder' }).save().then( () => res.status(200).end() );
});

app.post(/ListFolder/, (req, res) => {
	const { _id } = req.body;
	if (_id) {
		Folder.findById(_id).then(folder => {
			return Promise.all([
				folder,
				getParents(folder),
				getByParams({ idParent: folder._id })
			]);
		}).then(([folder, parents, files]) => {
			res.json({ folder: { path: parents, active: folder }, files });
		});
	} else {
		getByParams({ idParent: null }).then(files => res.json({ folder: { path: [], active: {} }, files }));
	}
});

app.post(/GetQuestions/, (req, res) => {
	const { _ids } = req.body;
	Question.where('_id').in(_ids).then(questions => res.json(questions.sort((q1, q2) => _ids.indexOf(q1.id) - _ids.indexOf(q2.id))));
});

app.post(/Rename/, (req, res) => {
	const { _id, name } = req.body;
	getById(_id).then(file => {
		file.name = name;
		file.save();
	}).then( () => res.status(200).end() );
});

app.post(/Delete/, (req, res) => {
	const { _id } = req.body;
	deleteFile(_id).then(() => res.status(200).end());
});

app.post(/SaveQuestion/, (req, res) => {
	const questionData = { ...req.body, type: 'question'};
	if (questionData._id) {
		Question.findOneAndUpdate({ _id: questionData._id }, questionData, { upsert: true }).then( () => res.status(200).end() );
	} else {
		new Question(questionData).save().then( () => res.status(200).end() );
	}
});

app.post(/SaveMultipleChoice/, (req, res) => {
	const multipleChoiceData = { ...req.body, type: 'qcm'};
	if (multipleChoiceData._id) {
		MultipleChoice.findOneAndUpdate({ _id: multipleChoiceData._id }, multipleChoiceData, { upsert: true }).then( () => res.status(200).end() );
	} else {
		new MultipleChoice(multipleChoiceData).save().then( () => res.status(200).end() );
	}
});

const getById = (_id) => {
	return Promise.all([ Folder.findById(_id), Question.findById(_id), MultipleChoice.findById(_id) ]).then(result => result[0] || result[1] || result[2]);
}

const getByParams = (params) => {
	return Promise.all([ Folder.find(params), Question.find(params), MultipleChoice.find(params) ]).then(result => {
		const folders = result[0].sort((file1, file2) => file1.name.localeCompare(file2.name));
		const files = result[1].concat(result[2]).sort((file1, file2) => file1.name.localeCompare(file2.name));
		return folders.concat(files);
	});
}

const getParents = (folder) => {
	return folder.idParent ? Folder.findOne({ _id: folder.idParent }).then(fold => {
		return fold.idParent ? getParents(fold).then(parents => parents.concat(fold)) : [fold];
	}) : Promise.resolve([]);
};

const deleteFile = (_id) => {
	return Promise.all([
		deleteRecursive(_id),
		Folder.deleteOne({ _id }),
		Question.deleteOne({ _id }),
		MultipleChoice.deleteOne({ _id })
	]);
}

const deleteRecursive = (_id) => {
	return Folder.find({ idParent: _id }).then(folders => Promise.all(folders.map(folder => deleteRecursive(folder)))).then(() => {
		return Promise.all([ Folder.deleteMany({ idParent: _id }), Question.deleteMany({ idParent: _id }), MultipleChoice.deleteMany({ idParent: _id }) ]);
	});
}

http.listen(8080);