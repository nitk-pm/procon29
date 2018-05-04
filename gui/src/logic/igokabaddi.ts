export class Pos {
	x: number;
	y: number;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

export enum Color {
	Red,
	Blue,
	Neut
}

export class Square {
	color: Color;
	score: number;
	constructor(color: Color, score: number) {
		this.color = color;
		this.score = score;
	}
}

export class Board {
	width: number;
	height: number;
	table: Square[][];
	blue: Pos[];
	red:  Pos[];
	constructor(json: any) {
		const height = parseInt(json.height);
		const width  = parseInt(json.width);
		this.height = height;
		this.width = width;
		this.table = new Array<Array<Square>>(height);
		for (var y = 0; y < height; ++y) {
			this.table[y] = new Array<Square>(width);
			for (var x = 0; x < width; ++x) {
				const color = json.table[y][x].color;
				const score = parseInt(json.table[y][x].score);
				switch (color) {
				case "Red":
					this.table[y][x] = new Square(Color.Red, score);
					break;
				case "Blue":
					this.table[y][x] = new Square(Color.Blue, score);
					break;
				case "Neut":
					this.table[y][x] = new Square(Color.Neut, score);
					break;
				}
			}
		}
		this.blue = new Array<Pos>(2);
		this.red  = new Array<Pos>(2);
		for (var i = 0; i < 2; ++i) {
			const x = json.blue[i].x;
			const y = json.blue[i].y;
			this.blue[i] = new Pos(x, y);
		}
		for (var i = 0; i < 2; ++i) {
			const x = json.red[i].x;
			const y = json.red[i].y;
			this.red[i] = new Pos(x, y);
		}
	}
}
