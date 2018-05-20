import * as BoardModule from './modules/board';
import * as DrawerModule from './modules/drawer';

export enum Names {
	CLICK_END_TURN = 'IGOKABADDI_CLICK_END_TURN',
	CLICK_SQUARE  = 'IGOKABADDI_CLICK_SQUARE',
	CLOSE = 'IGOKABADDI_CLOSE',
	TOGGLE_DRAWER = 'IGOKABADDI_TOGGLE_DRAWER'
}

export type T = BoardModule.ClickSquareAction | DrawerModule.ToggleDrawerAction
