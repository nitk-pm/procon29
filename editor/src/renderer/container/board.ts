import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';

import * as Store from '../store';
import * as Actions from '../actions';

import BoardComponent from '../component/board';

export class ActionDispatcher {
	constructor(private dispatch: (action: Actions.T) => void) {}
}

export default ReactRedux.connect(
	(state: Store.State) => ({board: state.tbl}),
	(dispatch: Redux.Dispatch<Actions.T>) => ({actions: new ActionDispatcher(dispatch)})
)(BoardComponent);
