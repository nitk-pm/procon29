import * as AppbarModule from './module/appbar';
import * as GameModule from './module/game';
import * as ServerModule from './module/server';
import * as ServerSaga from './saga/server';

export type T =
	AppbarModule.CloseAction
	| GameModule.ClickSquareAction
	| GameModule.DoneAction
	| GameModule.ConfigAction
	| ServerModule.ChangeIpAddressAction
	| ServerModule.ChangePortAction
	| ServerModule.UpdateSocketAction
	| ServerSaga.ConnectAction;
