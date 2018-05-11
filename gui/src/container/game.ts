import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as Logic from '../logic/igokabaddi';
import * as Store from '../store';
import * as GameComponent from '../components/game';
import * as TurnModule from '../modules/turn';

export class ActionDispatcher {
	constructor(private dispatch: (action: Store.Actions) => void) {}

	endTurn() {
		this.dispatch(TurnModule.endTurn());
	}
}

export default ReactRedux.connect(
	(state: Store.IgokabaddiState) => ({board: state.board, turn: state.turn}),
	(dispatch: Redux.Dispatch<Store.Actions>) => ({actions: new ActionDispatcher(dispatch)})
)(GameComponent.Game);
