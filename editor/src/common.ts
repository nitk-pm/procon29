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

export function newBoard (w: number, h: number) {
	let arr = new Array<Array<Square>>();
	for (let i = 0; i < h; ++i) {
		let line = new Array<Square>();
		for (let j = 0; j < w; ++j) {
			line.push({
				color: Color.Neut,
				score: None
			});
		}
		arr.push(line);
	}
	return { arr, w, h };
}

export function resizeBoard(tbl: Table, w: number, h: number) {
	let arr = tbl.arr.map(line => line.map(square => ({...square})));
	for (let y = 0; y < h; ++y) {
		if (y >= arr.length) {
			arr.push(new Array<Square>());
		}
		for (let x = 0; x < w; ++x) {
			if (x >= arr[y].length) {
				arr[y].push({
					color: Color.Neut,
					score: None
				});
			}
		}
	}
	return { w, h, arr };
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
	let redCnt = 0;
	let blueCnt = 0;
	let arr = tbl.arr.slice(0, tbl.h).map(line =>
		line.slice(0, tbl.w).map(square => {
			let score = square.score.match({
				Some: score => score,
				None: () => 0
			});
			let agent;
			if (square.color == Color.Red) {
				agent = redCnt++;
			}
			else if (square.color == Color.Blue) {
				agent = blueCnt++;
			}
			else {
				agent = -1;
			}
			return { score, color: square.color, agent};
		}));
	return arr;
}
