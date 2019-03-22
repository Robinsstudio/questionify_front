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
		this.handleDragStart = this.handleDragStart.bind(this);
	}

	open() {
		const { edit, requestFolder, refresh, folder, file: { type, name, data } } = this.props;
		if (type === 'folder') {
			requestFolder(folder.concat(name));
		} else if (type === 'question') {
			Modals.showQuestionModal({ ...data, name }).then(quest => {
				request('FileSave', { file: folder.concat(quest.name), json: JSON.stringify(quest) }).then( () => refresh() );
			}).catch(() => {});
		} else if (type === 'qcm') {
			edit(data.questions, folder.concat(name));
		}
	}

	remove() {
		const { refresh, folder, file } = this.props;
		request('FileRemove', { file: folder.concat(file.name) }).then( () => refresh() );
	}

	rename(name) {
		const { refresh, folder, file } = this.props;
		request('FileRename', { file: folder.concat(file.name), name }).then( () => refresh() );
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

	handleDragStart(event) {
		const { folder, file: { name, type, data} } = this.props;
		if (type === 'question') {
			event.dataTransfer.setData('question', JSON.stringify({ ...data, file: folder.concat(name) }));
		}
	}

	render() {
		const { props: { file: { type, name } }, state: { renaming } } = this;
		return (
			<div className={`file ${renaming ? 'renaming' : ''}`} onDoubleClick={this.open} onContextMenu={this.handleContextMenu} onDragStart={this.handleDragStart} draggable>
				<div className={type}/>
				<div className="fileName">
					{(renaming) ? <AutoFocusInput value={name} onStopEditing={this.stopRenaming}/> : name}
				</div>
			</div>
		);
	}
}

export default File;