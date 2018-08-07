module procon.calc;

import std.json;
import std.conv;
import std.stdio;
import std.typecons:tuple;
import procon.container;
import procon.decoder;
import procon.example;
/*
	赤チームの領域ポイントを考えるときは青白を一緒と考えてよい、逆もしかり
	完結に説明するために以下では赤視点でコメントを書いている
*/
int abs(int a){
	return a>0?a:-a;
}

auto surroundCalc(Square[] b,int width){
	auto score = tuple(0,0);
	auto team = tuple(Color.Red,Color.Blue);
	foreach(color;team){//赤と青を分けて考える
//FIXME~
		bool[] visited;
		foreach(x;0..b.length)
			visited~=false;
//~FIXME
		auto q = Queue!int();
		for (int i=0;i<b.length;i++){
			if (b[i].color != Color.Out && b[i].color != color && !visited[i]){//番兵と赤のマスと展開済みのマスは展開しちゃダメ
				q.push(i);
				visited[i]=true;//最初から番兵を探索済みにすると点数計算がおかしくなる
			}
			else continue;
			auto isSurrounded = true;//囲まれ判定、連結した一つの青白領域に対して考えるのでここで宣言
			int surroundPoint = 0;
			while (!q.empty){
				auto idx = q.top(); //現在のインデックス
				q.pop();
				surroundPoint += abs(b[idx].score);
				int expandIdx; //展開先のインデックス
				for(int j=0;j<4;++j){
					final switch(j){
						//defalut :assert(false); //普通のswitchだとこれ書いててもdefaultないやんけって怒られるのでやむなくfinal switch。
						case 0:expandIdx = idx-width;	break;//↑
						case 1:expandIdx = idx+1;	break;//→
						case 2:expandIdx = idx+width;	break;//↓
						case 3:expandIdx = idx-1;	break;//←
					}
					if (!visited[expandIdx]){//探索済みなら展開しちゃダメ
						visited[expandIdx]=true;
						auto expandColor = b[expandIdx].color; //展開先のcolor
						if(expandColor==Color.Out){
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
			if (!isSurrounded)
				surroundPoint = 0;
			if (color==Color.Red)
				score[0]+=surroundPoint;
			else 
				score[1]+=surroundPoint;
		}
	}
	return score;
}
auto tileCalc(Square[] b){
	int[2] score;score[0]=0;score[1]=0;
	foreach(x;b){
	if (x.color == Color.Red)	score[0]+=x.score;
	if (x.color == Color.Blue)	score[1]+=x.score;
	}
	return score;
}
auto calc(Square[] b,int width){
	auto s = surroundCalc(b,width);
	auto t = tileCalc(b);
	int [2] score;
	score[0]=s[0]+t[0];score[1]=s[1]+t[1];
	return score;
}
unittest{
	auto json = parseJSON(ExampleJson);
	auto width = width(json);
	auto board = decode(json);
	auto r = calc(board,width);
	writeln("Red:",r[0]," Blue:",r[1]);
}
