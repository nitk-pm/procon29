import { createStore, combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import * as Store from './store';
import * as Actions from './actions';

let reducer = (state: Store.State = Store.initialState, action: Actions.T) => state;

export const store = createStore(reducer, Store.initialState);
