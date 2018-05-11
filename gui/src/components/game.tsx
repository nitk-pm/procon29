import * as React from 'react';
import * as Logic from '../logic/igokabaddi';
import Board from '../container/board'
import { ActionDispatcher } from '../container/game';

interface GameProps {
	board: Logic.Board;
	turn: Logic.Turn;
	actions: ActionDispatcher;
}

export class Game extends React.Component<GameProps> {
	render() {
		var playerNameStyle: string;
		var playerName: string;
		if (this.props.turn == Logic.Turn.Red) {
			playerNameStyle = "blue";
			playerName = "Blue";
		}
		else {
			playerNameStyle = "red";
			playerName = "Red";
		}
		return (
			<div className="game">
				<div className="game-board">
					turn:<span className={playerNameStyle}>{playerName}</span>
					<Board />
					<button onClick={() => this.props.actions.endTurn()}>end turn</button>
				</div>
				<div className="game-info">
				</div>
			</div>
		);
	}
}
