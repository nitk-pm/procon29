import std.json;
import std.conv;
import std.stdio;
struct Square {//マスの情報
int score;
bool agent;
string color;
}

void main(){
	Square[] board;
	auto json = parseJSON(import("example.json")); 
	int h = to!int(json.array.length);
	int w = to!int(json[0].array.length);
	foreach(y;json.array){
		foreach(x;y.array){
			board ~= Square(to!int(x["score"].integer),x["agent"].type==JSON_TYPE.TRUE,x["color"].str);
		}
	}
	foreach(i;board){
	writeln(i.score,",",i.agent,",",i.color);
	}
}
