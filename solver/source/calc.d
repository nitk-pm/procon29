module procon.calc;

import std.json;
import std.conv;
import std.stdio;
import procon.container;
import procon.decoder;
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
/*
	赤チームの領域ポイントを考えるときは青白を一緒と考えてよい、逆もしかり
*/
int abs(int a){
	return a>0?a:-a;
}

auto surroundCalc(Square[] b,int width){
	int[2] score; score[0]=0;score[1]=0;//公式ページに従ってもタプル使えなくてキレそう
	string[2] team;team[0]="Red";team[1]="Blue"; //このへんめっちゃクソコードだけど多分これが一番速い
	foreach(color;team){//赤と青を分けて考える
		int surroundPoint = 0;
		bool[] visited;
		foreach(x;b)
			visited~=false;
		auto q = Queue!int();
		for (int i=0;i<b.length;i++){
			if (b[i].color != "Out" && b[i].color != color){//番兵と今見てるチームのマスは展開しちゃダメ
				q.push(i);
				visited[i]=true;//最初から番兵を探索済みにすると点数計算がおかしくなる
			}
			while (!q.empty){
				writeln(q.top());
				auto idx = q.top(); //現在のインデックス
				q.pop();
				surroundPoint += abs(b[idx].score);
				auto isSurrounded = true;//囲まれ判定
				int expandIdx; //展開先のインデックス
				for(int j=0;j<4;++j){
					final switch(j){
						//defalut :assert(false); //普通のswitchだとこれ書いててもdefaultないやんけって怒られるのでやむなく。
						case 0:expandIdx = idx-width;	break;//↑
						case 1:expandIdx = idx+1;	break;//→
						case 2:expandIdx = idx+width;	break;//↓
						case 3:expandIdx = idx-1;	break;//←
					}
					if (!visited[expandIdx]){//探索済みなら展開しちゃダメ
						visited[expandIdx]=true;
						auto expandColor = b[expandIdx].color; //展開先のcolor
						if(expandColor=="Out"){
							isSurrounded = false;//outと接触したNeut群は領域ポイントにならない
							continue;
						}
						else if (expandColor==color)
							continue;
						else if (expandColor!=color){//現在見てるチームと違うcolorのときだけ展開する
							q.push(expandIdx);
						}
					}
				}
			}
		}
		if (color=="Red")
			score[0]+=surroundPoint;
		else 
			score[1]+=surroundPoint;
	}
	return score;
}
unittest{
	auto json = parseJSON(ExampleJson);
	auto width = width(json);
	auto board = decode(json);
	auto r = surroundCalc(board,width);
	writeln(r[0],":",r[1]);
}
