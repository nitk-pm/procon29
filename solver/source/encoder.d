module procon.encoder;

import std.json;
import std.conv;
import std.stdio;
import procon.container;
import procon.example;
import procon.decoder : width, decode;
JSONValue makeBoardJson(Square[] board,int width){
	JSONValue[][] table;
	for (int y=1;y<board.length/width-1;++y) {
		JSONValue[] line;
		for (int x=1;x<width-1;++x){
			string color;
			switch(board[y*width+x].color){
				case Color.Red:color = "Red";break;
				case Color.Blue:color = "Blue";break;
				case Color.Neut:color = "Neut";break;
				default:assert(false);
			}
			JSONValue square;
			square["score"] = JSONValue(board[y*width+x].score);
			square["color"] = JSONValue(color);
			square["agent"] = JSONValue(board[y*width+x].agent);
			line ~= square;
		}
		table ~= line;
	}
	return JSONValue(table);
}
//JSONValue makeOperationJson(int color,  )
unittest{
	auto json = parseJSON(ExampleJson); 
	auto orig = decode(json);
	int width = width(json);
	auto encoded = makeBoardJson(orig, width);
	assert(orig == decode(encoded));
}
