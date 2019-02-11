import React, { Component } from 'react';
import File from './File';
import ContextMenu from './ContextMenu';
import Modals from './Modals';
import request from './request';

class ExplorerView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			folder: [],
			files: [],
			contextMenu: {}
		};

		this.createFolder = this.createFolder.bind(this);
		this.requestFolder = this.requestFolder.bind(this);
		this.handleContextMenu = this.handleContextMenu.bind(this);
		this.hideContextMenu = this.hideContextMenu.bind(this);
		this.requestFolder = this.requestFolder.bind(this);
		
		this.requestFolder();
	}

	createFolder(name) {
		request('FolderCreate', { folder: this.state.folder.concat(name) }).then( () => this.requestFolder() );
	}
	
	requestFolder(folder = this.state.folder) {
		request('FolderRequest', { folder }).then(res => res.json()).then( ({folder, files}) => this.setState({folder, files}) );
	}

	goBack(howMany) {
		const folder = this.state.folder;
		this.requestFolder( (howMany <= folder.length) ? folder.slice(0, folder.length - howMany) : folder );
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
		const { folder } = this.state;
		return items.concat(
			{ label: 'Nouveau dossier', onClick: () => {
				Modals.showPromptModal('Nouveau dossier', 'Entrez un nom de dossier ici...').then(name => this.createFolder(name)).catch(() => {});
			}},
			{ label: 'Nouvelle question', onClick: () => Modals.showQuestionModal({ question: '', answers: [] }).then(quest => {
				request('QuestionSave', { folder, file: quest.name, question: JSON.stringify(quest) }).then( () => this.requestFolder() );
			}).catch(() => {}) }
		);
	}

	hideContextMenu() {
		this.setState({ contextMenu: { visible: false } });
	}
  
	buildFileItem(file) {
		const { requestFolder, handleContextMenu, state: { folder } } = this;
		return React.createElement(File, { folder, file, requestFolder, handleContextMenu });
	}
	
	render() {
		const { contextMenu } = this.state;
		return (
			<div id='explorer'>
				<div id='path'>
					{[].concat(...['Explorer', ...this.state.folder].map((folder, index, self) => {
						return [
							<span onClick={() => this.goBack(self.length - index - 1)}>{folder}</span>,
							<div/>
						]
					})).slice(0, -1)}
				</div>

				<div id='files' onClick={this.hideContextMenu}  onContextMenu={this.handleContextMenu}>
					{this.state.files.map(file => this.buildFileItem(file))}
				</div>

				{contextMenu.visible && <ContextMenu {...contextMenu}/>}
			</div>
		);
	}
}

export default ExplorerView;