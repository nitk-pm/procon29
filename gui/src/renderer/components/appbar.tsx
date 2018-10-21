import * as React from 'react';
import * as PropTypes from 'prop-types';

import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import { ActionDispatcher } from '../container/appbar';

import * as Store from '../store';


type ClassNames = keyof typeof styles;

const styles = (theme: Theme) => createStyles({
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
	backButton: {
		marginLeft: -12,
		marginRight: 20,
		WebkitAppRegion: 'no-drag'
	},
	closeButton: {
		WebkitAppRegion: 'no-drag'
	}
});

export interface WindowAppBarProps extends WithStyles<typeof styles>{
	actions: ActionDispatcher;
	state: Store.UIState;
}

export const WindowAppBar = withStyles(styles)(
	class extends React.Component<WindowAppBarProps> {
		render() {
			const classes = this.props.classes;
			const props = this.props;
			if (props.state == Store.UIState.Viewer) {
				return (
					<div className={classes.root}>
						<AppBar position='static'>
							<Toolbar>
								<IconButton className={classes.backButton}
									onClick={() => props.actions.back()}>
									<ArrowBackIcon />
								</IconButton>
								<Typography variant='h6' color='inherit' className={classes.flex}>
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
			else {
				return (
					<div className={classes.root}>
						<AppBar position='static'>
							<Toolbar>
								<IconButton className={classes.menuButton}
									color='inherit'
									aria-label='Menu'>
									<MenuIcon />
								</IconButton>
								<Typography variant='h6' color='inherit' className={classes.flex}>
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
		}
	}
);
