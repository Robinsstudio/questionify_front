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
		const { edit, requestFolder, refresh, file } = this.props;
		if (file.type === 'folder') {
			requestFolder(file._id);
		} else if (file.type === 'question') {
			Modals.showQuestionModal(file).then(quest => {
				request('SaveQuestion', quest).then( () => refresh() );
			}).catch(() => {});
		} else if (file.type === 'qcm') {
			edit(file);
		}
	}

	remove() {
		const { refresh, file: { _id } } = this.props;
		request('Delete', { _id }).then( () => refresh() );
	}

	rename(name) {
		const { refresh, file: { _id } } = this.props;
		request('Rename', { _id, name }).then( () => refresh() );
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

	copyToClipboard(value) {
		const hiddenElement = document.createElement('input');
		hiddenElement.style.background = 'transparent';
		hiddenElement.value = value;

		document.body.appendChild(hiddenElement);
		hiddenElement.select();
		document.execCommand('copy');
		document.body.removeChild(hiddenElement);
	}

	handleContextMenu(event) {
		const {
			file: { name, type, url, sessions, _id },
			copyFile,
			refresh,
			updateSessionView
		} = this.props;

		const sharedLinkItem = url ? {
			label: 'Copier le lien partageable',
			onClick: () => this.copyToClipboard(`${window.location.href}qcm/${url}`)
		} : {
			label: 'Générer un lien partageable',
			onClick: () => request('/GenerateLink', { _id }).then(() => refresh())
		};

		const resultsItem = sessions && sessions.length ? {
			label: 'Consulter les résultats',
			onClick: () => updateSessionView({ visible: true, sessions })
		} : [];

		const menuItems = [
			{ label: 'Ouvrir', onClick: this.open },
			{ label: 'Renommer', onClick: this.startRenaming },
			{
				label: 'Supprimer',
				onClick: () => Modals.showConfirmModal('Supprimer', `Voulez-vous vraiment supprimer ${name} ?`)
					.then(this.remove).catch(() => {})
			},
			{ label: 'Copier', onClick: () => copyFile(_id) }
		]
		.concat(type === 'qcm' ? sharedLinkItem : [])
		.concat(type === 'qcm' ? resultsItem : []);

		this.props.handleContextMenu(event, menuItems);
	}

	handleDragStart(event) {
		const { file } = this.props;
		event.dataTransfer.setData(file.type, JSON.stringify(file));
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