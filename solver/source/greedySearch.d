module procon.greedySearch;

import std.json;
import std.conv;
import std.typecons;
import procon.container;
import procon.encoder;
import procon.simulator;
//import procon.mct;

int[2] greedySearch(in Color color,in Board board){
	Node[] candidateList;
	foreach(direction1;0..8)
		foreach(direction2;0..8){
			Node node;
			Board cpBoard;
			cpBoard.cells=board.cells.dup;
			cpBoard.width=board.width;
			auto tmp=proceedGameWithoutOp(color,cpBoard,{direcition1,direction2});
			Operation[2] tmpOp;
			switch(color){
				case color.Red:tmpOp=tmp.redOp;break;
				case color.Blue:tmpOp=tmp.blueOp;break;
				default:assert(false);
			}
			node.evalPoint=evalute(color,tmp.board);
			node.directions={direction1,direction2};
			candidateList~=node;
		}
	return bestDirections(candidateList);
}
@safe @nogc
pure nothrow int bestDirections(in Node[] list){
	int bestEval=-100000000;
	int bestEvalIdx=0;
	foreach(i;0..list.length){
		if (list[i].evalPoint>bestEval){
			bestEval=list[i].evalPoint;
			bestEvalIdx=cast(int)i;
		}
	}
	return list[bestEvalIdx].directions;
}
@safe @nogc
pure nothrow auto evalute(Color color,Board board){
	int redEval=0;
	int blueEval=0;
	foreach(i;0..board.cells.length){
		if(board.cells[i].color==Color.Red)
			redEval+=board.cells[i].priority;
		else if (board.cells[i].color==Color.Blue)
			blueEval+=board.cells[i].priority;
	}
	if (color==Color.Red)
		return redEval-blueEval;
	else
		return blueEval-redEval;
}
