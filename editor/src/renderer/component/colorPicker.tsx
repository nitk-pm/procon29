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
import Checkbox from '@material-ui/core/Checkbox';

import { Option } from 'monapt';

import { ActionDispatcher } from '../container/colorPicker';
import * as Common from '../../common';

export interface ColorPickerProps {
	actions: ActionDispatcher;
	pos: Option<Common.Pos>;
	board: Common.Table;
}

const styles = {
	open: {
		marginTop: '10vh'
	},
	save: {
	}
};

type ClassNames = keyof typeof styles;

export default withStyles(styles)<ColorPickerProps>(
	(props: ColorPickerProps & WithStyles<ClassNames>) => {
		let checked = (color: Common.Color) =>
			props.pos.match({
				Some: p =>
					props.board.arr[p.y][p.x].color == color,
				None: () => false
			});
		let open = props.pos.match({
			Some: p => true,
			None: () => false
		});
		let pos = props.pos.match({
			Some: p => p,
			None: () => null
		});
		return (
			<Drawer anchor='right' open={open} onClose={() => props.actions.close()}>
				<div
					tabIndex={0}
					role='button'
					onClick={() => props.actions.close()}
					onKeyDown={() => props.actions.close()}>
					<List>
						<ListItem
							key={0}
							role={undefined}
							dense
							button
							onClick={() => props.actions.changeColor(pos, Common.Color.Red)}
						>
							<Checkbox checked={checked(Common.Color.Red)} tabIndex={0} disableRipple />
							<ListItemText primary={'Red'} />
						</ListItem>
						<ListItem
							key={1}
							role={undefined}
							dense
							button
							onClick={() => props.actions.changeColor(pos, Common.Color.Blue)}
						>
							<Checkbox checked={checked(Common.Color.Blue)} tabIndex={1} disableRipple />
							<ListItemText primary={'Blue'} />
						</ListItem>
						<ListItem
							key={2}
							role={undefined}
							dense
							button
							onClick={() => props.actions.changeColor(pos, Common.Color.Neut)}
						>
							<Checkbox checked={checked(Common.Color.Neut)} tabIndex={2} disableRipple />
							<ListItemText primary={'Neut'} />
						</ListItem>
					</List>
				</div>
			</Drawer>
		);
	}
);
