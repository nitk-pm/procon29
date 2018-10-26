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
	agent: number;
}

export type Table = {
	arr: Square[][],
	w: number;
	h: number;
}

export enum OperationType {
	Move = 'Move',
	Clear = 'Clear'
}

export type Operation = {
	from: Pos,
	type: OperationType,
	to: Pos
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
			let agent = parseInt(square.agent);
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

export function calcBaseDir(dir: string) {
	let baseAngle = 0.0;

}

export function calcDir(dir: string, origin: {x: number, y: number}, target: {x: number, y: number}) {
	let baseDir = Math.PI;
	let dy = target.y - origin.y;
	let dx = target.x - origin.x;
	let dx_, dy_;
	switch (dir) {
	case 'up':
		dx_ = dx;
		dy_ = dy;
		break;
	case 'right':
		dx_ = dy;
		dy_ = dx;
		break;
	case 'down':
		dx_ = dx;
		dy_ = -dy;
		break;
	case 'left':
		dx_ = -dy;
		dy_ = dx;
		break;
	}
	return Math.atan2(dy_, dx_) + baseDir;
}

type TreatedSquare = {
	color: Color;
	score: number;
	agent: number;
	visited: boolean;
}

type TreatedTable = {
	arr: TreatedSquare[][];
	w: number;
	h: number;
}

function addSpaceForFootprint(tbl: Table) {
	let arr = tbl.arr.map(l => l.map(s => ({...s, visited: false})));
	return {
		h: tbl.h,
		w: tbl.w,
		arr
	};
}

function sweepFootprint(tbl: TreatedTable) {
	let arr = tbl.arr.map(l => l.map(s => ({color: s.color, agent: s.agent, score: s.score})));
	return {
		h: tbl.h,
		w: tbl.w,
		arr
	};
}

function calcSurround(p: Pos, tbl: TreatedTable, color: Color) {
	if (tbl.arr[p.y][p.x].visited) return 0;
	if (tbl.arr[p.y][p.x].color == color) return 0;
	if (p.x == 0 || p.x == tbl.w - 1 || p.y == 0 || p.y == tbl.h - 1) return -Infinity;
	tbl.arr[p.y][p.x].visited = true;
	let peripheralScore = 0;
	for (let dx = -1; dx <= 1; ++dx) {
		peripheralScore += calcSurround({x: p.x+dx, y: p.y}, tbl, color);
	}
	for (let dy = -1; dy <= 1; ++dy) {
		peripheralScore += calcSurround({x: p.x, y: p.y+dy}, tbl, color);
	}
	return Math.abs(tbl.arr[p.y][p.x].score) + peripheralScore;
}

function calcSurroundTotal(tbl: TreatedTable, color: Color) {
	let total = 0;
	for (let x = 0; x < tbl.w; ++x) {
		for (let y = 0; y < tbl.h; ++y) {
			total += Math.max(calcSurround({x, y}, tbl, color), 0);
		}
	}
	return total;
}

function calcScoreOnColor(tbl: Table, color: Color) {
	let total = 0;
	for (let x = 0; x < tbl.w; ++x) {
		for (let y = 0; y < tbl.h; ++y) {
			if (tbl.arr[y][x].color == color)
				total += tbl.arr[y][x].score;
		}
	}
	return total;
}

export function calcScore(tbl: Table) {
	let redScore =
		calcSurroundTotal(addSpaceForFootprint(tbl), Color.Red)
		+ calcScoreOnColor(tbl, Color.Red);
	let blueScore =
		calcSurroundTotal(addSpaceForFootprint(tbl), Color.Blue)
		+ calcScoreOnColor(tbl, Color.Blue);
	return { red: redScore, blue: blueScore };
}
