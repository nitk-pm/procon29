import * as React from 'react'
import * as Square from './square';
import * as Igokabaddi from '../logic/igokabaddi'

interface BoardProps {
	turn: Igokabaddi.Turn;
	board: Igokabaddi.Board;
}

export class Board extends React.Component<BoardProps> {
	state: { board : Igokabaddi.Board, turn: Igokabaddi.Turn};
	constructor(props: BoardProps) {
		super(props);
		this.state = {board: props.board, turn: props.turn};
	}
	createBoard () {
		console.log(this.state.board);
		return this.state.board.table.map((line, y, table) =>
			<div className="board-row" key={y}>{
				line.map((square, x, table) =>
					<Square.Square square={square} key={x*this.state.board.height+y}/>)
			}</div>
		);
	}
	render() {
		var colorClass: string, playerName: string;
		if (this.state.turn == Igokabaddi.Turn.Red) {
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
