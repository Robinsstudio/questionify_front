import React, { Component } from 'react';

class AutoFocusInput extends Component {
	constructor(props) {
		super(props);
		this.input = React.createRef();
		this.handleBlur = this.handleBlur.bind(this);
	}

	handleBlur() {
		this.props.onStopEditing(this.input.current.value);
	}

	handleKeyDown(event) {
		if (event.key === 'Enter') {
			this.props.onStopEditing(this.input.current.value);
		} else if (event.key === 'Escape') {
			this.props.onStopEditing(null);
		}
	}

	componentDidMount() {
		const input = this.input.current;
		input.value = this.props.value;
		input.select();
		input.focus();
	}

	render() {
		return <input type='text' spellCheck='false' onBlur={this.handleBlur} onKeyDown={e => this.handleKeyDown(e)} ref={this.input}/>
	}
}

export default AutoFocusInput;