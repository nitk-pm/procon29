import * as React from 'react';
import * as Igokabaddi from '../logic/igokabaddi';
import Board from '../container/board'
import { ActionDispatcher } from '../container/game';

interface GameProps {
	board: Igokabaddi.Board;
	turn: Igokabaddi.Turn;
	actions: ActionDispatcher;
}

export class Game extends React.Component<GameProps> {
	render() {
		return (
			<div className="game">
				<div className="game-board">
					<Board />
				</div>
				<div className="game-info">
					<div>{}</div>
					<ol>{}</ol>
				</div>
			</div>
		);
	}
}
