const mocha = require('mocha');
const assert = require('assert');
const model = require('../impl');
const fetch = require("node-fetch");

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

describe("Some tests with mongoDb",function(){
    var folder1Id= getId();
    var folder2Id= getId();
    var folder3Id= getId();
    var question1Id= getId();
    var question2Id= getId();
    var question3Id= getId();
    var question4Id= getId();
    var question5Id= getId();

    /*beforeEach((done)=>{
        folder1Id = getId();
        folder2Id = getId();
        folder3Id = getId();
        question1Id = getId();
        question2Id = getId();
        question3Id = getId();
        question4Id = getId();
        question5Id = getId();
    });*/

    it('Create folder',()=>{
        request('CreateFolder', { _id: folder1Id, name: 'Folder 1' }).then(()=>{
            assert(folder1Id.isNew === false);
            console.log('Yeah');
            done();
        },()=>{throw new Error('Erreur')});
    });

    it('Save Question',()=>{
        
    })
});




/* var mocha = require('mocha');
var assert = require('assert');

describe("some demo tests",function(){
    //Create tests
    it('adds two numbers together',function(){
        assert(2+3 === 5);
    })
}) */