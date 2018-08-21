import * as Redux from 'redux';
import createSagaMiddleware from 'redux-saga';
import reduceReducers from 'reduce-reducers';
import * as Store from './store';
import * as Actions from './actions';

import * as AppModule from './module/app';
import * as DrawerModule from './module/drawer';
import * as BoardModule from './module/board';

import saveSaga from './saga/save';

// TODO initialStateに含まれてないキーのreducerが来たら例外
function combinePartialReducers(reducers: any, initialState: any) {
	var newReducers: {[key: string]: any} = {};
	Object.keys(initialState)
		.forEach(key => {
			let defaultState: any = initialState[key];
			if (typeof reducers[key] === 'undefined') {
				newReducers[key] = (state:any, action:any) => {
					if (state == null) return defaultState;
					return state;
				}
			}
			else {
				newReducers[key] = (state:any, action:any) => {
					if (state == null) return defaultState;
					return reducers[key](state, action);
				}
			}
		});
	return Redux.combineReducers(newReducers);
}

let sagaMiddleware = createSagaMiddleware();

const reducer = reduceReducers(
	AppModule.reducer,
	combinePartialReducers(
		{
			drawerOpen: DrawerModule.reducer,
			tbl: BoardModule.reducer
		},
		Store.initialState
	)
);

export const store = Redux.createStore(reducer, Redux.applyMiddleware(sagaMiddleware));

sagaMiddleware.run(saveSaga);
