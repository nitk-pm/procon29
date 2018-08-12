import * as React from 'react';

import { Option } from 'monapt';

import * as Common from '../../common';
import { ActionDispatcher } from '../container/board';

interface SquareProps {
	square: Common.Square;
	pos: Common.Pos;
}

class Square extends React.Component<SquareProps> {
	render () {
		let color = this.props.square.agent.match({
			Some: color => {
				if (color == Common.Color.Red)
					return 'd32f2f';
				else
					return '303F9F';
			},
			None: () => 'FFFFFF'
		});
		let style = {
			backgroundColor: color,
			height: '6vh',
			width: '6vh',
		};
		return (
			// float:leftの指定
			<div className='square' style={style}>
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
		if (this.props.board != null) {
			return (
				// flex-direction: rowする
				<div className='board'>
					{this.props.board.arr.map(
						// 疑似要素で改行するのでCSSに
						(line, y) => (<div key={y} className='board-row'>{
							line.map(
								(square, x) => <Square square={square} key={y*100+x} pos={{x, y}}/>
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
