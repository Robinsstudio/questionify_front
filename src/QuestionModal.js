import React, { Component } from 'react';
import Modals from './Modals';
import TagInput from './TagInput';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/addon/display/placeholder';
import FileInput from './FileInput';

class QuestionModal extends Component {
	constructor(props) {
		super(props);

		this.codeMirror = React.createRef();

		this.updateQuestion = this.updateQuestion.bind(this);
		this.addAnswer = this.addAnswer.bind(this);
		this.updateFiles = this.updateFiles.bind(this);
		this.updateTags = this.updateTags.bind(this);
		this.toggle = this.toggle.bind(this);
	}

	updateQuestion(label) {
		const { data, update } = this.props;
		update({ ...data, label});
	}

	updateAnswer(event, index) {
		const { data, update } = this.props;
		update({ ...data, answers: data.answers.map((ans, i) => (i === index) ? { label: event.target.value, correct: ans.correct } : ans) });
	}

	addAnswer() {
		const { data, update } = this.props;
		update({ ...data, answers: data.answers.concat({ label: '', correct: false }) });
	}

	removeAnswer(index) {
		const { data, update } = this.props;
		update({ ...data,  answers: data.answers.filter((ans, i) => i !== index) });
	}

	setAnswerCorrect(event, index) {
		const { data, update } = this.props;
		update({ ...data, answers: data.answers.map((ans, i) => (i === index) ? { label: ans.label, correct: event.target.checked } : ans) });
	}

	updateFiles(event) {
		const { data, update } = this.props;
		update({ ...data, files: event.target.files });
	}

	updateTags(tags) {
		const { data, update } = this.props;
		update({ ...data, tags });
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
					<CodeMirror
						value={data.label}
						onChange={this.updateQuestion}
						options={{ mode: 'text/x-markdown', placeholder: 'Saisissez votre question...', indentUnit: 4, indentWithTabs: true }}
						className="border mb-3"
						ref={this.codeMirror}
					/>
					{data.answers.map((ans, index) => {
						return (
							<InputGroup className="mb-3">
								<InputGroupAddon addonType="prepend">
									<InputGroupText>
										<Input addon type="checkbox" checked={ans.correct} onChange={e => this.setAnswerCorrect(e, index)}/>
									</InputGroupText>
								</InputGroupAddon>
								<Input className="mr-3" type="text" placeholder="Saisissez votre réponse ici" spellCheck="false" value={ans.label} onChange={e => this.updateAnswer(e, index)}/>
								<Button color="danger" onClick={e => this.removeAnswer(index)}>
									<i className="fas fa-times"/>
								</Button>
							</InputGroup>
						);
					})}
					<InputGroup className="justify-content-center">
						<Button onClick={this.addAnswer} color="success" className="mb-3">
							<i className="fas fa-plus"/>
						</Button>
					</InputGroup>
					<InputGroup className="mb-3">
						<FileInput id="firstInput" placeholder="Choisissez une image..." accept="image/*" onChange={this.updateFiles} multiple/>
					</InputGroup>
					<TagInput tags={data.tags || []} onChange={this.updateTags}/>
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