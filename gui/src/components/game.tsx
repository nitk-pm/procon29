import * as React from 'react';
import * as Logic from '../logic/igokabaddi';
import Board from '../container/board'
import AppBar from '../container/appbar';
import { ActionDispatcher } from '../container/game';

import Drawer from 'material-ui/Drawer';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';

import { ipcRenderer } from 'electron';
import * as Store from '../store';

interface GameProps {
	board: Store.BoardState;
	actions: ActionDispatcher;
}

export class Game extends React.Component<GameProps> {
	render() {
		return (
			<div>
				<AppBar />
				<div className="board-container">
					<Board />
				</div>
				<div className="info-container">
					<Button variant="raised">
						Turn End
					</Button>
				</div>
			</div>
		);
	}
}
