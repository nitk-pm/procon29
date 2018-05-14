import * as React from 'react'
import * as Logic from '../logic/igokabaddi';
import * as Store from '../store';
import { ActionDispatcher } from '../container/board';

interface SquareProps {
	square: Store.SquareState;
	pos: Logic.Pos;
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
		if (this.props.square.agent)
			styleName += '-highlight'
		if (this.props.square.suggested)
			styleName += ' suggested'
		console.log(styleName);
		return (<div className={styleName} onClick={() => this.props.actions.click(this.props.pos)}>
			{this.props.square.score}
		</div>);
	}
}



interface BoardProps {
	board: Store.BoardState;
	actions: ActionDispatcher;
}

export class Board extends React.Component<BoardProps> {
	render() {
		const width = this.props.board[0].length;
		const height = this.props.board.length;
		const boardStyle = {
			margin: "0 auto",
			maxWidth: (7*(width+1)).toString() + "vh"
		};
		return (
			<div
				style={boardStyle}
			>{
				this.props.board.map((line, y)  =>
					<div className="board-row" key={y}>{
						line.map((square, x) =>
							<Square actions={this.props.actions} square={square} pos={new Logic.Pos(x, y)} key={x*height+y}/>)
					}</div>
				)
			}</div>
		);
	}
}
