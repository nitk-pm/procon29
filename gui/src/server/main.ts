import * as IO from 'socket.io';

export class Server {
	public static readonly PORT: number = 8080;

	listen() {
		const io = IO.listen(8080);
	}
}
