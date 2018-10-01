import std.conv;
import procon.container;
immutable int INF = 100000;

int abs(int a){
	return a>0?a:-a;
}

@safe
pure nothrow int[] calcSquarePriority(in Board board){
	int[] priorities;
	foreach(thisSquare;board.cells){
		int thisPriority;
		if (thisSquare.color==Color.Out){
			thisPriority=-INF;
		}
		else {
			int tmp=thisSquare.score;
			thisPriority=tmp*tmp*tmp/abs(tmp);
		}
		priorities~=thisPriority;
	}
	int width=board.width;
	foreach(i;0..board.cells.length){
		if (board[i].score>=0)
			continue;
		else{
			auto tmp=board[i].score*board[i].score;
			priorities[i-width]+=tmp;
			priorities[i+1]+=tmp;
			priorities[i+width]+=tmp;
			priorities[i-1]+=tmp;
		}
	}
	return priorities;
}

