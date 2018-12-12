import * as React from 'react';
import * as Common from '../../common';
import Board from '../container/board'
import AppBar from '../container/appbar';
import { ActionDispatcher } from '../container/game';

import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/RadioGroup';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import { withStyles, WithStyles } from '@material-ui/core/styles';

import * as Store from '../store';
import { Option } from 'monapt';

import * as GameModule from '../module/game';

const styles={
	input: {
		margin: '1vh'
	},
	button: {
		margin: '1vh'
	},
	fileInput: {
		display: 'none'
	}
};

export interface GameProps extends WithStyles<typeof styles>{
	actions: ActionDispatcher;
	state: Store.UIState
	board: Common.Table;
	server: Store.Server;
	ip: string;
	port: string;
	freeze: boolean;
	dir: string;
	rivalOps: Array<Common.Operation>;
	colorMap: Array<{back: string; forward: string}>;
	turn: number;
	score: {red: number; blue: number;};
	boardIsValid: boolean;
}

export const Game = withStyles(styles)(
	class extends React.Component<GameProps> {
		render() {
			let page;
			const classes = this.props.classes;
			const props = this.props;
			if (props.state == Store.UIState.Setting) {
				let errorMsg;
				if (!props.server.connected && props.server.msg.length != 0) {
					errorMsg = <span>props.connectionStatus.msg</span>;
				}
				page = (
					<div className='game-settings'>
						<div className='input-container'>
							<TextField
								className={classes.input}
								id='ip'
								label='ip'
								value={props.ip}
								onChange={(e) => props.actions.changeIp(e.target.value)}/>
							<TextField
								className={classes.input}
								id='port'
								label='port'
								value={props.port}
								onChange={(e) => props.actions.changePort(e.target.value)}/>
						</div>
						<div className='button-container'>
							<Button
								className={classes.button}
								variant='contained'
								color='primary'
								onClick={() => props.actions.connectAsPlayer(Common.Color.Blue)}>
								Launch!
							</Button>
						</div>
						<input
							accept='application/json,.json'
							className={classes.fileInput}
								id='contained-button-file'
								onChange={(e) => props.actions.loadBoard(e)}
								type='file'/>
						<label htmlFor='contained-button-file'>
							<Button variant='contained' component='span' className={classes.button}>
								File
							</Button>
						</label>
						{errorMsg}
					</div>);
			}
			else {
				page = (
					<div>
						<div className='board-container'>
							<Board table={props.board}/>
						</div>
					</div>
				);
			}
			return (
				<div className='game-root'>
					<AppBar />
					{page}
				</div>
			);
		}
	}
);
