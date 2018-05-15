import { createStore, combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import * as Store from './store'

import * as BoardModule from './modules/board';
import * as HistModule  from './modules/history';

let histDummyReducer = (hist: Store.SquareState[][][] = Store.initialState.hist, action: Store.Actions) => hist;

let reducer = reduceReducers(HistModule.reducer, combineReducers({ table: BoardModule.reducer, hist: histDummyReducer}));

export const store = createStore(reducer, Store.initialState);
