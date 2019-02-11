import React, { Component } from 'react';
import AutoFocusInput from './AutoFocusInput';
import Modals from './Modals';
import request from './request';

class File extends Component {
	constructor(props) {
		super(props);
		this.state = { renaming: false };

		this.open = this.open.bind(this);
		this.rename = this.rename.bind(this);
		this.remove = this.remove.bind(this);
		this.startRenaming = this.startRenaming.bind(this);
		this.stopRenaming = this.stopRenaming.bind(this);
		this.handleContextMenu = this.handleContextMenu.bind(this);
	}

	open() {
		const { requestFolder, folder, file: { type, name, data } } = this.props;
		if (type === 'folder') {
			requestFolder(folder.concat(name));
		} else if (type === 'question') {
			Modals.showQuestionModal({ ...data, name }).then(quest => {
				request('QuestionSave', { folder, file: quest.name, question: JSON.stringify(quest) }).then( () => requestFolder() );
			}).catch(() => {});
		}
	}

	remove() {
		const { requestFolder, folder, file: { name } } = this.props;
		request('FileRemove', { folder, file: name }).then( () => requestFolder() );
	}

	rename(name) {
		const { requestFolder, folder, file } = this.props;
		request('FileRename', { folder, file: file.name, name }).then( () => requestFolder() );
	}

	startRenaming() {
		this.setState({ renaming: true });
	}

	stopRenaming(newName) {
		if (newName) {
			this.rename(newName);
		}
		this.setState({ renaming: false });
	}

	handleContextMenu(event) {
		const { folder, file: { name }, requestFolder } = this.props;
		this.props.handleContextMenu(event, [
			{ label: 'Ouvrir', onClick: () => requestFolder(folder.concat(name)) },
			{ label: 'Renommer', onClick: this.startRenaming },
			{ label: 'Supprimer', onClick: () => Modals.showConfirmModal('Supprimer', `Voulez-vous vraiment supprimer ${name} ?`).then(this.remove).catch(() => {}) }
		]);
	}

	render() {
		const { props: { file: { type, name } }, state: { renaming } } = this;
		return (
			<div className={type} onDoubleClick={this.open} onContextMenu={this.handleContextMenu}>
				<div className='fileName'>
					{(renaming) ? <AutoFocusInput value={name} onStopEditing={this.stopRenaming}/> : <span>{name}</span>}
				</div>
			</div>
		);
	}
}

export default File;