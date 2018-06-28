import * as Effects from 'redux-saga/effects';
import * as Actions from '../actions';
import * as Store from '../store';
import * as ServerModule from '../module/server';
import io from 'socket.io-client';

enum ActionNames {
	CONNECT_SOCKET = 'IGOKABADDI_CONNECT_SOCKET'
}

type ConnectAction = {
	type: ActionNames.CONNECT_SOCKET;
}

export function* connectServer(action: Actions.T) {
	const server = yield Effects.select(Store.getServerInfo);
	const socket = yield io('http://' + server.ip + ':' + server.port);
	yield Effects.put({type: ServerModule.ActionNames.UPDATE_SOCKET, payload: {socket}});
}

export function* connectSaga() {
	yield Effects.takeEvery(ActionNames.CONNECT_SOCKET, connectServer);
}
