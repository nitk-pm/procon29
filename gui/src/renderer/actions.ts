import * as AppbarModule from './module/appbar';
import * as AppModule from './module/app';
import * as GameModule from './module/game';
import * as ServerModule from './module/server';
import * as ServerSaga from './saga/server';

export type T =
	AppbarModule.CloseAction
	| AppModule.ApplySettingAction
	| AppModule.FreezeAction
	| AppModule.ThawingAction
	| AppModule.UpdateBoardAction
	| AppModule.BackAction
	| AppModule.ReceiveOpAction
	| AppModule.ChangeDirAction
	| AppModule.SwapSuitAction
	| AppModule.AloneModeAction
	| AppModule.UpdateTurnAction
	| GameModule.ClickSquareAction
	| GameModule.UnsetHighLightAction
	| ServerModule.ChangeIpAddressAction
	| ServerModule.ChangePortAction
	| ServerModule.ConnectAction
	| ServerModule.ConnectFailAction
	| ServerSaga.ConnectAction
	| ServerSaga.ReceiveMsgAction
