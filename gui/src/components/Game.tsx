import * as React from 'react';
import * as Igokabaddi from '../logic/igokabaddi';
import * as Board from './Board'

interface GameProps {
	board: Igokabaddi.Board;
	turn: Igokabaddi.Turn;
}

export class Game extends React.Component<GameProps> {
	state: { board: Igokabaddi.Board, turn: Igokabaddi.Turn };
	constructor(props: GameProps) {
		super(props);
		this.state = { board: props.board, turn: props.turn};
	}
	render() {
		return (
			<div className="game">
				<div className="game-board">
					<Board.Board board={this.state.board} turn={this.state.turn}/>
				</div>
				<div className="game-info">
					<div>{}</div>
					<ol>{}</ol>
				</div>
			</div>
		);
	}
}
