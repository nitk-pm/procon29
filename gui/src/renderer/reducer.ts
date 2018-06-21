import { createStore, combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import * as Store from './store';
import * as Actions from './actions';
import * as DrawerModule from './module/drawer';

let rootReducer = (state: Store.State = Store.initialState, action: Actions.T) => state;

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
	drawerOpen: DrawerModule.reducer,
	config: configDummyReducer,
	log: logDummyReducer,
	inputState: inputStateDummyReducer,
	hist: histDummyReducer
});

let reducer = reduceReducers(rootReducer, combinedReducer);

export const store = createStore(reducer, Store.initialState);
