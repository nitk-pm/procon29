import * as React from 'react'
import * as Store from '../store';
import { ActionDispatcher } from '../container/board';
import * as Common from '../../common';

interface SquareProps {
	square: Common.Square;
	pos: Store.Pos;
	actions: ActionDispatcher;
}

export class Square extends React.Component<SquareProps> {
	render() {
		let styleName;
		switch (this.props.square.color) {
		case Common.Color.Red: styleName = "square red"; break
		case Common.Color.Blue: styleName = "square blue"; break
		case Common.Color.Neut: styleName = "square neut"; break
		}
		let img = this.props.square.agent ?
			(<img src='./icons/material-design-icons/baseline-directions_walk-24px.svg' />) : null;
		return (
		<div className={styleName}
			onClick={() => this.props.actions.lclick(this.props.pos)}
			onContextMenu={() => this.props.actions.rclick(this.props.pos)}>
			<div className="square-iconbox">
				{img}
			</div>
			<div className="square-score">{this.props.square.score}</div>
		</div>);
	}
}

interface BoardProps {
	table: Common.Table;
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
				this.props.table.arr.map((line, y)  =>
					<div className="board-row" key={y}>{
						line.map((square, x) =>
							<Square actions={this.props.actions} square={square} pos={{x, y}} key={x*height+y}/>)
					}</div>
				)
			}</div>
		);
	}
}
