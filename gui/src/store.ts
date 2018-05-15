import { createStore, combineReducers, Action } from 'redux';
import * as Logic from './logic/igokabaddi';
import * as BoardModule from './modules/board';
import * as HistModule from './modules/history';

export enum ActionNames {
	CLICK_SQUARE  = 'IGOKABADDI_CLICK_SQUARE',
	STACK_HISTORY = 'IGOKABADDI_STACK_HISTORY'
}

export type Actions = BoardModule.ClickSquareAction | HistModule.StackHistoryAction | Action

/* color:     現在の所有者
 * score:     点数
 * agent:     エージェントが居るかどうか
 * selected:  現在選択中かどうか agentがtrueで無いと意味がない
 * suggested: 移動可能先としてハイライトされているかどうか
 * forbidden: 移動不可能/選択不可能状態にあるか
 * reserved:  仮移動先かどうか
 */

export type SquareState = {
	color:     Logic.Color;
	score:     number;
	agent:     boolean;
	suggested: boolean;
}

export type BoardState = SquareState[][];

export class State {
	table: SquareState[][];
	hist: SquareState[][][];
}

function initializeState (board: Logic.Board) {
	const isXAgent = (positions: Logic.Pos[], x:number, y:number) => (
		positions.map(pos => pos == new Logic.Pos(x,y)).reduce((a,b) => a || b));
	let table = board.table.map((line, y) => (
		line.map((square, x) => ({
			color: square.color,
			score: square.score,
			agent: isXAgent(board.red, x, y) || isXAgent(board.blue, x, y),
			suggested: false
		}))));
	return ({
		table: table,
		hist: new Array<SquareState[][]>(0)
	});
}

export const initialState: State = initializeState(new Logic.Board(require('./initial_board.json')));
