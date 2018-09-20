module procon.encoder;

import std.json;
import std.conv;
import std.stdio;
import procon.container;
import procon.example;
import procon.decoder;
JSONValue makeBoardJson(Board board){
	Cell[] cells = board.cells;
	JSONValue[][] table;
	for (int y=1;y<cells.length/board.width-1;++y) {
		JSONValue[] line;
		for (int x=1;x<board.width-1;++x){
			string color;
			switch(cells[y*board.width+x].color){
				case Color.Red:color = "Red";break;
				case Color.Blue:color = "Blue";break;
				case Color.Neut:color = "Neut";break;
				default:assert(false);
			}
			JSONValue square;
			square["score"] = JSONValue(cells[y*board.width+x].score);
			square["color"] = JSONValue(color);
			square["agent"] = JSONValue(cells[y*board.width+x].agent);
			line ~= square;
		}
		table ~= line;
	}
	return JSONValue(table);
}
JSONValue[2] makeOperationJson(int color,Operation[2] rawOp){
	JSONValue[2] opJson;
	foreach(i;0..2){//origOpも触るのでカウンタ変数が必要
		string type;
		switch(rawOp[i].type){
			case Type.Move :type = "Move";break;
			case Type.Clear:type = "Clear";break;
			default :assert(false);
		}
		opJson[i]["type"]=type;
		if (rawOp[i].type==Type.Move){
			opJson[i]["from"]["x"]=rawOp[i].from.x;
			opJson[i]["from"]["y"]=rawOp[i].from.y;
		}
		opJson[i]["to"]["x"]=rawOp[i].to.x;
		opJson[i]["to"]["y"]=rawOp[i].to.y;
	}
	return opJson;
}

unittest{
	auto json = parseJSON(ExampleJson); 
	auto orig = decode(json);
	auto encoded = makeBoardJson(orig);
	assert(orig == decode(encoded));
}
