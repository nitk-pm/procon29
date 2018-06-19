import { createStore, combineReducers } from 'redux';

export type Pos = {
	x: number,
	y: number
}

export enum SquareType {
	Red,
	Blue,
	Neut
}

export enum SquareState {
	//空(サジェスト)
	Suggested,
	//エージェント(移動後)
	Moved,
	//エージェント(サジェスト元)
	Ready,
	//エージェント(移動前)
	Wait,
	//誰もいない
	Empty
}

export type Square = {
	type: SquareType,
	state: SquareState,
	score: number
}

export class Table {
	public readonly tbl: Square[][];
	public readonly w: number;
	public readonly h: number;

	constructor (raw: Square[][], h: number, w: number) {
		this.tbl = raw.map(l => l.map(s => ({...s,})));
		this.h = h;
		this.w = w;
	}

	public dup() {
		let tbl = this.tbl.map(l => l.map(s => ({...s,})));
		return new Table(tbl, this.h, this.w);
	}

	public get (pos: Pos): Square {
		return this.tbl[pos.y][pos.x];
	}

	public set (pos: Pos, square: Square) {
		this.tbl[pos.y][pos.x] = square;
	}
}

export enum Controller {
	Human,
	//今流行りのビッグデータでIoTのやつです
	Ai
}

export type Config = {
	red: Controller,
	blue: Controller
}

export enum InputState {
	Ready,
	Suggested
}

export type State = {
	//設定
	config: Config;
	//赤、青がそれぞれ手を確定させると追加される。基本的に変更は出来ない。
	log: Table[];
	//Undo用。人間が操作した場合のみ残し、手を確定させる度に消去する。
	hist: Table[];
	//人間が入力中のみ有効
	inputState: InputState;
	//drawerの状況
	drawerOpen: boolean;
}

function loadBoard(json: any): Table {
	const height = parseInt(json.height);
	const width  = parseInt(json.width);
	let table = new Array<Array<Square>>(height);
	for (var y = 0; y < height; ++y) {
		table[y] = new Array<Square>(width);
		for (var x = 0; x < width; ++x) {
			let score = parseInt(json.table[y][x].score);
			let squareType;
			switch (json.table[y][x].color) {
			case "Red":
				squareType = SquareType.Red;
				break;
			case "Blue":
				squareType = SquareType.Blue;
				break;
			case "Neut":
				squareType = SquareType.Neut;
				break;
			}
			table[y][x] = {
				type: squareType,
				score: score,
				state: SquareState.Empty
			};
		}
	}
	console.log(json);
	for (var i = 0; i < 2; ++i) {
		const x = json.blue[i].x;
		const y = json.blue[i].y;
		table[y][x].state = SquareState.Wait;
	}
	for (var i = 0; i < 2; ++i) {
		const x = json.red[i].x;
		const y = json.red[i].y;
		table[y][x].state = SquareState.Wait;
	}
	return new Table(table, height, width);
}

export const initialBoard = loadBoard(require('./initial_board.json'));

export const initialState: State = {
	config: {
		red: Controller.Human,
		blue: Controller.Human
	},
	log: [initialBoard],
	hist: [initialBoard],
	inputState: InputState.Ready,
	drawerOpen: true
};
