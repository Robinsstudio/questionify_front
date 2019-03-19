const request = (url, body) => {
	return fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
};

function getId() {
	return Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

const folder1Id = getId();
request('CreateFolder', { _id: folder1Id, name: 'Folder 1' });

const folder2Id = getId();
request('CreateFolder', { _id: folder2Id, name: 'Folder 2', idParent: folder1Id });

const folder3Id = getId();
request('CreateFolder', { _id: folder3Id, name: 'Folder 3', idParent: folder1Id });

const question1Id = getId();
request('SaveQuestion', { _id: question1Id, name: 'Question 1', label: 'Is this the first question?', answers: [{ label: 'Yes', correct: true }, { label: 'No', correct: false }], idParent: folder1Id });

const question2Id = getId();
request('SaveQuestion', { _id: question2Id, name: 'Question 2', label: 'Is this the second question?', answers: [{ label: 'Yes', correct: true }, { label: 'No', correct: false }], idParent: folder1Id });

const question3Id = getId();
request('SaveQuestion', { _id: question3Id, name: 'Question 3', label: 'Is this the third question?', answers: [{ label: 'Yes', correct: true }, { label: 'No', correct: false }], idParent: folder2Id });

const question4Id = getId();
request('SaveQuestion', { _id: question4Id, name: 'Question 4', label: 'Is this the fourth question?', answers: [{ label: 'Yes', correct: true }, { label: 'No', correct: false }], idParent: folder2Id });

const question5Id = getId();
request('SaveQuestion', { _id: question5Id, name: 'Question 5', label: 'Is this the fifth question?', answers: [{ label: 'Yes', correct: true }, { label: 'No', correct: false }], idParent: folder3Id });

request('Delete', { _id: folder3Id });