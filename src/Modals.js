import React, { Component, Fragment } from 'react';
import PromptModal from './PromptModal';
import ConfirmModal from './ConfirmModal';

class Modals extends Component {
	constructor(props) {
		super(props);
		this.state = {
			promptModal: {},
			confirmModal: {},
		};

		this.updatePromptModal = this.updatePromptModal.bind(this);
		this.hidePromptModal = this.hidePromptModal.bind(this);
		this.hideConfirmModal = this.hideConfirmModal.bind(this);
	}

	showPromptModal(title, placeholder, promise) {
		this.setState({ promptModal: { open: true, title, placeholder, value: '', promise } });
	}

	updatePromptModal(value) {
		this.setState((state) => {
			return { promptModal: { ...state.promptModal, value } };
		});
	}

	hidePromptModal() {
		this.setState((state) => {
			return { promptModal: { ...state.promptModal, open: false } };
		});
	}

	showConfirmModal(title, body, promise) {
		this.setState({ confirmModal: { open: true, title, body, promise } });
	}

	hideConfirmModal() {
		this.setState((state) => {
			return { confirmModal: { ...state.confirmModal, open: false } };
		});
	}

	render() {
		const { promptModal, confirmModal } = this.state;
		return (
			<Fragment>
				<PromptModal
					open={promptModal.open} title={promptModal.title} placeholder={promptModal.placeholder} value={promptModal.value}
					update={this.updatePromptModal} hide={this.hidePromptModal} promise={promptModal.promise}
				/>

				<ConfirmModal
					open={confirmModal.open} title={confirmModal.title} body={confirmModal.body} hide={this.hideConfirmModal} promise={confirmModal.promise}
				/>
			</Fragment>
		);
	}
}

let component;
const modals = <Modals ref={(comp) => component = comp}/>

export default {
	get: () => modals,
	showPromptModal: (title, placeholder) => new Promise((resolve, reject) => component.showPromptModal(title, placeholder, { resolve, reject })),
	showConfirmModal: (title, body) => new Promise((resolve, reject) => component.showConfirmModal(title, body, { resolve, reject })),
}