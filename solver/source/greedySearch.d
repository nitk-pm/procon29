module procon.greedySearch;

import std.json;
import std.conv;
import std.typecons;
import procon.container;
import procon.encoder;
import procon.simulator;
//import procon.mct;

JSONValue search(in Color color,in int turn,in Board board){
	Node[] candidateList;
	foreach(direction1;0..8)
		foreach(direction2;0..8){
			Node node;
			int[2] directions;directions[0]=direction1;directions[1]=direction2;
			auto tmp=proceedGameWithoutOp(color,board,directions);
			Operation[2] tmpOp;
			switch(color){
				case color.Red:tmpOp=tmp.redOp;break;
				case color.Blue:tmpOp=tmp.blueOp;break;
				default:assert(false);
			}
			node.evalPoint=evalute(color,tmp.board);
			node.operations=tmpOp;
			candidateList~=node;
		}
	Operation[2] bestOp=bestOperation(candidateList);
	return makeOperationJson(color,bestOp);
}
@safe @nogc
pure nothrow Operation[2] bestOperation(in Node[] list){
	int bestEval=-100000000;
	int bestEvalIdx=0;
	foreach(i;0..list.length){
		if (list[i].evalPoint>bestEval){
			bestEval=list[i].evalPoint;
			bestEvalIdx=cast(int)i;
		}
	}
	return list[bestEvalIdx].operations;
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
