export type Pos = {
	x: number,
	y: number
}

export enum Color {
	Red = 'Red',
	Blue = 'Blue',
	Neut = 'Neut'
}

export type Square = {
	color: Color;
	score: number;
	agent: boolean;
}

export type Table = {
	arr: Square[][],
	w: number;
	h: number;
}

/*
 * board.json形式
 */
export function loadBoard(json: Array<Array<any>>): Table {
	let h = json.length;
	let w = json[0].length;
	let arr = json.map(line =>
		line.map(square => {
			let color;
			switch(square.color) {
			case 'Red': color = Color.Red;break;
			case 'Blue': color = Color.Blue;break;
			case 'Neut': color = Color.Neut;break;
			default: throw 'unexpected color'
			}
			let score = parseInt(square.score);
			let agent = square.agent as boolean;
			return {color, score, agent};
		}));
	return {w, h, arr};
}

export function loadOperations(json: Array<any> ): Operation[] {
	return json.map(op => {
		let from = {x: parseInt(op.pos.x), y: parseInt(op.pos.y)};
		let to  = {x: parseInt(op.to.x), y: parseInt(op.to.y)};
		let type;
		switch (op.type) {
		case 'Move': type = OperationType.Move; break;
		case 'Clear': type = OperationType.Clear; break;
		default: throw 'unexpected Operation type';
		}
		return { from, to, type };
	});
}
