import * as DrawerModule from './module/drawer';
import * as AppbarModule from './module/appbar';
import * as GameModule from './module/game';

export type T =
	DrawerModule.ToggleDrawerAction
	| AppbarModule.CloseAction
	| GameModule.ClickSquareAction
	| GameModule.DoneAction;
