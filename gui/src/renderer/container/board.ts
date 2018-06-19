import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as Store from '../store';
import * as Actions from '../actions';
import * as BoardComponent from '../components/board';

export class ActionDispatcher {
	dispatch: Redux.Dispatch<Actions.T>;

	constructor (dispatch: Redux.Dispatch<Actions.T>) {
		this.dispatch = dispatch;
	}
}

export default ReactRedux.connect(
	(state: Store.State) => ({
		table: state.hist[state.hist.length-1]
	}),
	(dispatch: Redux.Dispatch<Actions.T>) => ({actions: new ActionDispatcher(dispatch)})
)(BoardComponent.Board);
