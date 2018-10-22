module procon.searchPreprocess;

import std.conv;
import procon.container;

private immutable int INF = 100000;

@safe @nogc
pure nothrow int abs(in int a){
	return a>0?a:-a;
}

@safe
pure nothrow int[] calcSquarePriority(in Board board){
	int[] priorities;
	priorities.length = board.cells.length;
	int cnt=0;
	foreach(thisSquare;board.cells){
		int thisPriority;
		if (thisSquare.color==Color.Out){
			thisPriority=-INF;
		}
		else {
			int tmp=thisSquare.score;
			if (tmp==0)
				thisPriority=0;
			else
				thisPriority=tmp*tmp*tmp/abs(tmp);
		}
		priorities[cnt++]=thisPriority+1;
	}
	int width=board.width;
	foreach(i;0..board.cells.length){
		if (board.cells[i].score>=0||board.cells[i].color==Color.Out)
			continue;
		else{
			auto tmp=board.cells[i].score*board.cells[i].score;
			priorities[i-width]+=tmp;
			priorities[i+1]+=tmp;
			priorities[i+width]+=tmp;
			priorities[i-1]+=tmp;
		}
	}
	return priorities;
}
