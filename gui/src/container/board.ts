import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as Store from '../store';
import * as BoardComponent from '../components/board';
import * as BoardModule from '../modules/board';
import * as Logic from '../logic/igokabaddi';

export class ActionDispatcher {
	dispatch: Redux.Dispatch<Store.Actions>;

	constructor (dispatch: Redux.Dispatch<Store.Actions>) {
		this.dispatch = dispatch;
	}

	click(pos: Logic.Pos) {
		return this.dispatch(BoardModule.clickSquare(pos));
	}
}

export default ReactRedux.connect(
	(state: Store.State) => ({board: state.board}),
	(dispatch: Redux.Dispatch<Store.Actions>) => ({actions: new ActionDispatcher(dispatch)})
)(BoardComponent.Board);
