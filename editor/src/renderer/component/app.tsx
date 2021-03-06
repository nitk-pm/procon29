import * as React from 'react';
import * as Common from '../../common';
import AppBar from '../container/appbar';
import Drawer from '../container/drawer';
import ColorPicker from '../container/colorPicker';
import Board from '../container/board';
import { ActionDispatcher } from '../container/app';

import { withStyles, WithStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import * as Store from '../store';

export interface AppProps {
	actions: ActionDispatcher;
	state: Store.UIState;
	height: number;
	width: number;
}

const styles = {
};

type ClassNames = keyof typeof styles;

import Button from '@material-ui/core/Button'

export default withStyles(styles)<AppProps>(
	(props: AppProps & WithStyles<ClassNames>) => {
		return (
			<div className="app-root">
				<AppBar />
				<Drawer/>
				<ColorPicker />
				<div className='content'>
					<Board/>
					<input
						accept='application/json, .json'
						id='file-input'
						style={{display: 'none'}}
						onChange={(e) => props.actions.openFile(e)}
						type='file' />
					<div className='controll'>
						<TextField
							value={props.width}
							type='number'
							placeholder='width'
							label='width'
							onChange={
								(e: any) =>
									props.actions.changeSize({w: e.target.value, h: props.height})
							}
						/>
						<TextField
							value={props.height}
							type='number'
							placeholder='height'
							label='height'
							onChange={
								(e: any) =>
									props.actions.changeSize({w: props.width, h: e.target.value})
							}
						/>
					</div>
				</div>
			</div>
		);
	}
);
