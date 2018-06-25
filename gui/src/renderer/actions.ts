import * as AppbarModule from './module/appbar';
import * as GameModule from './module/game';

export type T =
	AppbarModule.CloseAction
	| GameModule.ClickSquareAction
	| GameModule.DoneAction
	| GameModule.ConfigAction;
