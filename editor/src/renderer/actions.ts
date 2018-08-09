import * as Redux from 'redux';

import * as AppModule from './module/app';
import * as DrawerModule from './module/drawer';

export type T =
	AppModule.CloseWindowAction
	| DrawerModule.CloseDrawerAction
	| DrawerModule.OpenDrawerAction;
