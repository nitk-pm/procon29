import * as React from "react";
import * as Igokabaddi from "../logic/igokabaddi";

interface SquareProps {
	square: Igokabaddi.Square;
}

class Square extends React.Component<SquareProps> {
	state: Igokabaddi.Square;
	constructor(props: SquareProps) {
		super(props);
		this.state = props.square;
	}
	render() {
		switch (this.state.color) {
		case Igokabaddi.Color.Red:
			return <button className="square red"></button>;
		case Igokabaddi.Color.Blue:
			return <button className="square blue"></button>;
		case Igokabaddi.Color.Neut:
			return <button className="square neut"></button>;
		}
	}
}

interface BoardProps {
	board: Igokabaddi.Board;
}

class Board extends React.Component<BoardProps> {
	state: { board : Igokabaddi.Board };
	constructor(props: BoardProps) {
		super(props);
		this.state = {board: props.board};
	}
	createBoard () {
		console.log(this.state.board);
		return this.state.board.table.map((line, y, table) =>
			<div className="board-row" key={y}>{
				line.map((square, x, table) =>
					<Square square={square} key={x*this.state.board.height+y}/>)
			}</div>
		);
	}
	render() {
		const status = "Next player: X";
		return (
			<div>
				<div className="status">{status}</div>
				{this.createBoard()}
			</div>
		);
	}
}

interface GameProps {
	board: Igokabaddi.Board;
}

export class Game extends React.Component<GameProps> {
	state: Igokabaddi.Board;
	constructor(props: GameProps) {
		super(props);
		this.state = props.board;
	}
	render() {
		return (
			<div className="game">
				<div className="game-board">
					<Board board={this.state}/>
				</div>
				<div className="game-info">
					<div>{}</div>
					<ol>{}</ol>
				</div>
			</div>
		);
	}
}
