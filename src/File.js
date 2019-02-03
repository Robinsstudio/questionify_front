import React, { Component } from 'react';

class File extends Component {
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

export default File;