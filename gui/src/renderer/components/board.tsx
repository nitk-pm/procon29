import * as React from 'react'
import * as Store from '../store';
import { ActionDispatcher } from '../container/board';
import * as Common from '../../common';

// 方向(東西南北表記)
enum Direction {
	N = '0',
	NE = '45',
	E = '90',
	SE = '135',
	S = '180',
	SW = '225',
	W = '270',
	NW = '315'
}

enum SquareState {
	Wait,
	Clear,
	Move
}

interface SquareProps {
	square: Common.Square;
	pos: Store.Pos;
	actions: ActionDispatcher;
	dir: Direction;
	state: SquareState;
	highlight: boolean;
}

export class Square extends React.Component<SquareProps> {
	render() {
		let styleName;
		switch (this.props.square.color) {
		case Common.Color.Red: styleName = "square red"; break
		case Common.Color.Blue: styleName = "square blue"; break
		case Common.Color.Neut: styleName = "square neut"; break
		}
		const imgStyle = {
			transform: 'rotate(' + this.props.dir + 'deg)'
		};
		let img = null;
		if (this.props.square.agent) {
			let imgPath;
			switch (this.props.state) {
			case SquareState.Wait:
				imgPath = './icons/material-design-icons/baseline-adjust-24px.svg';
				break;
			case SquareState.Clear:
				imgPath = './icons/material-design-icons/baseline-forward-24px.svg';
				break;
			case SquareState.Move:
				imgPath = './icons/material-design-icons/outline-forward-24px.svg';
				break;
			}
			img = <img style={imgStyle} src={imgPath} />;
		}
		let containerOpacity = this.props.highlight ? 0.6 : 1.0;
		return (
		<div className={styleName}
			style={{ opacity: containerOpacity }}
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
	highlight: Common.Pos;
}

export class Board extends React.Component<BoardProps> {
	render() {
		const width = this.props.table.w;
		const height = this.props.table.h;
		const boardStyle = {
			margin: "0 auto",
			maxWidth: (7*(width+1)).toString() + "vh"
		};
		let isHighlighted = (x: number, y: number) =>
			this.props.highlight && x == this.props.highlight.x && y == this.props.highlight.y;
		return (
			<div style={boardStyle}>{
				this.props.table.arr.map((line, y)  =>
					<div className="board-row" key={y}>{
						line.map((square, x) =>
							<Square
								actions={this.props.actions}
								square={square}
								pos={{x, y}}
								key={x*height+y}
								dir={null}
								state={SquareState.Wait}
								highlight={isHighlighted(x, y)}
							/>)
					}</div>
				)
			}</div>
		);
	}
}
