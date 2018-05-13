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

interface GameProps {
	board: Logic.Board;
	turn: Logic.Turn;
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
				<div className="root">
					<AppBar
						title="囲碁カバディ"
						onLeftIconButtonClick={() => this.handleToggle()}
					/>
					<Drawer open={this.state.open}
						docked={false}
						onRequestChange={(open) => this.setState({open: open})}
					>
						<MenuItem>open</MenuItem>
					</Drawer>
					<Board />
				</div>
			</MuiThemeProvider>
		);
	}
}
