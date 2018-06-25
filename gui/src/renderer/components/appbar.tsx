import * as React from 'react';
import * as PropTypes from 'prop-types';

import { withStyles, WithStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import { ActionDispatcher } from '../container/appbar';

export interface WindowAppBarProps{
	actions: ActionDispatcher;
}

type ClassNames = keyof typeof styles;

const styles = {
	root: {
		flexGrow: 1,
		WebkitAppRegion: 'drag'
	},
	flex: {
		flex: 1
	},
	menuButton: {
		marginLeft: -12,
		marginRight: 20,
		WebkitAppRegion: 'no-drag'
	},
	closeButton: {
		WebkitAppRegion: 'no-drag'
	}
};

export const WindowAppBar = withStyles(styles)<WindowAppBarProps>(
	(props: WindowAppBarProps & WithStyles<ClassNames>) => {
		const classes = props.classes;
		return (
			<div className={classes.root}>
				<AppBar position='static'>
					<Toolbar>
						<IconButton className={classes.menuButton}
							color='inherit'
							aria-label='Menu'>
							<MenuIcon />
						</IconButton>
						<Typography variant='title' color='inherit' className={classes.flex}>
							囲碁カバディ
						</Typography>
						<IconButton
							color='inherit'
							className={classes.closeButton}
							onClick={() => props.actions.close()}>
							<CloseIcon />
						</IconButton>
					</Toolbar>
				</AppBar>
			</div>);
	}
);
