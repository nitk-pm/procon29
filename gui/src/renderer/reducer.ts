import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reduceReducers from 'reduce-reducers';
import * as Store from './store';
import * as Actions from './actions';
import * as AppModule from './module/app';
import * as AppbarModule from './module/appbar';
import * as GameModule from './module/game';
import * as ServerModule from './module/server';
import * as TimeModule from './module/time';
import { rootSaga } from './saga/server';
import * as Redux from 'redux';

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
let combinedReducer = combinePartialReducers({
	server: ServerModule.reducer,
	time: TimeModule.reducer
},
	Store.initialState
);

let rootReducers = [combinedReducer, AppModule.reducer, AppbarModule.reducer, GameModule.reducer];

let reducer  = rootReducers.reduce((acc, x) => reduceReducers(x, acc));

let sagaMiddleware = createSagaMiddleware();

export const store = createStore(reducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);
