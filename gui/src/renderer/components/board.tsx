import * as React from 'react'
import * as Store from '../store';
import { ActionDispatcher } from '../container/board';
import * as Common from '../../common';
import { Option, None } from 'monapt';

enum SquareState {
	Wait,
	Clear,
	Move
}

interface SquareProps {
	square: Common.Square;
	pos: Store.Pos;
	actions: ActionDispatcher;
	dir: number; // rad MoveまたはClearの場合
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
			transform: 'rotate(' + this.props.dir + 'rad)'
		};
		let img = null;
		if (this.props.square.agent) {
			let imgPath;
			switch (this.props.state) {
			case SquareState.Wait:
				imgPath = './icons/material-design-icons/baseline-adjust-24px.svg';
				break;
			case SquareState.Clear:
				imgPath = './icons/material-design-icons/outline-forward-24px.svg';
				break;
			case SquareState.Move:
				imgPath = './icons/material-design-icons/baseline-forward-24px.svg';
				break;
			}
			img = <img style={imgStyle} src={imgPath} className='square-icon'/>;
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
	highlight: Option<Common.Pos>;
	operation: Array<Common.Operation>;
	rivalOperation: Array<Common.Operation>;
	dir: string;
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

		// FIXME 読みにくくないですか
		let calcIconAndDir = (pos: Common.Pos, ops: Array<Common.Operation>) => {
			for(var i=0; i < ops.length; ++i) {
				if (ops[i].from.x == pos.x && ops[i].from.y == pos.y) {
					let dir = Math.atan2(ops[i].to.y-pos.y, ops[i].to.x-pos.x);
					let state = SquareState.Wait;
					if (ops[i].type == Common.OperationType.Move) {
						state = SquareState.Move;
					}
					else if (ops[i].type == Common.OperationType.Clear){
						state = SquareState.Clear;
					}
					return {dir, state};
				}
			}
			return {dir: 0, state: SquareState.Wait};
		};
		return (
			<div className={"board-root board-root-"+this.props.dir}>{
				this.props.table.arr.map((line, y)  =>
					<div className={"board-row board-row-"+this.props.dir} key={y}>{
						line.map((square, x) => {
							let {dir, state} = calcIconAndDir({x, y}, this.props.operation.concat(this.props.rivalOperation));
							return (<Square
								actions={this.props.actions}
								square={square}
								pos={{x, y}}
								key={x*height+y}
								dir={dir}
								state={state}
								highlight={isHighlighted(x, y)}
							/>);
						})
					}</div>
				)
			}</div>
		);
	}
}
