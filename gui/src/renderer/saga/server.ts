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
	CONNECTED = 'IGOKABADDI_SOCKET_CONNECTED',	//Actionを定義しなくても良い(payloadも無くsaga内でしか投げられないので)
	FAIL = 'IGOKABADDI_SOCKET_FAIL',
	PUSH_OP = 'IGOKABADDI_PUSH_OP'
}

export type PushOp = {
	type: ActionNames.PUSH_OP;
}

export type ConnectAction = {
	type: ActionNames.CONNECT_SOCKET;
	payload: {
		config: Store.Config;
		color: Common.Color;
	}
}

export type ReceiveMsgAction = {
	type: ActionNames.RECEIVE_MSG;
	payload: {
		data: any;
	};
}

// 接続完了まで待機するだけのチャンネル
function genOpenChannel(socket: WebSocket) {
	return eventChannel(emit => {
		socket.addEventListener('open', (event: any) => {
			emit({type: ActionNames.CONNECTED});
		});
		socket.addEventListener('close', (event: any) => {
			emit({type: ActionNames.FAIL});
		});
		socket.addEventListener('error', (event: any) => {
			emit({type: ActionNames.FAIL});
		});
		return () => {};
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
				// 盤面が配信された場合、Common.Boardに変換して
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

// PUSH_OPを待機して、PUSH_OPが来たらメッセージ投げる処理をforkする
function* pushOp(socket: WebSocket) {
	while (true) {
		yield Effects.take(ActionNames.PUSH_OP);
		yield Effects.fork(function* (socket: WebSocket) {
			const ops = yield Effects.select(Store.getOps);
			// メッセージ作成
			const msg = JSON.stringify({
				type: 'push',
				color: 'Red', // TODO 色の選択を可能に
				payload: ops
			});
			socket.send(msg);
		}, socket);
		yield Effects.put({type: GameModule.ActionNames.FREEZE});
	}
}

// Saga内のPushMsgActionが投げられるとWebSocketからpayloadをstringifyして流す
function* sendMsg(socket: WebSocket) {
	yield Effects.fork(pushOp, socket);
}

// 一連の流れ
function* flow() {
	const server = yield Effects.select(Store.getServerInfo);
	// Socketを作成
	let socket;
	let tryConnecting = true;
	while(tryConnecting) {
		const { payload } = yield Effects.take(ActionNames.CONNECT_SOCKET);
		socket = new WebSocket('ws://'+server.ip+':'+server.port);
		// socketのopenを待ち受けるチャンネルを作成
		const channel = yield Effects.call(genOpenChannel, socket);
		const action = yield Effects.take(channel);
		// 通信回線が開くと、configとcolorをmodule/gameに投げる
		if (action.type == ActionNames.CONNECTED) {
			console.log(payload);
			yield Effects.put({
				type: GameModule.ActionNames.CONFIG,
				payload:{
					color: payload.color,
					config: payload.config
				}
			});
			break;
		}
		// configとcolorは変えずに失敗を通知
		else if (action.type == ActionNames.FAIL) {
			yield Effects.put({type: GameModule.ActionNames.CONNECT_ERROR});
		}
	}
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
