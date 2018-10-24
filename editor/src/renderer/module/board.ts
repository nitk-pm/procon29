import * as Redux from 'redux';
import * as Actions from '../actions';
import * as Store from '../store';
import * as Common from '../../common';

import { Option } from 'monapt';

export enum ActionNames {
	UPDATE_SCORE = 'IGOKABADDI_UPDATE_SCORE',
	CHANGE_SIZE = 'IGOKABADDI_CHANGE_SIZE'
}

export type UpdateScoreAction = {
	type: ActionNames.UPDATE_SCORE;
	payload: {
		score: number;
		pos: Common.Pos;
	};
};

export type ChangeSizeAction = {
	type: ActionNames.CHANGE_SIZE,
	payload: {
		h: number,
		w: number
	}
};

function resizeLine<T>(line: Array<T>, genPadding:(() => T), targetLength: number) {
	let newLine = line.slice();
	if (line.length > targetLength) {
		let head = newLine.slice(0, targetLength/2);
		let tail = newLine.slice(newLine.length-targetLength/2, newLine.length);
		return head.concat(tail);
	}
	else if (line.length < targetLength) {
		let head = newLine.slice(0, targetLength/2);
		let tail = newLine.slice(targetLength/2, newLine.length);
		let paddings = new Array<T>();
		for (let i = 0; i < targetLength - line.length; ++i) {
			paddings.push(genPadding());
		}
		return head.concat(paddings).concat(tail);
	}
	else {
		return line.slice();
	}
}

function resize(tbl: Common.Table, targetSize: { w: number, h: number }) {
	let genPadding = () => {
		let emptyLine = new Array<Common.Square>();
		for (let i = 0; i < tbl.w; ++i) {
			emptyLine.push({
				score: Option(0),
				color: Common.Color.Neut,
			});
		}
		return emptyLine;
	}
	let newTbl = resizeLine(tbl.arr, genPadding, targetSize.h);
	for (let i = 0; i < newTbl.length; ++i) {
		newTbl[i] = resizeLine(newTbl[i], () => ({score: Option(0), color: Common.Color.Neut}), targetSize.w);
	}
	return newTbl;
}

export function reducer(tbl: Common.Table = Store.initialState.tbl, action: Actions.T) {
	switch (action.type) {
	case ActionNames.UPDATE_SCORE:
		let arr = tbl.arr.map(l => l.map(s => ({...s,})));
		let p = action.payload.pos;
		arr[p.y][p.x].score = Option(action.payload.score);
		return { ...tbl, arr };
	case ActionNames.CHANGE_SIZE:
		let h = Math.min(action.payload.h, 12);
		let w = Math.min(action.payload.w, 12);
		if (h * w < 80) return tbl;
		return {
			arr: resize(tbl, action.payload),
			w,
			h
		};
	default:
		return tbl;
	}
	return tbl;
}
