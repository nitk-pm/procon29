import * as React from 'react'
import * as Igokabaddi from '../logic/igokabaddi'
import * as Logic from '../logic/igokabaddi';
import Square from '../container/square';
import { ActionDispatcher } from '../container/board';

interface BoardProps {
	board: Igokabaddi.Board;
	turn: Igokabaddi.Turn;
	actions: ActionDispatcher;
}

export class Board extends React.Component<BoardProps> {
	createBoard () {
		console.log(this.props.board);
		return this.props.board.table.map((line, y, table) =>
			<div className="board-row" key={y}>{
				line.map((square, x, table) =>
					<Square square={square} pos={new Logic.Pos(x, y)} key={x*this.props.board.height+y}/>)
			}</div>
		);
	}
	render() {
		var colorClass: string, playerName: string;
		if (this.props.turn == Igokabaddi.Turn.Red) {
			colorClass = "red";
			playerName = "Red";
		}
		else {
			colorClass = "blue";
			playerName = "Blue";
		}
		return (
			<div>
				<div className="status">
					Next player: 
					<span className={colorClass}>
						{playerName}
					</span>
				</div>
				{this.createBoard()}
				<button className="end-turn-button">TurnEnd</button>
			</div>
		);
	}
}
