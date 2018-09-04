module procon.calc;

import std.json;
import std.conv;
import std.stdio;
import std.typecons;
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

auto surroundCalc(Board board){
	Tuple!(int,"Red",int,"Blue") score;
	auto team = tuple(Color.Red,Color.Blue);
	foreach(color;team){//赤と青を分けて考える
//FIXME~
		bool[] visited;
		foreach(x;0..board.cells.length)
			visited~=false;
		auto q = Queue!int();
		for (int i=0;i<board.cells.length;i++){
			if (board.cells[i].color != Color.Out && board.cells[i].color != color && !visited[i]){//番兵と赤のマスと展開済みのマスは展開しちゃダメ
				q.push(i);
				visited[i]=true;//最初から番兵を探索済みにすると点数計算がおかしくなる
			}
			else continue;
			auto isSurrounded = true;//囲まれ判定、連結した一つの青白領域に対して考えるのでここで宣言
			int surroundPoint = 0;
			while (!q.empty){
				auto idx = q.top(); //現在のインデックス
				q.pop();
				surroundPoint += abs(board.cells[idx].score);
				int expandIdx; //展開先のインデックス
				for(int j=0;j<4;++j){
					final switch(j){
						//defalut :assert(false); //普通のswitchだとこれ書いててもdefaultないやんけって怒られるのでやむなくfinal switch。
						case 0:expandIdx = idx-board.width;	break;//↑
						case 1:expandIdx = idx+1;	break;//→
						case 2:expandIdx = idx+board.width;	break;//↓
						case 3:expandIdx = idx-1;	break;//←
					}
					if (!visited[expandIdx]){//探索済みなら展開しちゃダメ
						visited[expandIdx]=true;
						auto expandColor = board.cells[expandIdx].color; //展開先のcolor
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
				score.Red+=surroundPoint;
			else 
				score.Blue+=surroundPoint;
		}
	}
	return score;
}
auto tileCalc(Board board){
	Tuple!(int,"Red",int,"Blue") score;
	foreach(x;board.cells){
	if (x.color == Color.Red)	score.Red+=x.score;
	if (x.color == Color.Blue)	score.Blue+=x.score;
	}
	return score;
}
auto scoreCalculation(Board board){
	auto s = surroundCalc(board);
	auto t = tileCalc(board);
	Tuple!(int,"Red",int,"Blue") score;
	score = tuple(s.Red+t.Red,s.Blue+t.Blue);
	return score;
}
unittest{
	auto json = parseJSON(ExampleJson);
	auto board = decode(json);
	auto sampleScore = scoreCalculation(board);
	assert(sampleScore.Red==0);
	assert(sampleScore.Blue==0);
}
