import { createStore, combineReducers } from 'redux';
import * as Common from '../common';
import { Option, None } from 'monapt';

export type Pos = {
	x: number,
	y: number
}

enum Icon {
	Human,
	Suggested
}

export type ViewState = {
	color: Common.Color,
	light: boolean, 
	icon: Icon
}

export type Server = {
	ip: string,
	port: string,
	socket: WebSocket,
	connected: boolean,
	msg: string
}

export enum UIState {
	Setting,
	Player,
	User,
	Alone,
	Viewer
}

export type State = {
	state: UIState;
	color: Common.Color;
	board: Common.Table;
	//Undo用
	hist: Array<Array<Common.Operation>>;
	server: Server;
	rivalOps: Common.Operation[];
	ops: Common.Operation[];
	highlight: Option<Common.Pos>;
	freeze: boolean;
	time: number;
	dir: string;
	colorMap: Array<{forward: string; back: string}>;
	turn: number;
	boardIsValid: boolean;
}


let initialBoard = Common.loadBoard(require('./initial_board.json'));

export const initialState: State = {
	color: Common.Color.Red,
	state: UIState.Setting,
	hist: [],
	board: initialBoard,
	server: {ip: '127.0.0.1', port: '8080', socket: null, connected: false, msg: ''},
	rivalOps: [],
	ops: [],
	highlight: None,
	freeze: true,
	time: 0.0,
	dir: 'up',
	colorMap: [{forward: 'black', back: 'red'}, {forward: 'white', back:'black'}],
	turn: 0,
	boardIsValid: true
};

export const getServerInfo = (state: State) => state.server;
export const getOps = (state: State) => state.ops;
export const getRivalOps = (state: State) => state.rivalOps;
export const getColor = (state: State) => state.color;
export const getTime = (state: State) => state.time;
export const getState = (state: State) => state.state;
export const getBoard = (state: State) => state.board;
