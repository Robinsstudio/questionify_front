const request = (url, body) => {
	return fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
}

const requestJSON = (url, body) => request(url, body).then(res => res.json());

class ExplorerView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			folder: [],
			files: [],
		};

		this.requestFolder = this.requestFolder.bind(this);
		
		this.requestFolder();
	}
	
	requestFolder(folder = this.state.folder) {
		requestJSON('FolderRequest', { folder }).then( ({folder, files}) => this.setState({folder, files}) );
	}

	goBack(howMany) {
		const folder = this.state.folder;
		this.requestFolder( (howMany <= folder.length) ? folder.slice(0, folder.length - howMany) : folder );
	}
  
	buildFileItem(file) {
		const { requestFolder, state: { folder } } = this;
		return React.createElement(File, { folder, file, requestFolder });
	}
	
	render() {
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

				<div id='files'>
					{this.state.files.map(file => this.buildFileItem(file))}
				</div>
			</div>
		);
	}
}

class File extends React.Component {
	constructor(props) {
		super(props);

		this.open = this.open.bind(this);
	}

	open() {
		const { requestFolder, folder, file } = this.props;
		if (file.type === 'folder') {
			requestFolder(folder.concat(file.name));
		}
	}

	render() {
		const { type, name } = this.props.file;
		return (
			<div className={type} onDoubleClick={this.open}>
				<div className='fileName'><span>{name}</span></div>
			</div>
		);
	}
}

ReactDOM.render(<ExplorerView/>, document.getElementById('app-root'));