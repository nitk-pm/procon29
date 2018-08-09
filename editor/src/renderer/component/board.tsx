import * as React from 'react';

import { Option } from 'monapt';

import * as Common from '../../common';

interface SquareProps {
	square: Common.Square;
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
			height: '12vh',
			width: '12vh'
		};
		return (
			<td style={style}>
			</td>
		);
	}
}

interface BoardProps {
	board: Common.Table;
}

class Board extends React.Component<BoardProps> {
	render () {
		return this.props.board.arr.map(
			line => line.map(square =>
				(<tr>{<Square square={square} />}</tr>)));
	}
}
