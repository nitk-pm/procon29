import { createStore, combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import * as Store from './store';
import * as Actions from './actions';
import * as DrawerModule from './module/drawer';
import * as AppbarModule from './module/appbar';
import * as GameModule from './module/game';

let rootReducer = (state: Store.State = Store.initialState, action: Actions.T) => state;

function turnDummyReducer(
	state: Store.Turn = Store.initialState.turn,
	actions: Actions.T) {
	return state;
}

function boardDummyReducer(
	state: Store.Table = Store.initialState.board,
	action: Actions.T) {
	return state;
}

function configDummyReducer(
	state: Store.Config = Store.initialState.config,
	action: Actions.T) {
	return state;
}

function logDummyReducer(
	state: Store.Table[] = [],
	action: Actions.T) {
	return state;
}

function inputStateDummyReducer(
	state: Store.InputState = Store.initialState.inputState,
	action: Actions.T) {
	return state;
}

function histDummyReducer(
	state: Store.Table[] = [],
	action: Actions.T) {
	return state;
}

let combinedReducer = combineReducers({
	turn: turnDummyReducer,
	board: boardDummyReducer,
	drawerOpen: DrawerModule.reducer,
	config: configDummyReducer,
	log: logDummyReducer,
	inputState: inputStateDummyReducer,
	hist: histDummyReducer
});

let rootReducers = [combinedReducer, AppbarModule.reducer, GameModule.reducer];

let reducer  = rootReducers.reduce((acc, x) => reduceReducers(x, acc), rootReducer);

export const store = createStore(reducer, Store.initialState);
