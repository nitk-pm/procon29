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
		var style: string;
		switch (this.props.square.color) {
		case Logic.Color.Red:
			style = "square red";
			break;
		case Logic.Color.Blue:
			style = "square blue";
			break;
		case Logic.Color.Neut:
			style = "square neut";
			break;
		}
		return <button className={style} onClick={() => this.props.actions.click(this.props.pos)}></button>;
	}
}



interface BoardProps {
	board: Logic.Board;
	actions: ActionDispatcher;
}

export class Board extends React.Component<BoardProps> {
	render() {
		console.log(this.props.board.table);
		return (
			<div>{
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
