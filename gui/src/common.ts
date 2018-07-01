export type Pos = {
	x: number,
	y: number
}

export enum Color {
	Red,
	Blue,
	Neut
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

export enum OperationType {
	Move,
	Clear
}

export type Operation = {
	pos: Pos,
	type: OperationType
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

