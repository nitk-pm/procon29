module procon.decoder;

import std.json;
import std.conv;
import std.stdio;
import procon.container;
int width(JSONValue json){ //一次元配列だと横幅がわからないと行がわからないため（縦はいらなさそう）
	return to!int(json[0].array.length)+2; //番兵を含めた大きさを返すので注意
}
auto decode(JSONValue json){
	Square[] board;
	int h = to!int(json.array.length);
	int w = to!int(json[0].array.length);
	for(int i=0;i<h+2;i++){
		for(int j=0;j<w+2;j++){
			if (i==0 || j==0 ||i==h+1 ||j == w+1){
				board~=Square(0,false,"out");
				continue;
			}
			else {
				auto tmp=json.array[i-1].array[j-1];
				board~= Square(to!int(tmp["score"].integer),tmp["agent"].type==JSON_TYPE.TRUE,tmp["color"].str);
			}
		}
	}
	return board;
}

enum ExampleJson = q{
[
	[
		{"score":-2, "color":"Neut", "agent":false},
		{"score":1,  "color":"Neut", "agent":false},
		{"score":0,  "color":"Neut", "agent":false},
		{"score":1,  "color":"Neut", "agent":false},
		{"score":2,  "color":"Neut", "agent":false},
		{"score":0,  "color":"Neut", "agent":false},
		{"score":2,  "color":"Neut", "agent":false},
		{"score":1,  "color":"Neut", "agent":false},
		{"score":0,  "color":"Neut", "agent":false},
		{"score":1,  "color":"Neut", "agent":false},
		{"score":-2, "color":"Neut", "agent":false}
	],
	[
		{"score":1,  "color":"Neut", "agent":false},
		{"score":0,  "color":"Blue", "agent":true},
		{"score":2,  "color":"Neut", "agent":false},
		{"score":-2, "color":"Neut", "agent":false},
		{"score":0,  "color":"Neut", "agent":false},
		{"score":1,  "color":"Neut", "agent":false},
		{"score":0,  "color":"Neut", "agent":false},
		{"score":-2, "color":"Neut", "agent":false},
		{"score":2,  "color":"Neut", "agent":false},
		{"score":0,  "color":"Red", "agent":true},
		{"score":1,  "color":"Neut", "agent":false}
	],
	[
		{"score":1,  "color":"Neut", "agent":false},
		{"score":3,  "color":"Neut", "agent":false},
		{"score":2,  "color":"Neut", "agent":false},
		{"score":1,  "color":"Neut", "agent":false},
		{"score":0,  "color":"Neut", "agent":false},
		{"score":-2, "color":"Neut", "agent":false},
		{"score":0,  "color":"Neut", "agent":false},
		{"score":1,  "color":"Neut", "agent":false},
		{"score":2,  "color":"Neut", "agent":false},
		{"score":3,  "color":"Neut", "agent":false},
		{"score":1,  "color":"Neut", "agent":false}
	],
	[
		{"score":2, "color":"Neut", "agent":false},
		{"score":1, "color":"Neut", "agent":false},
		{"score":1, "color":"Neut", "agent":false},
		{"score":2, "color":"Neut", "agent":false},
		{"score":2, "color":"Neut", "agent":false},
		{"score":3, "color":"Neut", "agent":false},
		{"score":2, "color":"Neut", "agent":false},
		{"score":2, "color":"Neut", "agent":false},
		{"score":1, "color":"Neut", "agent":false},
		{"score":1, "color":"Neut", "agent":false},
		{"score":2, "color":"Neut", "agent":false}
	],
	[
		{"score":2, "color":"Neut", "agent":false},
		{"score":1, "color":"Neut", "agent":false},
		{"score":1, "color":"Neut", "agent":false},
		{"score":2, "color":"Neut", "agent":false},
		{"score":2, "color":"Neut", "agent":false},
		{"score":3, "color":"Neut", "agent":false},
		{"score":2, "color":"Neut", "agent":false},
		{"score":2, "color":"Neut", "agent":false},
		{"score":1, "color":"Neut", "agent":false},
		{"score":1, "color":"Neut", "agent":false},
		{"score":2, "color":"Neut", "agent":false}
	],
	[
		{"score":1,  "color":"Neut", "agent":false},
		{"score":3,  "color":"Neut", "agent":false},
		{"score":2,  "color":"Neut", "agent":false},
		{"score":1,  "color":"Neut", "agent":false},
		{"score":0,  "color":"Neut", "agent":false},
		{"score":-2, "color":"Neut", "agent":false},
		{"score":0,  "color":"Neut", "agent":false},
		{"score":1,  "color":"Neut", "agent":false},
		{"score":2,  "color":"Neut", "agent":false},
		{"score":3,  "color":"Neut", "agent":false},
		{"score":1,  "color":"Neut", "agent":false}
	],
	[
		{"score":1,  "color":"Neut", "agent":false},
		{"score":0,  "color":"Red", "agent":true},
		{"score":2,  "color":"Neut", "agent":false},
		{"score":-2, "color":"Neut", "agent":false},
		{"score":0,  "color":"Neut", "agent":false},
		{"score":1,  "color":"Neut", "agent":false},
		{"score":0,  "color":"Neut", "agent":false},
		{"score":-2, "color":"Neut", "agent":false},
		{"score":2,  "color":"Neut", "agent":false},
		{"score":0,  "color":"Blue", "agent":true},
		{"score":1,  "color":"Neut", "agent":false}
	],
	[
		{"score":-2, "color":"Neut", "agent":false},
		{"score":1,  "color":"Neut", "agent":false},
		{"score":0,  "color":"Neut", "agent":false},
		{"score":1,  "color":"Neut", "agent":false},
		{"score":2,  "color":"Neut", "agent":false},
		{"score":0,  "color":"Neut", "agent":false},
		{"score":2,  "color":"Neut", "agent":false},
		{"score":1,  "color":"Neut", "agent":false},
		{"score":0,  "color":"Neut", "agent":false},
		{"score":1,  "color":"Neut", "agent":false},
		{"score":-2, "color":"Neut", "agent":false}
	]
]
};
unittest{
	auto json = parseJSON(ExampleJson); 
	auto tmp = decode(json);
	int width = width(json);
	writeln(width);
	for(int i;i<tmp.length;i++){
		write(tmp[i].score);
		if ((i+1)%width==0)writeln("");
	}
}
