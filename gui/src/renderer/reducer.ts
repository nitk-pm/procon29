import { createStore, combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import * as Store from './store';
import * as Actions from './actions';
import * as AppbarModule from './module/appbar';
import * as GameModule from './module/game';

let rootReducer = (state: Store.State = Store.initialState, action: Actions.T) => state;

function inDialogDummyReducer(
	state = Store.initialState.inDialog,
	action: Actions.T) {
	return state;
}

function configDummyReducer(
	state = Store.initialState.config,
	action: Actions.T) {
	return state;
}

function inputStateDummyReducer(
	state = Store.initialState.inputState,
	action: Actions.T) {
	return state;
}

function histDummyReducer(
	state = Store.initialState.hist,
	action: Actions.T) {
	return state;
}

function serverDummyReducer(
	state = Store.initialState.server,
	action: Actions.T) {
	return state;
}

function boardDummyReducer(
	state = Store.initialState.board,
	action: Actions.T) {
	return state;
}

function socketDummyReducer(
	state = Store.initialState.socket,
	action: Actions.T) {
	return state;
}

let combinedReducer = combineReducers({
	inDialog: inDialogDummyReducer,
	config: configDummyReducer,
	board: boardDummyReducer,
	hist: histDummyReducer,
	inputState: inputStateDummyReducer,
	server: serverDummyReducer,
	socket: socketDummyReducer
});

let rootReducers = [combinedReducer, AppbarModule.reducer, GameModule.reducer];

let reducer  = rootReducers.reduce((acc, x) => reduceReducers(x, acc), rootReducer);

export const store = createStore(reducer, Store.initialState);
