import * as Redux from 'redux';
import * as Action from '../actions';
import * as Store from '../store';
import * as IO from 'socket.io-client';

export enum ActionNames {
	CHANGE_IP_ADDRESS = 'IGOKABADDI_CHANGE_IP_ADDRESS',
	CHANGE_PORT = 'IGOKABADDI_CHANGE_PORT',
	UPDATE_SOCKET = 'IGOKABADDI_UPDATE_SOCKET'
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

export type UpdateSocketAction = {
	type: ActionNames.UPDATE_SOCKET;
	payload: {
		socket: IO.Socket;
	}
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
	case ActionNames.UPDATE_SOCKET:
		return {
			...state,
			socket: action.payload.socket
		};
	default:
		return state;
	}
}
