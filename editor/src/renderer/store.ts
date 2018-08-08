import * as Common from '../common';

export enum UIState {
	Load,
	Edit
}

export type State = {
	state: UIState;
	tbl: Common.Table;
};

export const initialState: State = { tbl: null, state: UIState.Load }
