import React, { Component } from 'react';

class TagInput extends Component {
	constructor(props) {
		super(props);
		this.state = { input: '' };

		this.add = this.add.bind(this);
		this.remove = this.remove.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
	}

	add(tag) {
		const { props: { tags, onChange } } = this;
		this.setState({ input: '' }, () => onChange(tags.concat(tag)) );
	}

	remove(index) {
		const { props: { tags, onChange } } = this;
		onChange(tags.filter((_, i) => i !== index));
	}

	handleChange(event) {
		this.setState({ input: event.target.value.replace(/\s/g, '') });
	}

	handleKeyDown(event) {
		const { props: { tags }, state: { input } } = this;
		if (input.length && [' ', 'Enter'].includes(event.key)) {
			this.add(event.target.value);
			event.preventDefault();
		} else if (!input.length && event.key === 'Backspace') {
			this.remove(tags.length - 1);
			event.preventDefault();
		}
	}

	render() {
		const { props: { tags }, state: { input } } = this;
		return (
			<div className="form-control">
				{ tags.map((tag, index) => {
					return (
						<div className="bg-success tag mr-2">
							<span>{tag}</span>
							<span className="removeTag ml-2" onClick={() => this.remove(index)}>&times;</span>
						</div>
					);
				}) }
				<input autoFocus placeholder="Ajouter un tag..." value={input} onChange={this.handleChange} onKeyDown={this.handleKeyDown} style={{ border: 'none', outline: 'none' }}/>
			</div>
		);
	}
}

export default TagInput;