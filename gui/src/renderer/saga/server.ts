import * as Effects from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as Actions from '../actions';
import * as Store from '../store';
import * as ServerModule from '../module/server';
import * as GameModule from '../module/game';
import * as Common from '../../common';

export enum ActionNames {
	CONNECT_SOCKET = 'IGOKABADDI_CONNECT_SOCKET',
	RECEIVE_MSG = 'IGOKABADDI_RECEIVE_MESSAGE',
	PUSH_MSG = 'IGOKABADDI_PUSH_MESSAGE'
}

export type ConnectAction = {
	type: ActionNames.CONNECT_SOCKET;
}

export type ReceiveMsgAction = {
	type: ActionNames.RECEIVE_MSG;
	payload: {
		data: any;
	};
}

export type PushMsgAction = {
	type: ActionNames.PUSH_MSG;
	payload: {
		data: any;
	};
}

// WebSocketをサーバと繋ぐだけ
// 結果はpromiseで返す
function connect(url: string) {
	const socket = new WebSocket(url);
	return new Promise(resolve => {
		socket.addEventListener('open', (event) => {
			resolve(socket);
		});
	});
}

// WebSocketからのメッセージを聞いてactionを投げるチャンネルを作る。
// TODO もっとたくさんのActionをなげる!
function genListenChannel(socket: WebSocket) {
	return eventChannel(emit => {
		socket.addEventListener('message', (event: any) => {
			const msg = JSON.parse(event.data);
			switch (msg.type) {
			case 'distribute-board':
				const board = Common.loadBoard(msg.payload);
				emit({type: GameModule.ActionNames.UPDATE_BOARD, payload: {board}});
				break;
			default:
			}
			emit({type: ActionNames.RECEIVE_MSG, payload:{msg: event.data}});
		});
		return () => {};
	});
}

// channelからactionを読み出してsaga内に投げるsaga
function* listenMsg(socket: WebSocket) {
	const channel = yield Effects.call(genListenChannel, socket);
	while (true) {
		const action = yield Effects.take(channel);
		yield Effects.put(action);
	}
}

// Saga内のPushMsgActionが投げられるとWebSocketからpayloadをstringifyして流す
// TODO もっとたくさんのActionをうけとる!
function* sendMsg(socket: WebSocket) {
	while(true) {
		const { payload } = yield Effects.take(ActionNames.PUSH_MSG);
		socket.send(JSON.stringify(payload));
	}
}

// 一連の流れ
function* flow() {
	const server = yield Effects.select(Store.getServerInfo);
	// Socketを作成
	yield Effects.take(ActionNames.CONNECT_SOCKET);
	const socket = yield Effects.call(connect, 'ws://'+server.ip+':'+server.port);
	yield Effects.put({type: ServerModule.ActionNames.UPDATE_SOCKET, payload:{socket}});
	// 初めての接続なので盤面の配信をサーバに要求
	// FIXME colorを選択可能に
	socket.send(JSON.stringify({type: 'req-board', color: 'Red', payload: {}}));
	yield Effects.fork(listenMsg, socket);
	yield Effects.fork(sendMsg, socket);
}

export function* rootSaga() {
	yield Effects.fork(flow);
}
