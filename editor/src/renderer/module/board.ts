import * as Redux from 'redux';
import * as Actions from '../actions';
import * as Store from '../store';
import * as Common from '../../common';

import { Option } from 'monapt';

export enum ActionNames {
	UPDATE_SCORE = 'IGOKABADDI_UPDATE_SCORE'
}

export type UpdateScoreAction = {
	type: ActionNames.UPDATE_SCORE;
	payload: {
		score: number;
		pos: Common.Pos;
	};
};

export function reducer(tbl: Common.Table = Store.initialState.tbl, action: Actions.T) {
	switch (action.type) {
	case ActionNames.UPDATE_SCORE:
		let arr = tbl.arr.map(l => l.map(s => ({...s,})));
		let p = action.payload.pos;
		arr[p.y][p.x].score = Option(action.payload.score);
		return { ...tbl, arr };
	default:
		return tbl;
	}
	return tbl;
}
