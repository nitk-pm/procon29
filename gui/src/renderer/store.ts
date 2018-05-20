import { createStore, combineReducers, Action } from 'redux';
import * as Logic from './logic/igokabaddi';
import * as BoardModule from './modules/board';
import * as HistModule from './modules/history';
import * as DrawerModule from './modules/drawer';

export enum ActionNames {
	CLICK_END_TURN = 'IGOKABADDI_CLICK_END_TURN',
	CLICK_SQUARE  = 'IGOKABADDI_CLICK_SQUARE',
	STACK_HISTORY = 'IGOKABADDI_STACK_HISTORY',
	CLOSE = 'IGOKABADDI_CLOSE',
	TOGGLE_DRAWER = 'IGOKABADDI_TOGGLE_DRAWER'
}

export type Actions = BoardModule.ClickSquareAction | HistModule.StackHistoryAction | DrawerModule.ToggleDrawerAction

/* color:     現在の所有者
 * score:     点数
 * agent:     エージェントが居るかどうか
 * selected:  現在選択中かどうか agentがtrueで無いと意味がない
 * suggested: 移動可能先としてハイライトされているかどうか
 * forbidden: 移動不可能/選択不可能状態にあるか
 * reserved:  仮移動先かどうか
 */

export enum GameState {
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

export type BoardState = {
	tbl: SquareState[][];
	state: GameState;
	turn: Logic.Color;
	w: number;
	h: number;
	clearQue: Logic.Pos[];
	moveQue: MoveInfo[];
};

export class MoveInfo {
	color: Logic.Color;
	from: Logic.Pos;
	to: Logic.Pos;
}

export class State {
	board: BoardState;
	hist: BoardState[];
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
		board: {
			tbl: table,
			w: board.width,
			h: board.height,
			state: GameState.Wait,
			turn: Logic.Color.Red,
			clearQue: new Array<Logic.Pos>(0),
			moveQue: new Array<MoveInfo>(0)
		},
		hist: new Array<BoardState>(0),
		drawerOpen: false
	});
}

export const initialState: State = initializeState(new Logic.Board(require('./initial_board.json')));
