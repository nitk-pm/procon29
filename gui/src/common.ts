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
			let color = square.color ==
				'Red' ? Color.Red :
				'Blue' ? Color.Blue : Color.Neut;
			let score = parseInt(square.score);
			let agent = square.agent == 'true';
			return {color, score, agent};
		}));
	return {w, h, arr};
}

