module procon.greedySearch;

import std.algorithm : min;
import std.json;
import std.math:pow,abs;
import std.conv;
import std.typecons;
import procon.container;
import procon.encoder;
import procon.simulator;
import procon.searchPreprocess;
//import procon.mct;

unittest{
assert(pow(1,3)==1);
assert(pow(2,3)==8);
assert(pow(3,2)==9);
assert(pow(-2,3)==-8);
}


int[2] greedySearch(in Color color,in Board board){
	Node[] candidateList;
	foreach(direction1;0..8)
		foreach(direction2;0..8){
			Node node;
			Board cpBoard;
			cpBoard.cells=board.cells.dup;
			cpBoard.width=board.width;
			int[2] directions=[0:direction1,1:direction2];
			int[2] noMoves=[0:8,1:8];//動かない
			auto tmp=proceedGameWithoutOp(color,cpBoard,noMoves,directions);
			node.evalPoint=evalute(color,tmp);
			node.directions=directions;
			candidateList~=node;
		}
	return bestDirections(candidateList);
}
@safe @nogc
pure nothrow int[2] bestDirections(in Node[] list){
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
@safe 
pure nothrow int evalute(Color myColor,Color enemyColor,Board origBoard,Operation[2] operations){
	Board board;
	board.cells=origBoard.cells.dup;
	board.width=origBoard.width;
	foreach(op;operations){
		int idx=idx(op.to.x,op.to.y,board.width-2);
		if (board.cells[idx].color==enemyColor)
			board.cells[idx].color=Color.Neut;
		else {
			board.cells[idx].color=myColor;
		}
	}
	int redEval=0;
	int blueEval=0;
	foreach(i;0..board.cells.length){
		if(board.cells[i].color==Color.Red)
			redEval+=board.cells[i].priority;
		else if (board.cells[i].color==Color.Blue)
			blueEval+=board.cells[i].priority;
	}
	if (myColor==Color.Red)
		return redEval-blueEval;
	else
		return blueEval-redEval;
}

@safe @nogc
pure nothrow int evalute(Color color,Board board){
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
@safe @nogc
pure nothrow int calcAgentsDistance(in Color color,in Board board){
	int width=board.width;
	auto agents=searchAgentInitialPos(board);
	int distanceSum=0;
	int redCnt=0,blueCnt=0;
	Pos[2] redPos,bluePos;
	foreach(agent;agents){
		if (agent.color==Color.Red){
			redPos[redCnt].x=agent.pos%width;
			redPos[redCnt++].y=agent.pos/width;
		}
		else{
			bluePos[blueCnt].x=agent.pos%width;
			bluePos[blueCnt++].y=agent.pos/width;
		}
	}
	int tmpDist1=calcMinDist(redPos[0],bluePos[1])+calcMinDist(redPos[1],bluePos[0]);
	int tmpDist2=calcMinDist(redPos[0],bluePos[0])+calcMinDist(redPos[1],bluePos[1]);
	int enemyDist=min(tmpDist1,tmpDist2);
	distanceSum-=enemyDist;
	//if (color==Color.Red)
		//distanceSum-=pow(calcMinDist(redPos[0],redPos[1]),2);
	//else 
	//	distanceSum-=pow(calcMinDist(bluePos[0],bluePos[1]),2);
	return distanceSum;
}
@safe @nogc
private pure nothrow int calcMinDist(in Pos aPos,in Pos bPos){
	int xDist=abs(aPos.x-bPos.x);
	int yDist=abs(aPos.y-bPos.y);
	return min(xDist,yDist);
}
