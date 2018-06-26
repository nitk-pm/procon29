import { createStore, combineReducers } from 'redux';
import * as Common from '../common';
import * as IO from 'socket.io-client';

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

export enum InputState {
	Ready,
	Suggested
}

export enum Config {
	Player,
	User
}

export type Server = {
	ip: string,
	port: string
}

export type State = {
	inDialog: boolean;
	config: Config;
	board: Common.Table;
	//Undo用
	hist: Array<Array<Common.Operation>>;
	inputState: InputState;
	server: Server;
	socket: IO.Socket;
}


let initialBoard = Common.loadBoard(require('./initial_board.json'));

export const initialState: State = {
	inDialog: true,
	config: Config.Player,
	hist: [],
	board: initialBoard,
	inputState: InputState.Ready,
	server: {ip: '', port: ''},
	socket: null
};
