import * as AppbarModule from './module/appbar';
import * as GameModule from './module/game';
import * as IpModule from './module/ip';

export type T =
	AppbarModule.CloseAction
	| GameModule.ClickSquareAction
	| GameModule.DoneAction
	| GameModule.ConfigAction
	| IpModule.ChangeIpAddressAction
	| IpModule.ChangePortAction;
