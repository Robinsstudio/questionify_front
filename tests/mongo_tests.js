const mocha = require('mocha');
const assert = require('assert');
const model = require('../impl');
const chai = require('chai');
const fetch = require("node-fetch");
var MongoObjectID = require("mongodb").ObjectID; 

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
/*
    it('Create folder',()=>{
        request('CreateFolder', { _id: folder1Id, name: 'Folder 1' }).then(()=>{
            assert(folder1Id.isNew === false);
            done();
        },()=>{throw new Error('Erreur')});
    });

    it('Create question',()=>{
        request('SaveQuestion', { _id: question1Id,
             name: 'Question 1', label: 'Is this the first question?',
              answers: [{ label: 'Yes', correct: true }, { label: 'No', correct: false }],
               idParent: folder1Id }).then(()=>{
                    assert(question1Id.isNew === false);
                    done();
               });

    });
*/
    it('Delete question',()=>{
        model.createFolder({ _id: folder3Id, name: 'Folder 3', idParent: folder1Id });
        model.delete(folder3Id).then(() =>{
            var objToFind     = { _id: new MongoObjectID(folder3Id) };
            console.log(objToFind._id);
        })
        });

        //assert.undefined(objToFind);
        //chai.assert.isNotNull(objToFind);
        //chai.assert.isNaN(objToFind);

    });





/* var mocha = require('mocha');
var assert = require('assert');

describe("some demo tests",function(){
    //Create tests
    it('adds two numbers together',function(){
        assert(2+3 === 5);
    })
}) */