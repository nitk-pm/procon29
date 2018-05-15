import { createStore, combineReducers, Action } from 'redux';
import * as Logic from './logic/igokabaddi';
import * as Board from './modules/board';
import * as Game from './modules/game';

export enum ActionNames {
	CLICK_SQUARE = 'IGOKABADDI_CLICK_SQUARE',
	END_TURN     = 'IGOKABADDI_END_TURN'
}

export type Actions = Board.ClickSquareAction | Action

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
}

export type BoardState = SquareState[][];

export class Agent {
	pos: Logic.Pos;
	before: Logic.Pos;
}

export class State {
	table: SquareState[][];
	blueAgents: Agent[];
	redAgents : Agent[];
	suggested: Logic.Pos[];
}

function initializeState (board: Logic.Board) {
	let table = board.table.map((line, y) => (
		line.map((square, x) => ({
			color: square.color,
			score: square.score
		}))));
	let blueAgents = board.blue.map(pos => ({pos: pos, before: pos}));
	let redAgents  = board.red.map(pos => ({pos: pos, before: pos}));
	let suggested = new Array<Logic.Pos>(0);
	return ({
		table: table,
		blueAgents: blueAgents,
		redAgents: redAgents,
		suggested: suggested,
		turn: Logic.Turn.Red
	});
}

export const initialState: State = initializeState(new Logic.Board(require('./initial_board.json')));
