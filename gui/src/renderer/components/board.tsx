import * as React from 'react'
import * as Store from '../store';
import { ActionDispatcher } from '../container/board';
import * as Common from '../../common';
import { Option, None } from 'monapt';

interface SquareProps {
	square: Common.Square;
	pos: Store.Pos;
	actions: ActionDispatcher;
	highlight: boolean;
	colorMap: Array<{back: string; forward: string}>
}

export class Square extends React.Component<SquareProps> {
	render() {
		let styleName;
		switch (this.props.square.color) {
		case Common.Color.Red: styleName = "square red"; break
		case Common.Color.Blue: styleName = "square blue"; break
		case Common.Color.Neut: styleName = "square neut"; break
		}
		let img = null;
		let containerOpacity = this.props.highlight ? 0.6 : 1.0;
		let scoreStyle, squareStyle;
		if (this.props.square.agent >= 0) {
			let imgPath = './icons/material-design-icons/baseline-adjust-24px.svg';
			img = <img src={imgPath} className='square-icon'/>;
			scoreStyle = {
				backgroundColor: this.props.colorMap[this.props.square.agent].back,
				color: this.props.colorMap[this.props.square.agent].forward
			};
			squareStyle = {
				opacity:  containerOpacity
			}
		}
		else {
			let brightness = this.props.square.score * 16 + 127;
			squareStyle = {
				backgroundColor : 'rgb('+brightness+', '+brightness+', '+brightness+')'
			}
		}
		return (
		<div className={styleName}
			style={squareStyle}
			onClick={() => this.props.actions.lclick(this.props.pos)}
			onContextMenu={() => this.props.actions.rclick(this.props.pos)}>
			<div className="square-iconbox">
				{img}
			</div>
			<div className="square-score" style={scoreStyle}>{this.props.square.score}</div>
		</div>);
	}
}

interface BoardProps {
	table: Common.Table;
	actions: ActionDispatcher;
	highlight: Option<Common.Pos>;
	dir: string;
	colorMap: Array<{back: string; forward: string}>
}

export class Board extends React.Component<BoardProps> {
	render() {
		const width = this.props.table.w;
		const height = this.props.table.h;
		const boardStyle = {
			margin: "0 auto",
			maxWidth: (7*(width+1)).toString() + "vh"
		};

		let isHighlighted = (x: number, y: number) => this.props.highlight.match({
				Some: p => p.x == x && p.y == y,
				None: () => false});
		return (
			<div className={"board-root board-root-"+this.props.dir}>{
				this.props.table.arr.map((line, y)  =>
					<div className={"board-row board-row-"+this.props.dir} key={y}>{
						line.map((square, x) => {
							return (<Square
								actions={this.props.actions}
								square={square}
								pos={{x, y}}
								key={x*height+y}
								colorMap={this.props.colorMap}
								highlight={isHighlighted(x, y)}
							/>);
						})
					}</div>
				)
			}</div>
		);
	}
}
