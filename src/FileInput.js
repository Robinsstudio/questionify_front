import React, { Component } from 'react';

class FileInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			label: this.props.placeholder || 'Choisissez un fichier...'
		};

		this.handleChange = this.handleChange.bind(this);
		this.fireOnChange = this.fireOnChange.bind(this);
	}

	handleChange(event) {
		const files = event.target.files;
		if (files.length) {
			this.setState({ label: Array.from(files, file => file.name).join(', ') });
		} else {
			this.setState({ label: this.props.placeholder || 'Choisissez un fichier...' });
		}
		this.fireOnChange(event);
	}

	fireOnChange(event) {
		const { onChange } = this.props;
		if (typeof onChange === 'function') {
			onChange(event);
		}
	}

	render() {
		return (
			<div className="CustomInput custom-input-file mb-3">
				<input {...this.props} className={`custom-file-input ${this.props.className || ''}`} onChange={this.handleChange} type="file"/>
				<label className="custom-file-label" htmlFor={this.props.id}>{this.state.label}</label>
			</div>
		);
	}
}

export default FileInput;