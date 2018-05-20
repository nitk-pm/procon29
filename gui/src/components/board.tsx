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
		const walkImg = <img className="square-icon" src='./icons/material-design-icons/baseline-directions_walk-24px.svg'/>;
		const suggestedImg = <img className="square-icon" src='./icons/material-design-icons/baseline-radio_button_unchecked-24px.svg'/>;
		var imgTag = null;
		if (this.props.square.agent) {
			imgTag = walkImg;
		}
		else if (this.props.square.suggested) {
			imgTag = suggestedImg;
		}
		return (
		<div className={styleName} onClick={() => this.props.actions.click(this.props.pos)}>
			<div className="square-iconbox">
				{imgTag}
			</div>
			<div className="square-score">{this.props.square.score}</div>
		</div>);
	}
}



interface BoardProps {
	board: Store.BoardState;
	actions: ActionDispatcher;
}

export class Board extends React.Component<BoardProps> {
	render() {
		const width = this.props.board.w;
		const height = this.props.board.h;
		const boardStyle = {
			margin: "0 auto",
			maxWidth: (7*(width+1)).toString() + "vh"
		};
		return (
			<div
				style={boardStyle}
			>{
				this.props.board.tbl.map((line, y)  =>
					<div className="board-row" key={y}>{
						line.map((square, x) =>
							<Square actions={this.props.actions} square={square} pos={new Logic.Pos(x, y)} key={x*height+y}/>)
					}</div>
				)
			}</div>
		);
	}
}
