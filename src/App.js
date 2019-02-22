import React, { Component } from 'react';
import ExplorerView from './ExplorerView';
import Editor from './Editor';
import Modals from './Modals';
import request from './request';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			folder: [],
			files: [],
			editor: {
				visible: false,
				questions: []
			}
		};

		this.requestFolder = this.requestFolder.bind(this);
		this.create = this.create.bind(this);
		this.edit = this.edit.bind(this);
		this.save = this.save.bind(this);
		this.closeEditor = this.closeEditor.bind(this);
		this.updateEditor = this.updateEditor.bind(this);
		this.refresh = this.refresh.bind(this);
	}

	requestFolder(folder = this.state.folder) {
		request('FolderRequest', { folder }).then(res => res.json()).then( ({folder, files}) => this.setState({folder, files}) );
	}

	create() {
		this.setState({
			editor: {
				visible: true,
				questions: []
			}
		});
	}

	edit(files, file) {
		request('FilesRequest', { files }).then(res => res.json()).then(questions => {
			this.setState({
				editor: {
					file,
					visible: true,
					questions: questions.map((quest, i) => {
						return { ...quest.data, file: files[i] };
					})
				}
			});
		});
	}

	updateEditor(editor) {
		this.setState({ editor });
	}

	save(file) {
		request('FileSave', { file, json: JSON.stringify({ type: 'qcm', questions: this.state.editor.questions.map(quest => quest.file) }) }).then(this.closeEditor);
	}

	closeEditor() {
		this.setState((state) => {
			return { editor: { ...state.editor, visible: false } }
		}, () => this.refresh() );
	}

	refresh() {
		const { editor } = this.state;
		if (editor.visible) {
			this.edit(editor.questions.map(quest => quest.file), editor.file);
		}
		this.requestFolder();
	}

	render() {
		const { folder, files, editor } = this.state;
		return (
			<div id="app">
				<ExplorerView editing={editor.visible} folder={folder} files={files} requestFolder={this.requestFolder} create={this.create} edit={this.edit} refresh={this.refresh}/>
				{/*<Editor editor={editor} folder={folder} update={this.updateEditor} save={this.save} closeEditor={this.closeEditor}/>*/}
				{Modals.get()}
			</div>
		);
	}
}

export default App;