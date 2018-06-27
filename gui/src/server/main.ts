import * as IO from 'socket.io';
import * as Common from '../common';
import * as fs from 'fs';

export class Server {
	public static readonly PORT: number = 8080;

	private tbl: Common.Table;
	private operations: Common.Operation[];
	private opSubscribers: Set<string>;

	constructor (json: any) {
		this.tbl = Common.loadBoard(json);
	}

	private updateBoard() {
	}

	/*
	 * 接続時にコールバックを登録
	 * post-operation:
	 *   operationをサーバに送信
	 *   operationが2つあればboardを更新して配信し、operationをリセット
	 *   購読者が居れば購読者にoperationを配信
	 * subscribe-operation: 
	 *   購読者に送信者を追加
	 * request-board:
	 *   現在の盤面の配信要求
	 */
	listen() {
		console.log('server: start');
		const io = IO.listen(8080);
		io.sockets.on('connection', (socket) => {
			let id = socket.id;
			console.log('connected: ', id);

			socket.on('disconnect', () => {
				console.log('disconnect', id);
			});

			socket.on('post-operation', (operation: Common.Operation) => {
				console.log('operation from ', id);
				this.operations.push(operation);
				if (this.operations.length >= 2) {
					this.updateBoard();
					console.log('broadcast board');
					io.emit('board', this.tbl);
				}
				else {
					console.log('distribute operation');
					this.opSubscribers
						.forEach((id: string) => {io.to(id).emit('operation-distribute', operation);});
				}
			});

			socket.on('subscribe-operation', ()=> {
				console.log('subscribe-operation id: ', id);
				this.opSubscribers.add(id);
			});

			socket.on('request-board', () => {
				console.log('request board from ', id);
				io.to(id).emit('board', this.tbl);
			});
		});
	}
}

if (process.argv.length > 2) {
	let json = JSON.parse(fs.readFileSync(process.argv[2], 'utf-8'));
	const server = new Server(json);
	server.listen();
}
else {
	console.log('usage: node </path/to/server.js> </path/to/<board>.json>')
}
