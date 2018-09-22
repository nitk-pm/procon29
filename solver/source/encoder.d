module procon.encoder;

import std.json;
import std.conv;
import std.stdio;
import procon.container;
import procon.example;
import procon.decoder;
JSONValue makeBoardJson(Board board){
	Cell[] cells=board.cells;
	JSONValue[][] table;
	for (int y=1;y<cells.length/board.width-1;++y) {
		JSONValue[] line;
		for (int x=1;x<board.width-1;++x){
			string color;
			switch(cells[y*board.width+x].color){
				case Color.Red:color="Red";break;
				case Color.Blue:color="Blue";break;
				case Color.Neut:color="Neut";break;
				default:assert(false);
			}
			JSONValue square;
			square["score"]=JSONValue(cells[y*board.width+x].score);
			square["color"]=JSONValue(color);
			square["agent"]=JSONValue(cells[y*board.width+x].agent);
			line~=square;
		}
		table~=line;
	}
	return JSONValue(table);
}
JSONValue makeOperationJson(Color color,Operation[2] rawOp){
	JSONValue opJsonParts;
	JSONValue[] opJson;
	JSONValue msgJson;
	string msgColor;
	switch(color){
		case Color.Red:msgColor="Red";break;
		case Color.Blue:msgColor="Blue";break;
		default:assert(false);
	}
	foreach(i;0..2){//origOpも触るのでカウンタ変数が必要
		string type;
		switch(rawOp[i].type){
			case Type.Move :type="Move";break;
			case Type.Clear:type="Clear";break;
			default :assert(false);
		}
		opJsonParts["type"]=type;
		if (rawOp[i].type==Type.Move){
			JSONValue tmp;
			tmp["x"]=JSONValue(rawOp[i].from.x-1);
			tmp["y"]=JSONValue(rawOp[i].from.y-1);
			opJsonParts["from"]=tmp;
		}
		JSONValue tmp;
		tmp["x"]=JSONValue(rawOp[i].to.x-1);
		tmp["y"]=JSONValue(rawOp[i].to.y-1);
		opJsonParts["to"]=tmp;
		opJson~=opJsonParts;
	}
	msgJson["type"]="push";
	msgJson["color"]=msgColor;
	msgJson["payload"]=JSONValue(opJson);
	return msgJson;
}
unittest{
	auto json=parseJSON(ExampleJson); 
	auto orig=decode(json);
	auto encoded=makeBoardJson(orig);
	assert(orig==decode(encoded));
}
