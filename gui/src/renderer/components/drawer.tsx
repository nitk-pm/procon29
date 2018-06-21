import * as React from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import FileDownloadIcon from '@material-ui/icons/FileDownload';


import { ActionDispatcher } from '../container/drawer';

const styles = {
	list: {
		width: 250
	},
	fullList: {
		width: 'auto'
	}
};

type ClassNames = keyof typeof styles;

interface WindowDrawerProps{
	state: boolean;
	actions: ActionDispatcher;
}

export class WindowDrawerComp extends React.Component<WindowDrawerProps & WithStyles<ClassNames>>{
	render() {
		const classes = this.props.classes;
		return (
			<Drawer anchor='left' open={this.props.state} onClick={() => this.props.actions.toggleDrawer(false)}>
				<div
					tabIndex={0}
					role='button'
					onClick={() => this.props.actions.toggleDrawer(false)}
					onKeyDown={() => this.props.actions.toggleDrawer(false)}>
					<div className={classes.list}>
						<List>
							<ListItem>
								<ListItemIcon>
									<FileDownloadIcon />
								</ListItemIcon>
								<ListItemText primary='open'/>
							</ListItem>
						</List>
					</div>
				</div>
			</Drawer>
		);
	}
}

export const WindowDrawer = withStyles(styles)(WindowDrawerComp);
