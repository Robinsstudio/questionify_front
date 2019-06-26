import React, { Component } from 'react';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import MultipleChoiceView from './MultipleChoiceView';

class SessionView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			multipleChoiceView: {
				visible: false,
				questions: [],
				current: 0,
				editable: false
			}
		};

		this.handleCurrentQuestionChanged = this.handleCurrentQuestionChanged.bind(this);
		this.handleDone = this.handleDone.bind(this);
	}

	updateMultipleChoiceView(data) {
		this.setState({
			multipleChoiceView: {
				...this.state.multipleChoiceView,
				...data
			}
		});
	}

	handleCurrentQuestionChanged(current) {
		this.updateMultipleChoiceView({ current });
	}

	handleDone() {
		this.updateMultipleChoiceView({ visible: false, current: 0 });
	}

	render() {
		const {
			props: { visible, sessions, updateSessionView },
			state: { multipleChoiceView }
		} = this;

		return (
			<div id="session" className={`view ${visible ? 'visible' : ''}`}>
				<div id="sessionHeader" className="header">
					<span className="ml-3">Sessions</span>
					<Button color="secondary" className="mr-3" onClick={() => updateSessionView({ visible: false })}>Fermer</Button>
				</div>

				<div className="scrollable">
					<ListGroup className="m-3">
						{ sessions.map(({name, questions}) => {
							return (
								<ListGroupItem
									onClick={() => this.updateMultipleChoiceView({ visible: true, questions })}
									tag="a"
									action
								>{name}</ListGroupItem>
							);
						}) }
					</ListGroup>

					{ multipleChoiceView.visible &&
						<div className="centerVertically" >
							<div className="container">
								<div className="row justify-content-center mt-3">
									<div className={`col-md-8 col-xs-12`}>
										<MultipleChoiceView
											{ ...multipleChoiceView }
											onCurrentQuestionChanged={this.handleCurrentQuestionChanged}
											onDone={this.handleDone}
										/>
									</div>
								</div>
							</div>
						</div>
					}
				</div>
			</div>
		);
	}
}

export default SessionView;