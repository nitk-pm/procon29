module procon.decoder;

import std.json;
import std.conv;
import std.stdio;
import procon.container;
import procon.example;
import procon.searchPreprocess;

auto decode(JSONValue json){
	Board board;
	int h=to!int(json.array.length);
	int w=to!int(json[0].array.length);
	foreach(y;0..h+2){
		foreach(x;0..w+2){
			if (y==0||x==0||y==h+1||x==w+1){
				board.cells~=Cell(-20,-1,Color.Out,0);
				continue;
			}
			else {
				auto tmp=json.array[y-1].array[x-1];
				auto color=Color.Out;
				switch (tmp["color"].str){
					case "Red":color=Color.Red;break;
					case "Blue":color=Color.Blue;break;
					case "Out":color=Color.Out;break;
					case "Neut":color=Color.Neut;break;
					default :assert(false);
				}
				board.cells~=Cell(to!int(tmp["score"].integer),to!int(tmp["agent"].integer),color);
			}
		}
	}
	board.width=w+2;
	auto priorities=calcSquarePriority(board);
	foreach(i;0..priorities.length){
		board.cells[i].priority=priorities[i];
	}
	return board;
}
unittest{
	auto json=parseJSON(ExampleJson); 
	auto board=decode(json);
}
