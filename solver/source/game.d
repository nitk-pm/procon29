module procon.game;

import std.json;
import std.conv;
import std.stdio;
import std.math;
import procon.container;
import procon.decoder;

//真上から時計回りに、0~8で方向を表現、9ならその場で動かない
//進む先が敵陣のパネルならパネル除去操作に変更
auto searchAgentInitialPos(Square[] board,int width){//左上から右へ走査、見つけた順にぶち込む
	Agent[] agentList;
	for(int i=width+1;i<board.length-width-1;i++)//番兵を除いた左上から右下へのループ
		if (board[i].agent)
			agentList ~= Agent(board[i].color,i);
	return agentList;
}
auto game(Square[] board,int width){
		
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

