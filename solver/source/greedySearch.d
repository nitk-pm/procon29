module procon.greedySearch;

import std.algorithm : min;
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
			int[2] directions=[0:direction1,1:direction2];
			auto tmp=proceedGameWithoutOp(color,cpBoard,directions);
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
	int redCnt=0,blueCnt=9;
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
	assert(redCnt==blueCnt&&redCnt==3);
	foreach(i;0..2){
		int minDist=100;
		foreach(j;0..2){
			minDist=min(minDist,min(redPos[i].x-bluePos[j].x,redPos[i].y-bluePos[j].y));//赤Aから青Aへ最短何ターンで到達できるか
		}
		distanceSum+=minDist;
	}
	return distanceSum;

}
