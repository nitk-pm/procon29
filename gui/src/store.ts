import { createStore, combineReducers, Action } from 'redux';
import * as Logic from './logic/igokabaddi';
import * as Board from './modules/board';
import * as Turn from './modules/turn';
import * as Game from './modules/game';

export type Actions = Game.ClickSquareAction | Turn.EndTurnAction | Action

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
	selected:  boolean;
	suggested: boolean;
	forbidden: boolean;
	reserved:  Logic.Color;
}

export type BoardState = SquareState[][];

function logicBoardToUIBoard(board: Logic.Board) {
	const atStartPos = (start_positions: Logic.Pos[], x: number, y: number) => (
		start_positions.map(pos => pos.x == x && pos.y == y).reduce((x, y) => x || y));
		
	return board.table.map((line, y) =>
			line.map((square, x) => ({
					color: square.color,
					score: square.score,
					agent: atStartPos(board.red, x, y) || atStartPos(board.blue, x, y),
					selected: false,
					suggested: false,
					forbidden: false,
					reserved: Logic.Color.Neut,
				})
			));
}


export enum ActionNames {
	CLICK_SQUARE = 'IGOKABADDI_CLICK_SQUARE',
	END_TURN     = 'IGOKABADDI_END_TURN'
}

export type IgokabaddiState = {
	board: BoardState;
	turn: Logic.Turn;
}

export const initialState = {
	board: logicBoardToUIBoard(new Logic.Board(require('./initial_board.json'))),
	turn: Logic.Turn.Red
}
