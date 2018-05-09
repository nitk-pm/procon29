import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as Logic from '../logic/igokabaddi';
import * as Store from '../store';
import * as Square from '../components/square';
import * as Board from '../modules/board';

export class ActionDispatcher {
	constructor(private dispatch: (action: Store.Actions) => void) {}

	public click(pos: Logic.Pos) {
		return this.dispatch(Board.clickSquare(pos));
	}
}

export default ReactRedux.connect(
	(state: Store.IgokabaddiState) => ({}),
	(dispatch: Redux.Dispatch<Store.Actions>) => ({actions: new ActionDispatcher(dispatch)})
)(Square.Square);
