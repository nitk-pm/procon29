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

Board updateBoard(Board board, Operation[] blueOp, Operation[] redOp) {
	// TODO 実装しろ
	return [];
}

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

enum OpType {
	Move,
	Clear
}

struct Operation {
	Color color;
	OpType type;
	// fromはtype == OpType.Moveのときのみ有効
	Pos from, to;
}

Operation[] operationsOfJson(JSONValue json) {
	//TODO 実装しろ
	return [];
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

shared static this () {
	auto boardJson = "./board.json".readText.parseJSON;
	board = boardOfJson(boardJson);

	auto router = new URLRouter;
	router.get("/", handleWebSockets(&handleConn));

	auto settings = new HTTPServerSettings;
	settings.port = 8080;
	settings.bindAddresses = ["::1", "127.0.0.1"];
	listenHTTP(settings, router);
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
		JSONValue res;
		res["type"] = JSONValue("distribute-board");
		res["payload"] = board.jsonOfBoard;
		foreach(sock; sockets) {
			sock.send(res.toString);
		}
	}
	else {
		JSONValue res;
		res["type"] = JSONValue("distribute-op");
		res["payload"] = msg["payload"];
		foreach (sock; opSubscribers) {
			sock.send(res.toString);
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
			sock.send(board.jsonOfBoard.toString);
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
				sock.send(blueOp.jsonOfOperations.toString);
				break;
			case "Blue":
				sock.send(redOp.jsonOfOperations.toString);
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
