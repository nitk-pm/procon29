import * as Redux from 'redux';
import * as Store from '../store';
import * as Logic from '../logic/igokabaddi';

/* クソ状態が多いですね
 * color:     現在の所有者
 * score:     点数
 * agent:     エージェントが居るかどうか
 * selected:  現在選択中かどうか agentがtrueで無いと意味がない
 * suggested: 移動可能先としてハイライトされているかどうか
 * forbidden: 移動不可能/選択不可能状態にあるか
 * reserved:  仮移動先かどうか
 */
interface SquareState {
	color:     Logic.Color;
	score:     number;
	agent:     boolean;
	selected:  boolean;
	suggested: boolean;
	forbidden: boolean;
	reserved:  Logic.Color;
}

export function clickSquare(pos: Logic.Pos) {
	return {
		type: Store.ActionNames.CLICK_SQUARE,
		payload: {
			pos: pos
		}
	};
}

export function reducer(board: Logic.Board = Store.initialState.board, action: Store.Actions) {
	return board;
}
