import React from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button'

import OpenIcon from '@material-ui/icons/FileUpload';
import SaveIcon from '@material-ui/icons/Save';

import { ActionDispatcher } from '../container/drawer';

export interface DrawerProps {
	actions: ActionDispatcher;
	open: boolean;
}

const styles = {
	open: {
		marginTop: '10vh'
	},
	save: {
	}
};

type ClassNames = keyof typeof styles;

export default withStyles(styles)<DrawerProps>(
	(props: DrawerProps & WithStyles<ClassNames>) => {
		return (
			<Drawer anchor='left' open={props.open} onClose={() => props.actions.close()}>
				<div
					tabIndex={0}
					role='button'
					onClick={() => props.actions.close()}
					onKeyDown={() => props.actions.close()}>
					<List>
						<label htmlFor='file-input'>
							<ListItem button className={props.classes.open}>
								<ListItemIcon><OpenIcon /></ListItemIcon>
								<ListItemText primary='Open'/>
							</ListItem>
						</label>
						<ListItem button className={props.classes.save} onClick={() => props.actions.save()}>
							<ListItemIcon><SaveIcon /></ListItemIcon>
							<ListItemText primary='Save'/>
						</ ListItem>
					</List>
				</div>
			</Drawer>
		);
	}
);
