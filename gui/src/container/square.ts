import * as Redux from 'redux';
import * as Logic from '../logic/igokabaddi';
import * as Reducer from '../store';

import { connect } from 'react-redux';
import { Square } from '../components/square';
import { clickSquare } from '../modules/clickSquare';
import { endTurn } from '../modules/endTurn';

export class ActionDispatcher {
	constructor(private dispatch: (action: Reducer.Actions) => void) {}

	public click(pos: Logic.Pos) {
		return this.dispatch(clickSquare(pos));
	}
}

export default connect(
	(state: Reducer.IgokabaddiState) => ({}),
	(dispatch: Redux.Dispatch<Reducer.Actions>) => ({actions: new ActionDispatcher(dispatch)})
)(Square);
