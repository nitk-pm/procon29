import * as React from 'react';
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
}

const styles={};

type ClassNames = keyof typeof styles;

export const Game = withStyles(styles)<GameProps>(
	(props: GameProps & WithStyles<ClassNames>) => {
		const classes = props.classes;
		let page;
		if (props.inDialog) {
			 page = (
				<div>
					<TextField
						id='ip'
						label='ip'
						value={props.ip} />
					<TextField
						id='port'
						label='port'
						value={props.port} />
					<Button variant='contained' color='primary'>
						Player
					</Button>
					<Button variant='contained' color='secondary'>
						User
					</Button>
				</div>);
		}
		else {
			page = (
				<div>
					<div className='board-container'>
						<Board />
					</div>
					<div className='info-container'>
					</div>
					<div className='fab'>
						<Button variant='fab' color='primary' aria-label='done' onClick={() => props.actions.done()}>
							<DoneIcon />
						</Button>
					</div>
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
