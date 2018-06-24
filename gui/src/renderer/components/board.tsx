import * as React from 'react'
import * as Store from '../store';
import { ActionDispatcher } from '../container/board';

interface SquareProps {
	square: Store.Square;
	pos: Store.Pos;
	actions: ActionDispatcher;
}

export class Square extends React.Component<SquareProps> {
	render() {
		let styleName;
		switch (this.props.square.type) {
		case Store.SquareType.Red: styleName = "square red"; break
		case Store.SquareType.Blue: styleName = "square blue"; break
		case Store.SquareType.Neut: styleName = "square neut"; break
		}
		let imgTag;
		const walkImg = <img className="square-icon" src="./icons/material-design-icons/baseline-directions_walk-24px.svg" />;
		const suggestImg = <img className="square-icon" src="./icons/material-design-icons/baseline-radio_button_unchecked-24px.svg" />;
		switch (this.props.square.state) {
		case Store.SquareState.Suggested: imgTag=suggestImg;break;
		case Store.SquareState.Moved: imgTag=null;break;
		case Store.SquareState.Ready: imgTag=walkImg;break;
		case Store.SquareState.Wait: imgTag=walkImg;break;
		case Store.SquareState.Empty: imgTag=null;break;
		}
		return (
		<div className={styleName}
			onClick={() => this.props.actions.lclick(this.props.pos)}
			onContextMenu={() => this.props.actions.rclick(this.props.pos)}>
			<div className="square-iconbox">
				{imgTag}
			</div>
			<div className="square-score">{this.props.square.score}</div>
		</div>);
	}
}

interface BoardProps {
	table: Store.Table;
	actions: ActionDispatcher;
}

export class Board extends React.Component<BoardProps> {
	render() {
		const width = this.props.table.w;
		const height = this.props.table.h;
		const boardStyle = {
			margin: "0 auto",
			maxWidth: (7*(width+1)).toString() + "vh"
		};
		return (
			<div style={boardStyle}>{
				this.props.table.tbl.map((line, y)  =>
					<div className="board-row" key={y}>{
						line.map((square, x) =>
							<Square actions={this.props.actions} square={square} pos={{x, y}} key={x*height+y}/>)
					}</div>
				)
			}</div>
		);
	}
}
