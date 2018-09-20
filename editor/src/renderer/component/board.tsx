import * as React from 'react';

import { Option } from 'monapt';

import * as Common from '../../common';
import { ActionDispatcher } from '../container/board';

import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';

interface SquareProps {
	square: Common.Square;
	pos: Common.Pos;
	actions: ActionDispatcher;
}

class Square extends React.Component<SquareProps> {
	render () {
		let color;
		switch (this.props.square.color) {
		case Common.Color.Red:
			color = '#d32f2f';
			break;
		case Common.Color.Blue:
			color = '#303F9F';
			break;
		case Common.Color.Neut:
			color = 'FFFFFFF';
			break;
		}
		let style = {
			backgroundColor: color,
			height: '7vh',
			width: '7vh',
			border: '1px solid #000',
			marginRight:  '-1px',
			marginTop: '-1px',
		};
		return (
			// float:leftの指定
			<div
				className='square' style={style}
			>
				<TextField
					value={
						this.props.square.score.match({
							Some: num => num,
							None: () => 0
						})
					}
					fullWidth
					type='number'
					onChange={
						(e: any) =>
							this.props.actions.changeScore(this.props.pos, e.target.value)
					}
				/>
				<div className='color' style={{ height: '100%' }}
					onClick={() => this.props.actions.toggleColorPicker(this.props.pos)}
				></div>
			</div>
		);
	}
}

interface BoardProps {
	board: Common.Table;
	actions: ActionDispatcher;
}

export default class Board extends React.Component<BoardProps> {
	render () {
		let tbl = this.props.board;
		if (this.props.board != null) {
			return (
				// flex-direction: rowする
				<div className='board'>
					{tbl.arr.slice(0, tbl.h).map(
						// 疑似要素で改行するのでCSSに
						(line, y) => (<div key={y} className='board-row'>{
							line.slice(0, tbl.w).map(
								(square, x) => (
									<Square
										square={square}
										key={y*100+x+'-'+square.score+'-'+square.color}
										pos={{x, y}}
										actions={this.props.actions}
									/>
								)
							)
						}</div>)
					)}
				</div>
			);
		}
		else {
			return (
				<div></div>
			);
		}
	}
}
