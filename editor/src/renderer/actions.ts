import * as Redux from 'redux';

import * as AppModule from './module/app';
import * as DrawerModule from './module/drawer';
import * as BoardModule from './module/board';

import * as SaveSaga from './saga/save';

export type T =
	AppModule.CloseWindowAction
	| AppModule.TransitionAction
	| AppModule.LoadBoardAction
	| AppModule.ToggleColorPickerAction
	| AppModule.CloseColorPickerAction
	| AppModule.ChangeColorAction
	| AppModule.NewBoardAction
	| BoardModule.ChangeSizeAction
	| DrawerModule.CloseDrawerAction
	| DrawerModule.OpenDrawerAction
	| BoardModule.UpdateScoreAction
	| SaveSaga.SaveAction;
