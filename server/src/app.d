module procon29.server.app;

import std.stdio;
import std.file;
import std.json;
import std.conv;
import std.format;
import std.conv;
import std.datetime.stopwatch: StopWatch;
import vibe.http.router;
import vibe.http.websockets;
import vibe.d;

import procon29.server.board;

Board board;
// operation購読者のsocketのリスト
WebSocket[] opSubscribers;
// 接続してるSokcet
WebSocket[] sockets;

Operation[] blueOp, redOp;
bool blueOpPushed, redOpPushed;

enum LocalHost = ["::1", "127.0.0.1"];
enum LabAddress = ["192.168.42.151"];

size_t cnt = 0;

StopWatch timekeeper;

shared static this () {
	auto boardJson = "./board.json".readText.parseJSON;
	board = boardOfJson(boardJson);

	auto router = new URLRouter;
	router.get("/", handleWebSockets(&handleConn));

	auto settings = new HTTPServerSettings;
	settings.port = 8080;
	settings.bindAddresses = LocalHost ~ LabAddress;
	timekeeper.start;
	listenHTTP(settings, router);
	if (!exists("./log")) {
		mkdir("./log");
	}
}

string genReplyMsg(string type, JSONValue json) {
	JSONValue res;
	res["type"] = JSONValue(type);
	res["payload"] = json;
	return res.toString;
}

string genTimeReplyMsg() {
	JSONValue json;
	json["time"] = timekeeper.peek.total!"msecs".to!float / 1000.0f;
	return genReplyMsg("distribute-time", json);
}

Board updateBoard(Board board, Operation[] blueOp, Operation[] redOp) {
	OpContainer[] ops;
	foreach(op; blueOp) {
		ops ~= OpContainer(Color.Blue, op.type, op.from, op.to);
	}
	foreach(op; redOp) {
		ops ~= OpContainer(Color.Red, op.type, op.from, op.to);
	}
	// 0..fixedPart: 無効
	// fixedPart..$: 有効
	size_t fixedPart = 0;
	// 行き先が衝突して無ければ候補に加える	
	foreach (i, op1; ops) {
		bool enable = true;
		foreach (op2; ops) {
			if (op1 == op2) continue;
			if (!(op1.type == OpType.Move || op2.type == OpType.Move)) continue;
			if (op1.to == op2.to) {
				enable = false;
				break;
			}
		}
		if (!enable) {
			auto tmp = ops[fixedPart];
			ops[fixedPart] = ops[i];
			ops[i] = tmp;
			++fixedPart;
		}
	}
	bool changed = true;
	while(changed) {
		changed = false;
		for (size_t i=fixedPart; i < ops.length; ++i) {
			immutable to = ops[i].to;
			immutable dest = board[to.y][to.x];
			auto disable = false;
			if (dest.agent) {
				bool willEvacuate = false;
				// エージェントが退去予定ならフラグを立てる
				for (size_t j=fixedPart; j < ops.length; ++j) {
					willEvacuate |= ops[j].type == OpType.Move && ops[j].from == to;
				}
				disable = !willEvacuate;
			}
			if (disable) {
				auto tmp = ops[fixedPart];
				ops[fixedPart] = ops[i];
				ops[i] = tmp;
				++fixedPart;
				changed = true;
			}
		}
	}
	// 無効な操作を全て削除
	ops = ops[fixedPart..$];

	for (int y; y < board.length; ++y) {
		for (int x; x < board[y].length; ++x) {
			foreach (op; ops) {
				if (op.from == Pos(x, y))
					board[y][x].agent = false;
			}
		}
	}

	foreach (op; ops) {
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
		auto f = File(format!"./log/%d.json"(++cnt), "w");
		f.write(board.jsonOfBoard.toPrettyString);
		timekeeper.stop;
		timekeeper.reset;
		foreach(sock; sockets) {
			sock.send(reply);
			sock.send(genTimeReplyMsg);
		}
		redOpPushed = false;
		blueOpPushed = false;
		timekeeper.start;
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
		case "req-time":
			sock.send(genTimeReplyMsg);
			break;
		default:
			assert(false);
		}
	}
}
