import { Option, None } from 'monapt';

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
	score: Option<number>;
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
			case 'Red':
				color = Color.Red;
				break;
			case 'Blue':
				color = Color.Blue;
				break;
			default:
				color = Color.Neut;
				break;
			}
			if (square.score != 'null') {
				return { color, score: Option(parseInt(square.score)) };
			}
			else {
				return { color, score: None };
			}
		}));
	return {w, h, arr};
}

export function exportBoard(tbl: Table) {
	let arr = tbl.arr.map(line =>
		line.map(square => {
			let score = square.score.match({
				Some: score => score,
				None: () => null
			});
			return { score, color: square.color, agent: square.color != Color.Neut };
		}));
	return arr;
}
