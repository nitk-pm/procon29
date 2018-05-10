import { createStore, combineReducers } from 'redux';
import * as Game from './modules/game';
import * as Store from './store'

export const store = createStore(Game.reducer);
