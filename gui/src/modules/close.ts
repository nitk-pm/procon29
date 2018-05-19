import * as Redux from 'redux';
import * as Store from '../store';

import { ipcRenderer } from 'electron';

export function close() {
	console.log('exit');
	ipcRenderer.send('message', 'exit');
}
