module procon29.server.board;

import std.stdio;
import std.file;
import std.json;
import std.conv;

enum Color { Red, Blue, Neut }
struct Square {
	Color color;
	int score;
	bool agent;
}

alias Board = Square[][];

struct Pos {
	int x, y;
}
unittest {
	assert(Pos(1, 2) == Pos(1, 2));
}

enum OpType { Move, Clear }

struct OpContainer {
	Color color;
	OpType type;
	Pos from;
	Pos to;
}

struct Operation {
	OpType type;
	// fromはtype == OpType.Moveのときのみ有効
	// 無効な場合は-1, -1を代入しておく
	Pos from, to;
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
