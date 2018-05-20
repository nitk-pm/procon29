import { createStore, combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import * as Store from './store';
import * as Actions from './actions';

import * as BoardModule from './modules/board';
import * as DrawerModule from './modules/drawer';

let reducer = combineReducers({
	game: BoardModule.reducer,
	drawerOpen: DrawerModule.reducer
});

export const store = createStore(reducer, Store.initialState);
