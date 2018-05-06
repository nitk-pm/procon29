import * as Redux from 'redux';
import * as Logic from '../logic/igokabaddi';
import * as Reducer from '../store';

import { connect } from 'react-redux';
import { Game } from '../components/game';
import { clickSquare } from '../modules/clickSquare';
import { endTurn } from '../modules/endTurn';

export class ActionDispatcher {
	constructor(private dispatch: (action: Reducer.Actions) => void) {}
}

export default connect(
	(state: Reducer.IgokabaddiState) => ({board: state.board, turn: state.turn}),
	(dispatch: Redux.Dispatch<Reducer.Actions>) => ({actions: new ActionDispatcher(dispatch)})
)(Game);
