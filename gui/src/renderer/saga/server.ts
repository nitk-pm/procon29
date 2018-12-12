import * as Effects from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as Actions from '../actions';
import * as Store from '../store';
import * as ServerModule from '../module/server';
import * as GameModule from '../module/game';
import * as AppModule from '../module/app';
import * as Common from '../../common';

export enum ActionNames {
	CONNECT_SOCKET = 'IGOKABADDI_CONNECT_SOCKET',
	RECEIVE_MSG = 'IGOKABADDI_RECEIVE_MESSAGE',
	CONNECTED = 'IGOKABADDI_SOCKET_CONNECTED',	//Actionを定義しなくても良い(payloadも無くsaga内でしか投げられないので)
	FAIL = 'IGOKABADDI_SOCKET_FAIL',
}

export type ConnectAction = {
	type: ActionNames.CONNECT_SOCKET;
	payload: {
		state: Store.UIState;
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
// TODO もっとたくさんのActionをなげる! <- ?
function genListenChannel(socket: WebSocket) {
	return eventChannel(emit => {
		socket.addEventListener('message', (event: any) => {
			const msg = JSON.parse(event.data);
			console.log(msg);
			switch (msg.type) {
			case 'distribute-board':
				// 盤面が配信された場合、Common.Boardに変換して
				const board = Common.loadBoard(msg.payload.board);
				// 盤面の更新
				emit({type: AppModule.ActionNames.UPDATE_BOARD, payload: {board}});
				const time = msg.payload.time;
				// 操作の解凍
				emit({type: AppModule.ActionNames.THAWING});
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
/*
 * socketが正常に接続できるまで接続画面を出し続ける。
 * PUSH_OPが来たらサーバにメッセージを投げる
 * distribute-boardが来たらmodule/gameに盤面の更新を依頼し、盤面を解凍
 */
function* flow() {
	const server = yield Effects.select(Store.getServerInfo);
	// Socketを作成
	let socket;
	// 正常に接続できるまで再接続を試みる
	while(true) {
		// Viewからサーバ接続要求を受けるまで待機
		const { payload } = yield Effects.take(ActionNames.CONNECT_SOCKET);
		socket = new WebSocket('ws://'+server.ip+':'+server.port);
		// socketのopenを待ち受けるチャンネルを作成
		const channel = yield Effects.call(genOpenChannel, socket);
		// socketがopenした時のメッセージを受け取る
		const action = yield Effects.take(channel);
		// 通信回線が開くと、stateとcolorをmodule/gameに投げる
		if (action.type == ActionNames.CONNECTED) {
			yield Effects.put({
				type: AppModule.ActionNames.TRANSITION,
				payload:{
					color: payload.color,
					state: payload.state
				}
			});
			socket.send(JSON.stringify({type: 'req-board'}));
			break;
		}
		// stateとcolorは変えずに失敗を通知
		else if (action.type == ActionNames.FAIL) {
			yield Effects.put({type: ServerModule.ActionNames.CONNECT_FAIL});
		}
	}
	// 接続したsocketをstoreに保存
	yield Effects.put({type: ServerModule.ActionNames.CONNECT, payload:{socket}});
	// 初めての接続なので盤面の配信をサーバに要求
	// FIXME colorを選択可能に
	yield Effects.fork(listenMsg, socket);
}

export function* rootSaga() {
	yield Effects.fork(flow);
}
