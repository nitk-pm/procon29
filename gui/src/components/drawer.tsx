import * as React from 'react';
import { withStyles, WithStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import List from 'material-ui/List';
import ListItem from 'material-ui/List/ListItem';
import ListItemIcon from 'material-ui/List/ListItemIcon';
import ListItemText from 'material-ui/List/ListItemText';
import Divider from 'material-ui/Divider';
import FileDownloadIcon from 'material-ui-icons/FileDownload';

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
			<Drawer anchor='left' open={this.props.state} onClose={() => this.props.actions.toggleDrawer(false)}>
				<div
					tabIndex={0}
					role='button'
					onClick={() => {this.props.actions.toggleDrawer(false)}}
					onKeyDown={() => {this.props.actions.toggleDrawer(false)}}>
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
