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

export function deepCopy(tbl: Table) {
	return {
		h: tbl.h,
		w: tbl.w,
		arr: tbl.arr.map(l => l.map(s => ({...s,})))
	};
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
