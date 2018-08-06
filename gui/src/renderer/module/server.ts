import * as Redux from 'redux';
import * as Action from '../actions';
import * as Store from '../store';

export enum ActionNames {
	CHANGE_IP_ADDRESS = 'IGOKABADDI_CHANGE_IP_ADDRESS',
	CHANGE_PORT = 'IGOKABADDI_CHANGE_PORT',
	CONNECT = 'IGOKABADDI_UPDATE_SOCKET',
	CONNECT_FAIL = 'IGOKABADDI_CONNECT_FAIL'
}

export type ChangeIpAddressAction = {
	type: ActionNames.CHANGE_IP_ADDRESS;
	payload: {
		ip: string
	}
}

export type ChangePortAction = {
	type: ActionNames.CHANGE_PORT;
	payload: {
		port: string;
	}
}

export type ConnectAction = {
	type: ActionNames.CONNECT;
	payload: {
		socket: WebSocket;
	};
}

export type ConnectFailAction = {
	type: ActionNames.CONNECT_FAIL;
}

export function reducer(state: {ip: string; port: string} = Store.initialState.server, action: Action.T) {
	switch (action.type) {
	case ActionNames.CHANGE_IP_ADDRESS:
		return {
			...state,
			ip: action.payload.ip
		};
	case ActionNames.CHANGE_PORT:
		return {
			...state,
			port: action.payload.port
		};
	case ActionNames.CONNECT:
		return {
			...state,
			socket: action.payload.socket,
			connected: true
		};
   	case ActionNames.CONNECT_FAIL:
		return {
			...state,
			connected: false,
			msg: 'CONNECT FAIL'
		};
	default:
		return state;
	}
}
