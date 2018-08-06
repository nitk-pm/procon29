import * as React from 'react';
import * as Common from '../../common';
import Board from '../container/board'
import AppBar from '../container/appbar';
import { ActionDispatcher } from '../container/game';

import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import { withStyles, WithStyles } from '@material-ui/core/styles';

import * as Store from '../store';
import { Option } from 'monapt';

export interface GameProps {
	actions: ActionDispatcher;
	inDialog: boolean;
	board: Common.Table;
	server: Store.Server;
	ip: string;
	port: string;
	freeze: boolean;
	time: number;
	viewBoard: Option<Common.Table>;
}

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

type ClassNames = keyof typeof styles;

export const Game = withStyles(styles)<GameProps>(
	(props: GameProps & WithStyles<ClassNames>) => {
		const classes = props.classes;
		let page;

		page = props.viewBoard.match({
			Some: board => (
				<div>
					<Board table={board}/>
				</div>),
			None: () => {
				if (props.inDialog) {
					let errorMsg;
					if (!props.server.connected && props.server.msg.length != 0) {
						errorMsg = <span>props.connectionStatus.msg</span>;
					}
					return (
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
								<div className='player-or-user'>
									<Button
										className={classes.button}
										variant='contained'
										color='primary'
										onClick={() => props.actions.connectAsPlayer(Common.Color.Blue)}>
										Player
									</Button>
									<Button
										className={classes.button}
										variant='contained'
										color='primary'
										onClick={() => props.actions.connectAsUser(Common.Color.Blue)}>
										User
									</Button>
								</div>
								<div>
									<Button
										className={classes.button}
										variant='contained'
										color='secondary'
										onClick={() => props.actions.connectAsPlayer(Common.Color.Red)}>
										Player
									</Button>
									<Button
										className={classes.button}
										variant='contained'
										color='secondary'
										onClick={() => props.actions.connectAsUser(Common.Color.Red)}>
										User
									</Button>
								</div>
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
					let msg = props.freeze ? (<span>waiting for server response</span>) : null;
					let time = props.time.toFixed(1);
					return (
						<div>
							<div className='board-container'>
								<Board table={props.board}/>
							</div>
							<div className='info-container'>
								{msg}
							</div>
							<div className='fab'>
								<Button
									variant='fab'
									color='primary'
									aria-label='done'
									disabled={props.freeze}
									onClick={() => props.actions.done()}
									>
									<DoneIcon />
								</Button>
							</div>
							<Typography variant='display1'>
								{time}
							</Typography>
						</div>);
				}
			}
		});
		return (
			<div className='game-root'>
				<AppBar />
				{page}
			</div>
		);
	}
);
