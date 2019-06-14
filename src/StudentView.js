import React, { Component, Fragment } from 'react';
import { InputGroup, InputGroupAddon, InputGroupText, Input, Button } from 'reactstrap';
import request from './request';
import Modals from './Modals';
import CodeRenderer from './CodeRenderer';
import ReactMarkdown from 'react-markdown';

class StudentView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: {
				value: '',
				typingEnded: false
			},
			questions: [],
			current: 0
		};

		this.setName = this.setName.bind(this);
		this.endTyping = this.endTyping.bind(this);
		this.goBack = this.goBack.bind(this);
		this.goNext = this.goNext.bind(this);

		request('/GetMultipleChoice', { url: this.props.match.params.url }).then(res => res.json()).then(questions => {
			this.setState({ questions });
		});
	}

	setName(event) {
		const { value } = event.target;
		this.setState({ name: { ...this.state.name, value } });
	}

	endTyping(event) {
		const { name } = this.state;
		if (event.key === 'Enter' && !name.value.match(/^\s*$/)) {
			this.setState({ name: { ...name, typingEnded: true } });
		}
	}

	setChecked(index) {
		const { questions, current } = this.state;
		const updatedQuestions = questions.slice();

		updatedQuestions[current].answers.forEach((answer, i) => {
			if (i === index) {
				answer.checked = !answer.checked;
			}
		});

		this.setState({ questions: updatedQuestions });
	}

	goBack() {
		const previous = this.state.current - 1;

		if (previous >= 0) {
			this.setState({ current: previous });
		}
	}

	goNext() {
		const { url } = this.props.match.params;
		const { questions, current } = this.state;
		const next = current + 1;

		if (next < questions.length) {
			this.setState({ current: next });
		} else {
			Modals.showConfirmModal('Confirmation des réponses',
				'En cliquant sur "Terminé", '
				+ 'vous validez l\'ensemble de vos réponses. Confirmez-vous votre choix ?')
			.then(() => {
				return request('/SaveSession', {
					url,
					session: {
						name: this.state.name.value,
						questions
					}
				})
				.then(res => res.json())
				.then(questions => this.setState({ questions, current: 0, ended: true }));
			}, () => {});
		}
	}

	buildNameInput() {
		const { value } = this.state.name;
		return (
			<Fragment>
				<label htmlFor="nameInput">Saisissez votre nom:</label>
				<Input
					id="nameInput"
					type="text"
					spellCheck="false"
					onChange={this.setName}
					onKeyDown={this.endTyping}
					value={value}
				/>
			</Fragment>
		);
	}

	buildTextNextButton() {
		const { questions, current } = this.state;

		if (current < questions.length - 1) {
			return (
				<Fragment>
					Suivant
					<i className="fas fa-arrow-right ml-3"/>
				</Fragment>
			);
		}

		return (
			<Fragment>
				Terminé
				<i className="fas fa-check ml-3"/>
			</Fragment>
		);
	}

	buildCurrentQuestion() {
		const { questions, current, ended } = this.state;

		if (questions.length) {
			const question = questions[current];
			return (
				<Fragment>
					<ReactMarkdown source={question.label} renderers={{ code: CodeRenderer }}/>
					{ question.answers.map((answer, index) => {

						const { checked, correct, label } = answer;
						const className = correct ? 'correct' : correct === false && checked ? 'incorrect' : '';

						return (
							<InputGroup className="mb-3">
								<InputGroupAddon addonType="prepend">
									<InputGroupText onClick={() => this.setChecked(index)}>
										<Input addon type="checkbox" checked={answer.checked = !!checked} readOnly/>
									</InputGroupText>
								</InputGroupAddon>
								<div className={`${className} answer form-control mr-3`} spellCheck="false">{label}</div>
							</InputGroup>
						);
					}) }
					<div className="row justify-content-around">
						<Button color="primary" className="mt-3 mb-3" onClick={this.goBack}>
							<i className="fas fa-arrow-left mr-3"/>
							Précédent
						</Button>

						{(!ended || current < questions.length - 1) &&
						<Button color="primary" className="mt-3 mb-3" onClick={this.goNext}>
							{ this.buildTextNextButton() }
						</Button>}
					</div>
				</Fragment>
			);
		}

		return null;
	}

	render() {
		const { typingEnded  } = this.state.name;

		const columns = typingEnded ? 8 : 6;

		return (
			<div className="centerVertically">
				<div className="container">
					<div className="row justify-content-center mt-3">
						<div className={`col-md-${columns} col-xs-12`}>
							{ typingEnded ? this.buildCurrentQuestion() : this.buildNameInput() }
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default StudentView;