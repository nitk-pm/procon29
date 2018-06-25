import * as IO from 'socket.io';

export class Server {
	public static readonly PORT: number = 8080;

	listen() {
		const io = IO.listen(8080);
		io.on('connection', (socket) => {
			console.log('connected');
			socket.on('disconnect', () => {
				console.log('disconnect');
			});
			socket.on('post-board', (operation) => {
				console.log('operation');
			});
		});
	}
}
