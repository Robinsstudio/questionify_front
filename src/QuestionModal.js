import React, { Component } from 'react';
import Modals from './Modals';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { InputGroup, InputGroupAddon, InputGroupText, Input, Collapse } from 'reactstrap';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/clike/clike';

class QuestionModal extends Component {
	constructor(props) {
		super(props);

		this.codeMirror = React.createRef();

		this.updateQuestion = this.updateQuestion.bind(this);
		this.addAnswer = this.addAnswer.bind(this);
		this.updateCode = this.updateCode.bind(this);
		this.toggle = this.toggle.bind(this);
	}

	updateQuestion(event) {
		const { data, update } = this.props;
		update({ ...data, question:  event.target.value});
	}

	updateAnswer(event, index) {
		const { data, update } = this.props;
		update({ ...data, answers: data.answers.map((ans, i) => (i === index) ? { answer: event.target.value, correct: ans.correct } : ans) });
	}

	addAnswer() {
		const { data, update } = this.props;
		update({ ...data, answers: data.answers.concat({ answer: '', correct: false }) });
	}

	removeAnswer(index) {
		const { data, update } = this.props;
		update({ ...data,  answers: data.answers.filter((ans, i) => i !== index) });
	}

	setAnswerCorrect(event, index) {
		const { data, update } = this.props;
		update({ ...data, answers: data.answers.map((ans, i) => (i === index) ? { answer: ans.answer, correct: event.target.checked } : ans) });
	}

	updateCode(code) {
		const { data, update } = this.props;
		update({ ...data, code });
	}

	toggle() {
		const { data, update } = this.props;
		setTimeout(() => this.codeMirror.current.getCodeMirror().refresh(), 20);
		update({ ...data, expand: !data.expand });
	}

	onConfirm(data) {
		const { hide, promise: { resolve } } = this.props;
		if (data.name) {
			resolve(data);
			hide();
		} else {
			Modals.showPromptModal('Nouvelle question', 'Saississez un nom de question ici...').then(name => {
				resolve({ ...data, name });
				hide();
			}).catch(() => {});
		}
	}

	onCancel(data) {
		const { hide, promise: { reject } } = this.props;
		reject(data);
		hide();
	}

	render() {
		const { open, data } = this.props;
		return (
			<Modal isOpen={open} toggle={e => this.onCancel(data)} size="lg">
				<ModalHeader>Saisir une question</ModalHeader>
				<ModalBody>
					<Input className="mb-3" type="text" placeholder="Saisissez votre question ici" spellCheck="false" value={data.question} onChange={this.updateQuestion}/>
					<Button onClick={this.addAnswer} className="mb-3 mr-3">Ajouter une réponse</Button>
					<Button className="mb-3" onClick={this.toggle}>Ajouter un extrait de code</Button>
					<Collapse isOpen={data.expand}>
						<CodeMirror className="border mb-3" value={data.code} onChange={this.updateCode} options={{ mode: 'text/x-java', indentUnit: 4, indentWithTabs: true }} ref={this.codeMirror}/>
					</Collapse>
					{data.answers.map((ans, index) => {
						return (
							<InputGroup className="mb-3">
								<InputGroupAddon addonType="prepend">
									<InputGroupText>
										<Input addon type="checkbox" checked={ans.correct} onChange={e => this.setAnswerCorrect(e, index)}/>
									</InputGroupText>
								</InputGroupAddon>
								<Input className="mr-3" type="text" placeholder="Saisissez votre réponse ici" spellCheck="false" value={ans.answer} onChange={e => this.updateAnswer(e, index)}/>
								<Button color="danger" onClick={e => this.removeAnswer(index)}>Supprimer</Button>
							</InputGroup>
						);
					})}
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={e => this.onConfirm(data)}>Enregistrer</Button>
					<Button color="secondary" onClick={e => this.onCancel(data)}>Annuler</Button>
				</ModalFooter>
			</Modal>
		);
	}
}

export default QuestionModal;