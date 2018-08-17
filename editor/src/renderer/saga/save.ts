import * as Effects from 'redux-saga/effects';
import * as Electron from 'electron';

import * as Common from '../../common';
import * as Store from '../store';

import * as fs from 'fs';

export enum ActionNames {
	SAVE = 'IGOKABADDI_SAVE'
}

export type SaveAction = {
	type: ActionNames.SAVE;
}

function* save() {
	let win = Electron.remote.getCurrentWindow();
	let options = {
		title: 'save',
		filters: [
			{
				name: 'board',
				extensions: ['json']
			}
		],
		properties: ['openFile', 'createDirectory']
	};
	let board = yield Effects.select(Store.getBoard);
	let json = JSON.stringify(Common.exportBoard(board));
	Electron.remote.dialog.showSaveDialog(win, options,
		filename => {
			fs.writeFile(filename, json, 'utf8', err => {
				return console.log(err);
			});
		}
	);
}

export default function* saveSaga() {
	yield Effects.takeEvery(ActionNames.SAVE, save);
}
