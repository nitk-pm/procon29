module procon.mct;

import procon.container;
import procon.calc;
import std.math;
import std.typecons;
import std.stdio;
/*
	訪問：あるノードに対しプレイアウトを行う(ランダムに終局までシミュレートする) こと
	展開：あるノードの取る盤面からランダムに1ターン進めた盤面をもつ子ノードたちを作ること

*/
class Node{
	int ownIdx;
	int parentNodeIdx;
	int[] childNodesIdx;
	int wins = 0;
	int visits = 0; //プレーアウトをやってみた回数
	float UCB1Score=0; //TODO :のちのちUCB1値とOperationの合理性を合わせて評価する予定、勝ち2回分優遇みたいな。
	int depth=0;//深さで回すターンが決まる
	Board board;
	Operation op;//深さが1のノードだけOperationを保持する
	bool isRoot(){return ownIdx==parentNodeIdx;}
	bool isLeaf(){return childNodesIdx.length<1;}
}
class MCT{
	int gameTurn;//ゲームのターン数
	int threshold=10;//展開するかどうかの訪問回数のしきい値
	int color;//チームの色
	float C = 1.0; // UCB1の定数、後々小さくするかも
	private int size=0;
	private int totalVisitsCount=0;
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
		Board resultBoard = this.playout(nodes[visitedNodeIdx].board);
		auto resultPair = scoreCalculation(resultBoard);
		int result;
		final switch(this.color){
			case Color.Red:result=resultPair.Red-resultPair.Blue;
			case Color.Blue:result=resultPair.Blue-resultPair.Red;
		}
		if (result>0)
			++nodes[visitedNodeIdx].wins;
		++nodes[visitedNodeIdx].visited;
		if (nodes[visitedNodeIdx].visited>=threshold)
			expandNode(visitedNodeIdx)
	}
	void expandNode(int expandNodeIdx){
	
	}
	Board playout(Board board,int turn){}
}
