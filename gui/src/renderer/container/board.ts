import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as Store from '../store';
import * as Actions from '../actions';
import * as BoardComponent from '../components/board';
import * as BoardModule from '../modules/board';
import * as Logic from '../logic/igokabaddi';

export class ActionDispatcher {
	dispatch: Redux.Dispatch<Actions.T>;

	constructor (dispatch: Redux.Dispatch<Actions.T>) {
		this.dispatch = dispatch;
	}

	click(pos: Logic.Pos) {
		return this.dispatch(BoardModule.clickSquare(pos));
	}
}

export default ReactRedux.connect(
	(state: Store.State) => ({board: state.game.board}),
	(dispatch: Redux.Dispatch<Actions.T>) => ({actions: new ActionDispatcher(dispatch)})
)(BoardComponent.Board);
