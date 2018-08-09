import { Option, None } from 'monapt';

export type Pos = {
	x: number,
	y: number
}

export enum Color {
	Red = 'Red',
	Blue = 'Blue'
}

export type Square = {
	agent: Option<Color>;
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
			let agent;
			switch(square.color) {
			case 'Red':
				agent = Option(Color.Red);
				break;
			case 'Blue':
				agent = Option(Color.Blue);
				break;
			default:
				agent = None;
				break;
			}
			if (square.score != 'null') {
				return { agent, score: Option(parseInt(square.score)) };
			}
			else {
				return { agent, score: None };
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
			let agent = square.agent.match({
				Some: color => color,
				None: () => 'Neut'
			});
		}));
	return arr;
}
