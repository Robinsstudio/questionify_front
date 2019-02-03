import React, { Component, Fragment } from 'react';
import ExplorerView from './ExplorerView';
import Modals from './Modals';

class App extends Component {
	render() {
		return (
			<Fragment>
				<ExplorerView/>
				{Modals.get()}
			</Fragment>
		);
	}
}

export default App;
