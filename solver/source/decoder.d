module procon.decoder;

import std.json;
import std.conv;
import std.stdio;
import procon.container;
auto decode(JSONValue json){
	Square[] board;
	int h = to!int(json.array.length);
	int w = to!int(json[0].array.length);
	foreach(y;json.array){
		foreach(x;y.array){
			board ~= Square(to!int(x["score"].integer),x["agent"].type==JSON_TYPE.TRUE,x["color"].str);
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
	decode(json);
}
