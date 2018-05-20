import { createStore, combineReducers } from 'redux';
import * as Logic from './logic/igokabaddi';

export enum ScreenState {
	Suggested,
	Wait
}

export type SquareState = {
	color:     Logic.Color;
	score:     number;
	agent:     boolean;
	suggested: boolean;
	moved: boolean;
}

export class Table {
	private raw: SquareState[][];
	public readonly w: number;
	public readonly h: number;

	constructor (raw: SquareState[][]) {
		this.raw = raw;
		this.h = raw.length;
		this.w = raw[0].length;
	}
	
	public getRawTbl(): SquareState[][] {
		return this.raw;
	}

	public get (pos: Logic.Pos): SquareState {
		return this.raw[pos.y][pos.x];
	}

	public set (pos: Logic.Pos, square: SquareState) {
		this.raw[pos.y][pos.x] = square;
	}

	public dup(): Table {
		return new Table(this.raw);
	}
}

export type BoardState = {
	tbl: Table;
	state: ScreenState;
	turn: Logic.Color;
	clearQue: Logic.Pos[];
	moveQue: MoveInfo[];
};

export type MoveInfo = {
	color: Logic.Color;
	from: Logic.Pos;
	to: Logic.Pos;
}

export type GameState = {
	board: BoardState;
	hist: BoardState[];
	turnLog: Table[];
}

export type State  = {
	game: GameState;
	drawerOpen: boolean;
}

function initializeState (board: Logic.Board) {
	const isXAgent = (positions: Logic.Pos[], x:number, y:number) => (
		positions.map(pos => pos.eq(new Logic.Pos(x,y))).reduce((a,b) => a || b));
	let table = board.table.map((line, y) => (
		line.map((square, x) => ({
			color: square.color,
			score: square.score,
			agent: isXAgent(board.red, x, y) || isXAgent(board.blue, x, y),
			suggested: false,
			moved: false
		}))));
	return ({
		game: {
			board: {
				tbl: new Table(table),
				state: ScreenState.Wait,
				turn: Logic.Color.Red,
				clearQue: new Array<Logic.Pos>(0),
				moveQue: new Array<MoveInfo>(0)
			},
			hist: new Array<BoardState>(0),
			turnLog: new Array<Table>(0)
		},
		drawerOpen: false
	});
}

export const initialState: State = initializeState(new Logic.Board(require('./initial_board.json')));
