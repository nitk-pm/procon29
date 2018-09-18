module procon.mct;

import procon.playoutParts;
import procon.container;
import procon.calc;
import std.math;
import std.typecons;
import std.stdio;

import std.json;
import procon.decoder;
import procon.example;

/*
	訪問：あるノードに対しプレイアウトを行う(ランダムに終局までシミュレートする) こと
	展開：あるノードの取る盤面からランダムに1ターン進めた盤面をもつ子ノードたちを作ること

*/
class Node{
	int ownIdx=0;
	int parentNodeIdx=0;
	int[] childNodesIdx;
	int wins = 0;
	int visits = 0; //訪問回数
	float UCB1Score=0; //TODO :のちのちUCB1値とOperationの合理性を合わせて評価する予定、勝ち2回分優遇みたいな。
	int depth=0;//深さで回すターンが決まる
	Board board;
	Tuple!(Operation[2],"redOp",Operation[2],"blueOp") operations;
	bool isRoot(){return ownIdx==parentNodeIdx;}
	bool isLeaf(){return childNodesIdx.length<1;}
}
class MCT{
	int gameTurn;//ゲームの残りターン数
	const int threshold=10;//展開するかどうかの訪問回数のしきい値
	const int expandWidth=3;//一回の展開で開く状態の数
	int color;//チームの色
	float C = 1.0; // UCB1の定数、後々小さくするかも
	private int size=1;//最初にrootNodeをぶちこむので
	int totalVisitsCount=0;
	Node[] nodes;
	private void calculateUCB1(){
		foreach(currentNode;this.nodes){
			if (currentNode.visits==0){
				currentNode.UCB1Score=INF;
			}
			else {
				currentNode.UCB1Score = currentNode.wins/currentNode.visits
							+C*sqrt(2*log(totalVisitsCount)/currentNode.visits);
			}
		}
	}
	void visitNode(){
		this.calculateUCB1();
		float bestUCB1=0;
		int visitedNodeIdx=0;
		foreach (currentNode;this.nodes){
			if (currentNode.UCB1Score>bestUCB1){
				bestUCB1=currentNode.UCB1Score;
				visitedNodeIdx=currentNode.ownIdx;
			}
		}
		Board resultBoard = this.playout(nodes[visitedNodeIdx].board,gameTurn-nodes[visitedNodeIdx].depth);
		auto resultPair = scoreCalculation(resultBoard);
		int result;
		final switch(this.color){
			case Color.Red:result=resultPair.Red-resultPair.Blue;break;
			case Color.Blue:result=resultPair.Blue-resultPair.Red;break;
		}
		bool isWon=result>0;
		this.backPropagate(visitedNodeIdx,isWon);
		if (nodes[visitedNodeIdx].visits>=threshold)
			foreach(i;0..expandWidth)
				this.expandNode(visitedNodeIdx);
	}
	void backPropagate(int idx,bool isWon){
		if (isWon)
			++nodes[idx].wins;
		++nodes[idx].visits;
		if (nodes[idx].isRoot())
			++totalVisitsCount;
		else
			this.backPropagate(nodes[idx].parentNodeIdx,isWon);
	}
	void expandNode(int expandNodeIdx){
		Node parent=nodes[expandNodeIdx];
		foreach(i;0..expandWidth){
			Node child;
			++this.size;
			auto tmp=proceedGame(parent.board);
			child.operations=tuple(tmp.redOp,tmp.blueOp);
			child.board=tmp.board;
			child.ownIdx=size;
			child.parentNodeIdx=parent.ownIdx;
			child.depth=parent.depth+1;
			nodes~=child;
			nodes[expandNodeIdx].childNodesIdx~=child.ownIdx;
		}
	}
	Board playout(Board board,int turn){
		Board proceededBoard=board;
		foreach(i;0..turn){
			proceededBoard = proceedGameWithoutOp(proceededBoard);
		}
		return proceededBoard;
	}
	Operation[2] bestOp(){
		int bestVisitsCount=0;
		auto bestOp=nodes[1].operations;//型を書くのがめんどくさい
		foreach(currentNode;nodes){
			if (currentNode.depth==1){
				if (bestVisitsCount < currentNode.visits){
					bestVisitsCount=currentNode.visits;
					bestOp=currentNode.operations;
				}
			}
		}
		if (this.color==Color.Red)
			return bestOp.redOp;
		else
			return bestOp.blueOp;
	}
}
unittest{
	auto json = parseJSON(ExampleJson);
	auto board = decode(json);
	auto color = Color.Red;
	auto turn = 0;
	auto searchLimit = 30;
	MCT mct;
	mct.color=color;
	mct.gameTurn=turn;
	Node rootNode;
	rootNode.board = board;
	mct.nodes~=rootNode;
	foreach(i;0..searchLimit){
		mct.visitNode();
	}
	auto bestOp=mct.bestOp();
}
