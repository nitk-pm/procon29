module procon29.server.app;

import std.stdio;
import std.file;
import std.json;
import std.conv;
import std.format;
import std.algorithm.iteration;
import std.range;
import std.conv;
import std.datetime.stopwatch: StopWatch;
import std.getopt;
import vibe.http.router;
import vibe.http.websockets;
import vibe.d;

import procon29.server.board;

Board board;
Board[] hist;
// operation購読者のsocketのリスト
WebSocket[] opSubscribers;
// 接続してるSokcet
WebSocket[] sockets;

Operation[] blueOp, redOp;
bool blueOpPushed, redOpPushed;

enum LocalHost = ["::1", "127.0.0.1"];
enum LabAddress = ["192.168.42.151"];

size_t cnt = 0;
size_t turn;

StopWatch timekeeper;

version(unittest){
}
else {
void main (string[] args) {

	string boardFileName;

	auto helpInformation = getopt(
		args,
		std.getopt.config.required,
		"turn|t", &turn,
		std.getopt.config.required,
		"board|b", &boardFileName
	);
	auto boardJson = boardFileName.readText.parseJSON;
	board = boardOfJson(boardJson);

	timekeeper.start;
	if (!exists("./log")) {
		mkdir("./log");
	}

	auto settings = new HTTPServerSettings;
	settings.port = 8080;
	settings.bindAddresses = LocalHost ~ LabAddress;

	auto router = new URLRouter;
	router.get("/", handleWebSockets(&handleConn));

	listenHTTP(settings, router);
	runEventLoop();
}
}

string genReplyMsg(string type, JSONValue json) {
	JSONValue res;
	res["type"] = JSONValue(type);
	res["payload"] = json;
	return res.toString;
}

enum OpState {
	Enable,
	Disable,
	Unknown
}

struct OpConainer {
	Operation op;
	OpState state;
	int agent;
}

OpConainer[] conflictCheck(OpConainer[] ops) {
	// conflict check
	foreach (ref op1; ops) {
		foreach (ref op2; ops) {
			if (op1 == op2) continue;
			if (op1.op.to == op2.op.to) {
				op1.state = OpState.Disable;
				op2.state = OpState.Disable;
				continue;
			}
		}
	}
	return ops;
}
unittest {
	auto ops = [
		OpConainer(Operation(OpType.Move,  Color.Neut, Pos(0,0), Pos(1,1)), OpState.Unknown, 0),
		OpConainer(Operation(OpType.Clear, Color.Neut, Pos(2,2), Pos(1,1)), OpState.Unknown, 0),
		OpConainer(Operation(OpType.Move,  Color.Neut, Pos(1,0), Pos(1,0)), OpState.Unknown, 0),
	];
	auto result = conflictCheck(ops);
	assert (result[0].state == OpState.Disable);
	assert (result[1].state == OpState.Disable);
	assert (result[2].state == OpState.Unknown);
}

OpConainer[] validCheck(Board board, OpConainer[] ops) {
	foreach (op; ops) {
		auto p = op.op.to;
		if (
			op.op.type == OpType.Move &&
			board[p.y][p.x].color != Color.Neut &&
			board[p.y][p.x].color != op.op.color
		) {
			op.state = OpState.Disable;
		}
		else if (op.op.to.y >= board.length || op.op.to.x >= board[op.op.to.y].length) {
			op.state = OpState.Disable;
		}
	}
	return ops;
}

bool isActive(OpConainer start, OpConainer[] ops, OpConainer fence) {
	foreach (op; ops) {
		if (start == op) continue;
		if (fence == op) return true;
		if (start.op.to == op.op.from) {
			if (op.op.type == OpType.Move) {
				final switch (op.state) {
				case OpState.Enable:
					return true;
				case OpState.Disable:
					return false;
				case OpState.Unknown:
					return isActive(op, ops, fence);
				}
			}
			else {
				return false;
			}
		}
	}
	return true;
}
unittest {
	auto ops1 = [
		OpConainer(Operation(OpType.Move, Color.Neut, Pos(0,0), Pos(1,1)), OpState.Unknown, 0),
		OpConainer(Operation(OpType.Move, Color.Neut, Pos(1,1), Pos(1,2)), OpState.Unknown, 0),
		OpConainer(Operation(OpType.Move, Color.Neut, Pos(1,0), Pos(1,0)), OpState.Disable, 0),
	];
	assert (isActive(ops1[0], ops1, ops1[0]));
	auto ops2 = [
		OpConainer(Operation(OpType.Move, Color.Neut, Pos(0,0), Pos(1,1)), OpState.Unknown, 0),
		OpConainer(Operation(OpType.Move, Color.Neut, Pos(1,1), Pos(1,2)), OpState.Disable, 0),
		OpConainer(Operation(OpType.Move, Color.Neut, Pos(1,0), Pos(1,0)), OpState.Disable, 0),
	];
	assert (!isActive(ops2[0], ops2, ops2[0]));
	auto ops3 = [
		OpConainer(Operation(OpType.Move, Color.Neut, Pos(0,0), Pos(1,1)), OpState.Unknown, 0),
		OpConainer(Operation(OpType.Move, Color.Neut, Pos(1,1), Pos(1,2)), OpState.Unknown, 0),
		OpConainer(Operation(OpType.Move, Color.Neut, Pos(1,2), Pos(0,0)), OpState.Unknown, 0),
	];
	assert (isActive(ops1[0], ops1, ops1[0]));
}

OpConainer[] solveRearEnd(Board board, OpConainer[] ops) {
	foreach(ref rear; ops) {
		if (rear.state == OpState.Unknown && isActive(rear, ops, rear))
			rear.state = OpState.Enable;
		else
			rear.state = OpState.Disable;
	}
	return ops;
}

Board solve(Board board, Operation[] opOrigins) {
	writeln("start solve");
	OpConainer[] ops;
	foreach (y, line; board) {
		foreach (x, square; line) {
			bool existInOps = false;
			foreach (op; opOrigins) {
				if (op.from == Pos(x.to!int, y.to!int)) {
					ops ~= OpConainer(op, OpState.Unknown, square.agent);
					existInOps = true;
					break;
				}
			}
			if (!existInOps && square.agent >= 0) {
				ops ~= OpConainer(
					Operation(OpType.Stop, square.color, Pos(x.to!int, y.to!int), Pos(x.to!int, y.to!int)),
					OpState.Disable,
					square.agent
				);
			}
		}
	}

	writeln(ops);
	ops = conflictCheck(ops);
	ops = validCheck(board, ops);
	ops = solveRearEnd(board, ops);
	writeln(ops);

	foreach (ref line; board) {
		foreach (ref square; line) {
			square.agent = -1;
		}
	}

	foreach (op; ops) {
		if (op.state == OpState.Enable) {
			final switch (op.op.type) {
			case OpType.Move:
				board[op.op.to.y][op.op.to.x].agent = op.agent;
				board[op.op.to.y][op.op.to.x].color = op.op.color;
				break;
			case OpType.Stop:
				board[op.op.to.y][op.op.to.x].agent = op.agent;
				board[op.op.to.y][op.op.to.x].color = op.op.color;
				break;
			case OpType.Clear:
				board[op.op.to.y][op.op.to.x].color = Color.Neut;
				board[op.op.from.y][op.op.from.x].agent = op.agent;
				break;
			}
		}
		else {
			board[op.op.from.y][op.op.from.x].agent = op.agent;
		}
	}
	writeln("finish solve");
	return board;
}

Board deepCopy(Board board) {
	return board.map!(line => line.map!(square => square).array).array;
}

// red, blue共にoperationが揃ったら盤面を更新して配信
// 片方だけしか来て無ければOperationの購読者だけに配信
void handlePush(JSONValue msg) {
	switch (msg["color"].str) {
		case "Red":
			redOp = msg["payload"].operationsOfJson(Color.Red);
			redOpPushed = true;
			break;
		case "Blue":
			blueOp = msg["payload"].operationsOfJson(Color.Blue);
			blueOpPushed = true;
			break;
		default:
			assert (false);
	}
	if (redOpPushed && blueOpPushed) {
		hist ~= board.deepCopy;
		board = solve(board, blueOp ~ redOp);
		
		JSONValue payload;
		timekeeper.stop;
		timekeeper.reset;

		payload["board"] = board.jsonOfBoard;
		payload["turn"] = JSONValue(--turn);
		payload["time"] = timekeeper.peek.total!"msecs".to!float / 1000.0f;
		auto reply = genReplyMsg("distribute-board", payload);
		reply.writeln;

		foreach(sock; sockets) {
			sock.send(reply);
		}
		writeln("-------------------------------------------------------------");

		redOpPushed = false;
		blueOpPushed = false;
		timekeeper.start;
	}
	// まだoperationが揃ってない場合は来たoperationを配信
	else {
		JSONValue res;
		auto reply = genReplyMsg("distribute-op", msg["payload"]);
		writeln("reply: ", reply);
		foreach (sock; opSubscribers) {
			sock.send(reply);
		}
	}
}

void handleConn(scope WebSocket sock) {
	// 接続中のソケットに登録
	sockets ~= sock;
	while(sock.connected) {
		auto msg = sock.receiveText.parseJSON;
		writeln("received message:", msg.toPrettyString);
		switch (msg["type"].str) {
		case "req-board":
			JSONValue payload;
			payload["board"] = board.jsonOfBoard;
			payload["turn"] = JSONValue(turn);
			payload["time"] = timekeeper.peek.total!"msecs".to!float / 1000.0f;
			auto reply = genReplyMsg("distribute-board", payload);
			sock.send(reply);
			break;
		case "subscribe-op":
			//TODO 重複排除処理
			opSubscribers ~= sock;
			break;
		case "push":
			handlePush(msg);
			break;
		case "undo":
			if (hist.length > 0) {
				writeln("undo");
				board = hist[$-1];
				--hist.length;
				JSONValue payload;
				payload["board"] = board.jsonOfBoard;
				payload["turn"] = JSONValue(++turn);
				payload["time"] = timekeeper.peek.total!"msecs".to!float / 1000.0f;
				auto reply = genReplyMsg("distribute-board", payload);
				foreach(subscriber; sockets) {
					subscriber.send(reply);
				}
			}
			break;
		case "req-op":
			switch (msg["color"].str) {
			case "Red":
				auto reply= genReplyMsg("distribute-op", blueOp.jsonOfOperations);
				sock.send(reply);
				break;
			case "Blue":
				auto reply= genReplyMsg("distribute-op", redOp.jsonOfOperations);
				sock.send(reply);
				break;
			default:
				assert (false);
			}
			break;
		case "clear-op":
			redOp = [];
			blueOp = [];
			redOpPushed = false;
			blueOpPushed = false;
			break;
		default:
			assert(false);
		}
	}
}
