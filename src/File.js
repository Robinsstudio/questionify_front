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
				request('QuestionSave', { file: folder.concat(quest.name), question: JSON.stringify(quest) }).then( () => requestFolder() );
			}).catch(() => {});
		}
	}

	remove() {
		const { requestFolder, folder, file: { name } } = this.props;
		request('FileRemove', { file: folder.concat(name) }).then( () => requestFolder() );
	}

	rename(name) {
		const { requestFolder, folder, file } = this.props;
		request('FileRename', { file: folder.concat(file.name), name }).then( () => requestFolder() );
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
		const { name } = this.props.file;
		this.props.handleContextMenu(event, [
			{ label: 'Ouvrir', onClick: this.open },
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