import * as React from 'react'
import * as Igokabaddi from '../logic/igokabaddi'
import * as Logic from '../logic/igokabaddi';
import { ActionDispatcher } from '../container/board';

interface SquareProps {
	square: Logic.Square;
	pos: Igokabaddi.Pos;
	actions: ActionDispatcher;
}

export class Square extends React.Component<SquareProps> {
	render() {
		var styleName: string;
		switch (this.props.square.color) {
		case Logic.Color.Red:
			styleName = "square red";
			break;
		case Logic.Color.Blue:
			styleName = "square blue";
			break;
		case Logic.Color.Neut:
			styleName = "square neut";
			break;
		}
		return (<button className={styleName} onClick={() => this.props.actions.click(this.props.pos)}>
			{this.props.square.score}
		</button>);
	}
}



interface BoardProps {
	board: Logic.Board;
	actions: ActionDispatcher;
}

export class Board extends React.Component<BoardProps> {
	render() {
		const boardStyle = {
			margin: "0 auto",
			maxWidth: (7*this.props.board.width).toString() + "vh"
		};
		console.log(boardStyle);
		return (
			<div
				style={boardStyle}
			>{
				this.props.board.table.map((line, y, table) =>
					<div className="board-row" key={y}>{
						line.map((square, x, table) =>
							<Square actions={this.props.actions} square={square} pos={new Logic.Pos(x, y)} key={x*this.props.board.height+y}/>)
					}</div>
				)
			}</div>
		);
	}
}
