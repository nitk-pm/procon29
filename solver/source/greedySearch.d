module procon.greedySearch;

import std.algorithm : min;
import std.json;
import std.conv;
import std.typecons;
import procon.container;
import procon.encoder;
import procon.simulator;
import procon.searchPreprocess:abs;
//import procon.mct;

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
	auto agents=searchAgentInitialPos(board);
	foreach(op;operations){
		int idx=idx(op.to.x,op.to.y,board.width-2);
		if (board.cells[idx].color==enemyColor)
			board.cells[idx].color=Color.Neut;
		else {
			board.cells[idx].color=myColor;
		}
	}
	int agentDistance=calcAgentsDistance(agents,board.width);
	int redEval=0;
	int blueEval=0;
	foreach(i;0..board.cells.length){
		if(board.cells[i].color==Color.Red)
			redEval+=board.cells[i].priority;
		else if (board.cells[i].color==Color.Blue)
			blueEval+=board.cells[i].priority;
	}
	if (myColor==Color.Red)
		return redEval-blueEval+agentDistance;
	else
		return blueEval-redEval+agentDistance;
}

@safe @nogc
pure nothrow int evalute(Color color,Board board){
	auto agents=searchAgentInitialPos(board);
	int agentDistance=calcAgentsDistance(agents,board.width);
	int redEval=0;
	int blueEval=0;
	foreach(i;0..board.cells.length){
		if(board.cells[i].color==Color.Red)
			redEval+=board.cells[i].priority;
		else if (board.cells[i].color==Color.Blue)
			blueEval+=board.cells[i].priority;
	}
	if (color==Color.Red)
		return redEval-blueEval+agentDistance;
	else
		return blueEval-redEval+agentDistance;
}
@safe @nogc
pure nothrow int calcAgentsDistance(in Agent[4] agents,in int width){
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
	assert(redCnt==blueCnt&&redCnt==2);
	foreach(i;0..2){
		int minEnemyDist=100;
		foreach(j;0..2){
			minEnemyDist=min(minEnemyDist,min(abs(redPos[i].x-bluePos[j].x),abs(redPos[i].y-bluePos[j].y)));//赤Aから青Aへ最短何ターンで到達できるか
		}
		distanceSum-=minEnemyDist;//敵が近ければ引かれる数が小さく(近いほどよい)
	}
	distanceSum-=min(abs(redPos[0].x-redPos[1].x),abs(redPos[0].y-redPos[1].y));//味方と近ければ足される数が小さく(遠いほどよい)
	return distanceSum;

}
