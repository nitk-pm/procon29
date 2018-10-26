import * as Effects from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as Actions from '../actions';
import * as Store from '../store';
import * as ServerModule from '../module/server';
import * as GameModule from '../module/game';
import * as AppModule from '../module/app';
import * as TimeModule from '../module/time';
import * as Common from '../../common';

export enum ActionNames {
	CONNECT_SOCKET = 'IGOKABADDI_CONNECT_SOCKET',
	RECEIVE_MSG = 'IGOKABADDI_RECEIVE_MESSAGE',
	CONNECTED = 'IGOKABADDI_SOCKET_CONNECTED',	//Actionを定義しなくても良い(payloadも無くsaga内でしか投げられないので)
	FAIL = 'IGOKABADDI_SOCKET_FAIL',
	PUSH_OP = 'IGOKABADDI_PUSH_OP',
	RESET_TIME = 'IGOKABADDI_RESET_TIME',
	UNDO = 'IGOKABADDI_UNDO',
	IGNORE_SOLVER = 'IGOKABADDI_IGNORE',
	PUSH_BOARD = 'IGOKABADDI_BOARD'
}

export type IgnoreSolverAction = {
	type: ActionNames.IGNORE_SOLVER;
}

export type UndoAction = {
	type: ActionNames.UNDO;
}

export type PushBoardAction = {
	type: ActionNames.PUSH_BOARD;
}

export type PushOp = {
	type: ActionNames.PUSH_OP;
	payload: {
		force: boolean;
	}
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

export type ResetTimeAction = {
	type: ActionNames.RESET_TIME;
	payload: {
		time: number;
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
				console.log(board);
				// 盤面の更新
				emit({type: AppModule.ActionNames.UPDATE_BOARD, payload: {board}});
				const time = msg.payload.time;
				emit({type: ActionNames.RESET_TIME, payload: {time}});
				const turn = msg.payload.turn;
				emit({type: AppModule.ActionNames.UPDATE_TURN, payload: { turn }});
				// 操作の解凍
				emit({type: AppModule.ActionNames.THAWING});
				break;
			case 'distribute-op':
				const ops = msg.payload;
				emit({type: AppModule.ActionNames.RECEIVE_OP, payload: {ops}});
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
		const color = yield Effects.select(Store.getColor);
		const rivalColor = color == Common.Color.Red ? Common.Color.Blue : Common.Color.Red;
		// メッセージを投げる処理
		yield Effects.fork(function* (socket: WebSocket) {
			const ops = yield Effects.select(Store.getOps);
			const state = yield Effects.select(Store.getState);

			if (state == Store.UIState.Alone) {
				const rivalOps = yield Effects.select(Store.getRivalOps);
				const rivalMsg = JSON.stringify({
					type: 'push-force',
					color: rivalColor,
					payload: rivalOps
				});
				socket.send(rivalMsg);
				const msg = JSON.stringify({
					type: 'push-force',
					color,
					payload: ops
				});
				socket.send(msg);
			}
			// メッセージ作成
			else {
				const msg = JSON.stringify({
					type: 'push',
					color,
					payload: ops
				});
				socket.send(msg);
			}
		}, socket);
		// メッセージを投げるのとは独立にGUIの操作を無効化する。
		yield Effects.put({type: AppModule.ActionNames.FREEZE});
	}
}

function* pushIgnoreSolver(socket: WebSocket) {
	while(true) {
		yield Effects.take(ActionNames.IGNORE_SOLVER);
		yield Effects.put({
			type: AppModule.ActionNames.ALONE_MODE
		});
		const msg = JSON.stringify({
			type: 'clear-op',
		});
		socket.send(msg);
	}
}

function* pushBoard(socket: WebSocket) {
	while(true) {
		yield Effects.take(ActionNames.PUSH_BOARD);
		let board = yield Effects.select(Store.getBoard);
		const msg = JSON.stringify({
			type: 'push-board',
			payload: board
		});
		socket.send(msg);
	}
}

// Saga内のPushMsgActionが投げられるとWebSocketからpayloadをstringifyして流す
function* sendMsg(socket: WebSocket) {
	yield Effects.fork(pushOp, socket);
	yield Effects.fork(pushIgnoreSolver, socket);
	yield Effects.fork(pushBoard, socket);
}

function wait(ms: number) {
	return new Promise(resolve => {
		setTimeout(() => resolve(), ms)
	});
}

function* runTimer() {
	let interval = 100.0;
	while(true) {
		const winner = yield Effects.race({
			reset: Effects.take(ActionNames.RESET_TIME),
			tick: Effects.call(wait, 100)
		});
		if (winner.reset) {
			yield Effects.put({type: TimeModule.ActionNames.UPDATE_TIME, payload: {time: winner.reset.payload.time}});
		}
		else {
			let currentTime = yield Effects.select(Store.getTime);
			yield Effects.put({type: TimeModule.ActionNames.UPDATE_TIME, payload: {time: currentTime + interval/1000.0}});
		}
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
			// UserならOperationの配信リストに自身を加えるよう要請
			if (payload.state == Store.UIState.User) {
				socket.send(JSON.stringify({
					type: 'subscribe-op',
					color: payload.color,
					payload: {}
				}));
			}
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
	socket.send(JSON.stringify({type: 'req-board'}));
	yield Effects.fork(listenMsg, socket);
	yield Effects.fork(sendMsg, socket);
	yield Effects.fork(runTimer);
}

export function* rootSaga() {
	yield Effects.fork(flow);
}
