
module procon.mct;

import procon.simulator;
import procon.container;
import procon.calc;
import procon.greedySearch;
import std.math;
import std.typecons;
import std.stdio;
import std.algorithm :min;
import std.json;
import procon.decoder;
import procon.example;
import procon.encoder;
/*
	訪問：あるノードに対しプレイアウトを行う(ランダムに終局までシミュレートする) こと
	展開：あるノードの取る盤面からランダムに1ターン進めた盤面をもつ子ノードたちを作ること
*/
immutable int searchLimit=10000;
struct MCTNode{
	int ownIdx=0;
	int parentNodeIdx=0;
	int[] childNodesIdx;
	int wins=0;
	int visits=0; //訪問回数
	float UCB1Score=0; //TODO :のちのちUCB1値とOperationの合理性を合わせて評価する予定、勝ち2回分優遇みたいな。
	int depth=0;//深さで回すターンが決まる
	Board board;
	int[2] enemyMove;
	Tuple!(Operation[2],"redOp",Operation[2],"blueOp") operations;
	bool isRoot(){return ownIdx==parentNodeIdx;}
	bool isLeaf(){return childNodesIdx.length<1;}
}
struct MCT{
	int gameTurn;//ゲームの残りターン数
	const int threshold=30;//展開するかどうかの訪問回数のしきい値
	const int expandWidth=10;//一回の展開で開く状態の数
	Color color;//チームの色
	Color enemyColor;
	float C=0.5; // UCB1の定数、後々小さくするかも
	private int size=0;//最初にrootNodeをぶちこむので
	int totalVisitsCount=0;
	int searchDepth;
	MCTNode[] nodes;
	private void calculateUCB1(){
		foreach(i;0..nodes.length){
			if (nodes[i].visits==0){
				nodes[i].UCB1Score=INF;
			}
			else {
				nodes[i].UCB1Score=nodes[i].wins/nodes[i].visits
							+C*sqrt(2*log(totalVisitsCount)/nodes[i].visits);
			}
		}
	}
	void visitNode(){
		this.calculateUCB1();
		float bestUCB1=0;
		int visitedNodeIdx=0;
		foreach (currentNode;this.nodes){
			if (currentNode.UCB1Score>=bestUCB1){
				bestUCB1=currentNode.UCB1Score;
				visitedNodeIdx=currentNode.ownIdx;
			}
		}
		Board resultBoard=this.playout(nodes[visitedNodeIdx].board,gameTurn-nodes[visitedNodeIdx].depth);
		auto resultPair=scoreCalculation(resultBoard);
		int result;
		switch(this.color){
			case Color.Red:result=resultPair.Red-resultPair.Blue;break;
			case Color.Blue:result=resultPair.Blue-resultPair.Red;break;
			default:assert(false);
		}
		bool isWon=result>0;
		this.backPropagate(visitedNodeIdx,isWon);
		if (nodes[visitedNodeIdx].visits>=threshold){
			if (nodes[visitedNodeIdx].depth==0){
			foreach(i;0..8)
				foreach(j;0..8){
					int[2] myMove=[0:i,1:j];
					this.expandNode(visitedNodeIdx,myMove);
				}
			}
			else{
				foreach(i;0..expandWidth){
					int[2] myMove=[0:rnd(),1:rnd()];
					this.expandNode(visitedNodeIdx,myMove);
				}
			}
		}
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
	void expandNode(in int expandNodeIdx,in int[2] myMove){
		MCTNode parent=nodes[expandNodeIdx];
		MCTNode child;
		child.board.cells=parent.board.cells.dup;
		child.board.width=parent.board.width;
		++this.size;
		auto tmp=proceedGame(this.color,child.board,parent.enemyMove,myMove);
		child.operations=tuple(tmp.redOp,tmp.blueOp);
		child.board=tmp.board;
		child.ownIdx=size;
		child.parentNodeIdx=parent.ownIdx;
		child.depth=parent.depth+1;
		child.enemyMove=greedySearch(this.enemyColor,child.board);
		if(evalute(this.color,parent.board)<evalute(this.color,child.board)){
			nodes~=child;
			nodes[expandNodeIdx].childNodesIdx~=child.ownIdx;
		}
	}
	Board playout(Board origBoard,int turn){
		Board proceededBoard;
		proceededBoard.cells=origBoard.cells.dup;
		proceededBoard.width=origBoard.width;
		foreach(i;0..searchDepth){
			int[2] directions=[0:rnd(),1:rnd()];
			proceededBoard=proceedGameWithoutOp(color,proceededBoard,directions);
		}
		return proceededBoard;
	}
	Operation[2] bestOp(){
		int bestVisitsCount=0;
		auto bestOp=nodes[1].operations;//型を書くのがめんどくさい
		nodes[0].childNodesIdx.length.writeln();
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
JSONValue MCTSearch(Color color,int turn,Board board){
	MCT mct;
	mct.color=color;
	mct.enemyColor= color==Color.Red ? Color.Red:Color.Blue;
	mct.gameTurn=turn;
	mct.searchDepth=min(board.cells.length/20,turn);//盤面は対称なので10%のさらに半分
	MCTNode root;
	root.board=board;
	root.enemyMove=greedySearch(mct.enemyColor,root.board);
	mct.nodes~=root;
	foreach(i;0..searchLimit){
		mct.visitNode();
	}
	auto bestOp=mct.bestOp();
	return makeOperationJson(color,bestOp);
}
unittest{
	auto json=parseJSON(ExampleJson);
	auto board=decode(json);
	auto color=Color.Red;
	auto turn=10;
	auto searchLimit=10000;
	auto searchDepth=min(board.cells.length/20,turn);//盤面は対称なので10%のさらに半分
	MCT mct;
	mct.color=color;
	mct.enemyColor=color==Color.Red ? Color.Red:Color.Blue;
	mct.gameTurn=turn;
	mct.searchDepth=searchDepth;
	MCTNode rootNode;
	rootNode.board=board;
	rootNode.enemyMove=greedySearch(mct.enemyColor,rootNode.board);
	mct.nodes~=rootNode;
	foreach(i;0..searchLimit){
		mct.visitNode();
	}
	auto bestOp=mct.bestOp();
	auto opjson=makeOperationJson(color,bestOp);
	writeln(opjson);
}
