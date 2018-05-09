import { createStore, combineReducers } from 'redux';
import * as EndTurn from './modules/turn';
import * as ClickSquare from './modules/board';
import * as Store from './store'

let reducer = combineReducers({
	turn: EndTurn.reducer,
	board: ClickSquare.reducer
});

export const store = createStore(reducer, Store.initialState);
