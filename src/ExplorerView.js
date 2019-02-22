import React, { Component } from 'react';
import File from './File';
import ContextMenu from './ContextMenu';
import Modals from './Modals';
import request from './request';

class ExplorerView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			contextMenu: { visible: false }
		};

		this.createFolder = this.createFolder.bind(this);
		this.handleContextMenu = this.handleContextMenu.bind(this);
		this.hideContextMenu = this.hideContextMenu.bind(this);
		
		this.props.requestFolder();
	}

	createFolder(name) {
		const { folder, requestFolder } = this.props;
		request('FolderCreate', { folder: folder.concat(name) }).then( () => requestFolder() );
	}

	goBack(howMany) {
		const { folder, requestFolder } = this.props;
		requestFolder( (howMany <= folder.length) ? folder.slice(0, folder.length - howMany) : folder );
	}

	handleContextMenu(event, items = []) {
		const { pageX, pageY, screenX, screenY } = event;
		const x = screenX - window.screenX;
		const y = screenY - window.screenY;
		const offset = { x: pageX - x, y: pageY - y };
		this.setState({ contextMenu: { visible: true, x, y, offset, items: this.buildMenuItems(items), onClick: this.hideContextMenu } });
		event.stopPropagation();
		event.preventDefault();
	}

	buildMenuItems(items) {
		const { create, folder, refresh } = this.props;
		return items.concat(
			{ label: 'Nouveau dossier', onClick: () => {
				Modals.showPromptModal('Nouveau dossier', 'Entrez un nom de dossier ici...').then(name => this.createFolder(name)).catch(() => {});
			}},
			{ label: 'Nouvelle question', onClick: () => Modals.showQuestionModal({ question: '', answers: [] }).then(quest => {
				request('FileSave', { file: folder.concat(quest.name), json: JSON.stringify(quest) }).then( () => refresh() );
			}).catch(() => {}) },
			{ label: 'Nouveau QCM', onClick: () => create() }
		);
	}

	hideContextMenu() {
		this.setState({ contextMenu: { visible: false } });
	}
  
	buildFileItem(file) {
		const { handleContextMenu, props: { folder, edit, requestFolder, refresh } } = this;
		return <File folder={folder} file={file} edit={edit} requestFolder={requestFolder} refresh={refresh} handleContextMenu={handleContextMenu}/>
	}
	
	render() {
		const { props: { editing }, state: { contextMenu } } = this;
		return (
			<div id='explorer' className={editing ? 'editing' : ''}>
				<div id='path' className="header">
					{[].concat(...['Explorer', ...this.props.folder].map((folder, index, self) => {
						return [
							<span onClick={() => this.goBack(self.length - index - 1)}>{folder}</span>,
							<div/>
						]
					})).slice(0, -1)}
				</div>

				<div id='files' onClick={this.hideContextMenu} onContextMenu={this.handleContextMenu}>
					{this.props.files.map(file => this.buildFileItem(file))}
				</div>

				{contextMenu.visible && <ContextMenu {...contextMenu}/>}
			</div>
		);
	}
}

export default ExplorerView;