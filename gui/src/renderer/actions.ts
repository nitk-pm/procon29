import * as AppbarModule from './module/appbar';
import * as GameModule from './module/game';
import * as ServerModule from './module/server';
import * as TimeModule from './module/time';
import * as ServerSaga from './saga/server';

export type T =
	AppbarModule.CloseAction
	| GameModule.ClickSquareAction
	| GameModule.ConfigAction
	| GameModule.UpdateBoardAction
	| GameModule.FreezeAction
	| GameModule.ThawingAction
	| GameModule.LoadBoardAction
	| GameModule.BackAction
	| ServerModule.ChangeIpAddressAction
	| ServerModule.ChangePortAction
	| ServerModule.ConnectAction
	| ServerModule.ConnectFailAction
	| ServerSaga.ConnectAction
	| ServerSaga.PushOp
	| ServerSaga.ReceiveMsgAction
	| ServerSaga.ResetTimeAction
	| TimeModule.UpdateTimeAction;
