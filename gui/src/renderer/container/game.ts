import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as Logic from '../logic/igokabaddi';
import * as Store from '../store';
import * as GameComponent from '../components/game';

export class ActionDispatcher {
	constructor(private dispatch: (action: Store.Actions) => void) {}
}

export default ReactRedux.connect(
	(state: Store.State) => ({board: state.board}),
	(dispatch: Redux.Dispatch<Store.Actions>) => ({actions: new ActionDispatcher(dispatch)})
)(GameComponent.Game);
