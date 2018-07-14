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

export interface GameProps {
	actions: ActionDispatcher;
	inDialog: boolean;
	ip: string;
	port: string;
	connectError: boolean;
	freeze: boolean;
	time: number;
}

const styles={};

type ClassNames = keyof typeof styles;

export const Game = withStyles(styles)<GameProps>(
	(props: GameProps & WithStyles<ClassNames>) => {
		const classes = props.classes;
		let page;
		let errorMsg;
		if (props.connectError) {
			errorMsg = <span>CONNECT FAILED</span>;
		}
		if (props.inDialog) {
			 page = (
				<div>
					<TextField
						id='ip'
						label='ip'
						value={props.ip}
				 		onChange={(e) => props.actions.changeIp(e.target.value)}/>
					<TextField
						id='port'
						label='port'
						value={props.port}
				 		onChange={(e) => props.actions.changePort(e.target.value)}/>
					<Button variant='contained' color='primary' onClick={() => props.actions.connectAsPlayer(Common.Color.Blue)}>
						Player
					</Button>
					<Button variant='contained' color='primary' onClick={() => props.actions.connectAsUser(Common.Color.Blue)}>
						User
					</Button>
					<Button variant='contained' color='secondary' onClick={() => props.actions.connectAsPlayer(Common.Color.Red)}>
						Player
					</Button>
					<Button variant='contained' color='secondary' onClick={() => props.actions.connectAsUser(Common.Color.Red)}>
						User
					</Button>
					{errorMsg}
				</div>);
		}
		else {
			let msg = props.freeze ? (<span>waiting for server response</span>) : null;
			page = (
				<div>
					<div className='board-container'>
						<Board />
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
					<Typography>
						{props.time}
					</Typography>
				</div>);
		}
		return (
			<div>
				<AppBar />
				{page}
			</div>
		);
	}
);
