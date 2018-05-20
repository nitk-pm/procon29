import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as Logic from '../logic/igokabaddi';
import * as Store from '../store';
import * as GameComponent from '../components/game';
import * as Actions from '../actions';

export class ActionDispatcher {
	constructor(private dispatch: (action: Actions.T) => void) {}
}

export default ReactRedux.connect(
	(state: Store.State) => ({board: state.game.board}),
	(dispatch: Redux.Dispatch<Actions.T>) => ({actions: new ActionDispatcher(dispatch)})
)(GameComponent.Game);
