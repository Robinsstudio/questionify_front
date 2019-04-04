function request(url, body) {
	return fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
}

function shuffle(array) {
	const copy = array.slice();
	return array.map(() => copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
}

const idParent = null;
const tags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'];

Array.from({ length: 100 }, (_,i) => {
	request('SaveQuestion', {
		name: `Question ${i + 1}`,
		label: `Question ${i + 1}`,
		answers: Array.from({ length: Math.floor(Math.random() * 10) + 1 }, (_,j) => {
			return { label: `Answer ${i + 1}.${j + 1}`, correct: Math.floor(Math.random() * 2) ? true : false }
		}),
		tags: shuffle(tags).slice(Math.floor(Math.random() * tags.length)),
		idParent
	});
});