import React, { Component } from 'react';

class AutoCompleteInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hints: [],
			activeHint: -1
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.clearHints = this.clearHints.bind(this);
	}

	clearHints() {
		this.setState({ hints: [], activeHint: -1 });
	}

	handleChange(event) {
		const { value } = event.target;
		const { loadHints } = this.props;
		this.setState({ activeHint: -1, initialValue: value });
		loadHints(value).then(hints => this.setState({ hints }));
		this.fireOnChange(value);
	}

	handleKeyDown(event) {
		if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
			const { props: { value }, state: { hints, activeHint, initialValue } } = this;
			const newActiveHint = (event.key === 'ArrowDown') ?
				Math.min(activeHint + 1, hints.length - 1) : Math.max(activeHint - 1, -1);

			this.setState({
				activeHint: newActiveHint,
				initialValue: activeHint === -1 ? value : initialValue
			}, () => {
				const { hints, activeHint, initialValue } = this.state;
				this.fireOnChange(activeHint === -1 ? initialValue : hints[activeHint]);
			});

			event.preventDefault();
		}
		this.fireOnKeyDown(event);
	}

	handleMouseEnter(index) {
		const { hints } = this.state;
		this.setState({ activeHint: index });
		this.fireOnChange(hints[index]);
	}

	handleBlur(event) {
		this.clearHints();
		this.fireOnBlur(event);
	}

	forwardProps() {
		const selfProps = [ 'loadHints' ];
		const forwardingProps = {};

		Object.entries(this.props).forEach(prop => {
			if (!selfProps.includes(prop[0])) {
				forwardingProps[prop[0]] = prop[1];
			}
		});

		return forwardingProps;
	}

	fireOnChange(value) {
		const { onChange } = this.props;
		if (typeof onChange === 'function') {
			onChange(value);
		}
	}

	fireOnKeyDown(event) {
		const { onKeyDown } = this.props;
		if (typeof onKeyDown === 'function') {
			onKeyDown(event);
		}
	}

	fireOnBlur(event) {
		const { onBlur } = this.props;
		if (typeof onBlur === 'function') {
			onBlur(event);
		}
	}

	render() {
		const { props: { value }, state: { hints, activeHint } } = this;
		return (
			<div className="autocomplete">
				<input {...this.forwardProps()}
					value={value}
					onChange={this.handleChange}
					onKeyDown={this.handleKeyDown}
					onBlur={this.handleBlur}
					spellCheck="false"
				/>
				{ hints.length > 0 &&
					<div className="menu">
						{ hints.map((hint, index) => {
							return (
								<div
									className={(index === activeHint) ? 'active' : ''}
									onMouseEnter={() => this.handleMouseEnter(index)}
								>{hint}</div>
							);
						}) }
					</div>
				}
			</div>
		);
	}
}

export default AutoCompleteInput;