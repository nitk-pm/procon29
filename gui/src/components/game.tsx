import * as React from 'react';
import * as Logic from '../logic/igokabaddi';
import Board from '../container/board'
import { ActionDispatcher } from '../container/game';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

import { ipcRenderer } from 'electron';
import * as Store from '../store';

interface GameProps {
	board: Store.BoardState;
	actions: ActionDispatcher;
}

export class Game extends React.Component<GameProps> {
	state: {
		open: boolean;
	}
	constructor(props: GameProps) {
		super(props);
		this.state = {
			open: false
		};
	}
	handleToggle() {
		this.setState({
			open: !this.state.open
		});
	}
	render() {
		return (
			<MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
				<div>
					<AppBar
						title="囲碁カバディ"
						onLeftIconButtonClick={() => this.handleToggle()}
						onRightIconButtonClick={() => ipcRenderer.send('message', 'exit')}
						iconElementRight={<IconButton><NavigationClose /></IconButton>}
						iconStyleLeft={{WebkitAppRegion: 'no-drag'} as React.CSSProperties}
						iconStyleRight={{WebkitAppRegion: 'no-drag'} as React.CSSProperties}
						style={{WebkitAppRegion: 'drag'} as React.CSSProperties}
					/>
					<Drawer open={this.state.open}
						docked={false}
						onRequestChange={(open) => this.setState({open: open})}
					>
						<MenuItem>open</MenuItem>
					</Drawer>
					<div className="board-container">
						<Board />
					</div>
					<div className="info-container">
						<RaisedButton label="turn end"/>
					</div>
				</div>
			</MuiThemeProvider>
		);
	}
}
