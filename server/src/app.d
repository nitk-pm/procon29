import std.stdio;
import std.file;
import std.json;
import std.conv;
import vibe.http.router;
import vibe.http.websockets;
import vibe.d;

enum Color {
	Red,
	Blue,
	Neut
}

struct Square {
	Color color;
	int score;
	bool agent;
}

alias Board = Square[][];


Board boardOfJson(JSONValue json) {
	Square[][] tbl;
	foreach(colJson; json.array) {
		Square[] col;
		foreach(squareJson; colJson.array) {
			Color color;
			switch (squareJson["color"].str) {
			case "Red": color = Color.Red; break;
			case "Blue": color = Color.Blue; break;
			case "Neut": color = Color.Neut; break;
			default:
				throw new Exception("Illegal board.json");
			}
			bool agent = squareJson["agent"].type == JSON_TYPE.TRUE;
			int score = squareJson["score"].integer.to!int;
			col ~= Square(color, score, agent);
		}
		tbl ~= col;
	}
	return tbl;
}

JSONValue jsonOfBoard(Board board) {
	JSONValue[] boardJson;
	foreach (col; board) {
		JSONValue[] colJson;
		foreach (square; col) {
			JSONValue squareJson;
			final switch (square.color) {
			case Color.Red: squareJson["color"] = JSONValue("Red"); break;
			case Color.Blue: squareJson["color"] = JSONValue("Blue"); break;
			case Color.Neut: squareJson["color"] = JSONValue("Neut"); break;
			}
			squareJson["score"] = JSONValue(square.score);
			squareJson["agent"] = JSONValue(square.agent);
			colJson ~= squareJson;
		}
		boardJson ~= JSONValue(colJson);
	}
	return JSONValue(boardJson);
}

struct Pos {
	int x, y;
}
unittest {
	assert(Pos(1, 2) == Pos(1, 2));
}

enum OpType {
	Move,
	Clear
}

struct Operation {
	OpType type;
	// fromはtype == OpType.Moveのときのみ有効
	// 無効な場合は-1, -1を代入しておく
	Pos from, to;
}

struct OpContainer {
	Color color;
	OpType type;
	Pos from;
	Pos to;
}

Board updateBoard(Board board, Operation[] blueOp, Operation[] redOp) {
	OpContainer[] ops;
	foreach(op; blueOp) {
		ops ~= OpContainer(Color.Blue, op.type, op.from, op.to);
	}
	foreach(op; redOp) {
		ops ~= OpContainer(Color.Red, op.type, op.from, op.to);
	}
	OpContainer[] candidate;
	writeln("origin: ", ops);

	// 行き先が衝突して無ければ候補に加える	
	foreach (op1; ops) {
		bool enable = true;
		foreach (op2; ops) {
			if (op1 == op2) continue;
			if (!(op1.type == OpType.Move || op2.type == OpType.Move)) continue;
			if (op1.to == op2.to) {
				enable = false;
			}
		}
		if (enable) candidate ~= op1;
	}
	writeln("cut1: ", candidate);

	// 0..fixedPart: 無効
	// fixedPart..$: 有効
	size_t fixedPart = 0;
	bool changed = true;
	while(changed) {
		changed = false;
		for (size_t i=fixedPart; i < ops.length; ++i) {
			if (ops[i].type != OpType.Move || !board[ops[i].to.y][ops[i].to.x].agent) continue;
			bool evacuated;
			for (size_t j=fixedPart; j < ops.length; ++j) {
				if (i == j) continue;
				if (ops[j].type == OpType.Clear) continue;
				evacuated |= ops[j].from == ops[i].to;
			}
			if (!evacuated) {
				auto tmp = ops[fixedPart];
				ops[fixedPart] = ops[i];
				ops[i] = tmp;
				++fixedPart;
				changed = true;
			}
		}
	}
	writeln("cut2: ", candidate[fixedPart..$]);
	// 無効な操作を全て削除
	candidate = candidate[fixedPart..$];

	for (int y; y < board.length; ++y) {
		for (int x; x < board[y].length; ++x) {
			foreach (op; candidate) {
				if (op.from == Pos(x, y))
					board[y][x].agent = false;
			}
		}
	}

	foreach (op; candidate) {
		if (op.type == OpType.Move) {
			board[op.to.y][op.to.x].agent = true;
			board[op.to.y][op.to.x].color = op.color;
		}
		else {
			board[op.to.y][op.to.x].color = Color.Neut;
		}
	}
	return board;
}


Operation[] operationsOfJson(JSONValue json) {
	Operation[] ops;
	foreach (op; json.array) {
		OpType type;
		Pos from = Pos(-1, -1);
		Pos to;
		if (op["type"].str == "Move")
			type = OpType.Move;
		else
			type = OpType.Clear;
		to.x = op["to"]["x"].integer.to!int;
		to.y = op["to"]["y"].integer.to!int;
		if (type == OpType.Move) {
			from.x = op["from"]["x"].integer.to!int;
			from.y = op["from"]["y"].integer.to!int;
		}
		ops ~= Operation(type, from, to);
	}
	return ops;
}

JSONValue jsonOfOperations(Operation[] operations) {
	//TODO 実装しろ
	return JSONValue(0);
}

Board board;
// operation購読者のsocketのリスト
WebSocket[] opSubscribers;
// 接続してるSokcet
WebSocket[] sockets;

Operation[] blueOp, redOp;
bool blueOpPushed, redOpPushed;

enum LocalHost = ["::1", "127.0.0.1"];
enum LabAddress = ["192.168.42.151"];

shared static this () {
	auto boardJson = "./board.json".readText.parseJSON;
	board = boardOfJson(boardJson);

	auto router = new URLRouter;
	router.get("/", handleWebSockets(&handleConn));

	auto settings = new HTTPServerSettings;
	settings.port = 8080;
	settings.bindAddresses = LocalHost ~ LabAddress;
	listenHTTP(settings, router);
}

string genReplyMsg(string type, JSONValue json) {
	JSONValue res;
	res["type"] = JSONValue(type);
	res["payload"] = json;
	return res.toString;
}

// red, blue共にoperationが揃ったら盤面を更新して配信
// 片方だけしか来て無ければOperationの購読者だけに配信
void handlePush(JSONValue msg) {
	switch (msg["color"].str) {
		case "Red":
			redOp = msg["payload"].operationsOfJson;
			redOpPushed = true;
			break;
		case "Blue":
			blueOp = msg["payload"].operationsOfJson;
			blueOpPushed = true;
			break;
		default:
			assert (false);
	}
	if (redOpPushed && blueOpPushed) {
		board = updateBoard(board, blueOp, redOp);
		auto reply = genReplyMsg("distribute-board", board.jsonOfBoard);
		foreach(sock; sockets) {
			sock.send(reply);
		}
		redOpPushed = false;
		blueOpPushed = false;
	}
	// まだoperationが揃ってない場合は来たoperationを配信
	else {
		JSONValue res;
		auto reply = genReplyMsg("distribute-op", msg["payload"]);
		foreach (sock; opSubscribers) {
			sock.send(reply);
		}
	}
}

void handleConn(scope WebSocket sock) {
	// 接続中のソケットに登録
	sockets ~= sock;
	while (sock.connected) {
		auto msg = sock.receiveText.parseJSON;
		switch (msg["type"].str) {
		case "req-board":
			auto reply= genReplyMsg("distribute-board", board.jsonOfBoard);
			sock.send(reply);
			break;
		case "subscribe-op":
			//TODO 重複排除処理
			opSubscribers ~= sock;
			break;
		case "push":
			handlePush(msg);
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
		default:
			assert(false);
		}
	}
}
