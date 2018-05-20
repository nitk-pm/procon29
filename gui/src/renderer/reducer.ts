import { createStore, combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import * as Store from './store';
import * as Actions from './actions';

import * as BoardModule from './modules/board';
import * as HistModule  from './modules/history';
import * as DrawerModule from './modules/drawer';

let histDummyReducer = (hist: Store.BoardState[] = Store.initialState.hist, action: Actions.T) => hist;

let reducer = reduceReducers(
	HistModule.reducer,
	combineReducers(
		{
			board: BoardModule.reducer,
			hist: histDummyReducer,
			drawerOpen: DrawerModule.reducer
		}
));

export const store = createStore(reducer, Store.initialState);
