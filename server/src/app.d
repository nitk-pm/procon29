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

Board board;

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

void handleConn(scope WebSocket sock) {
	while (sock.connected) {
		auto msg = sock.receiveText();
		sock.send(msg);
	}
}

