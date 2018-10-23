module procon.mct;

import procon.simulator;
import procon.container;
import procon.calc;
import procon.greedySearch;
import std.math;
import std.typecons;
import std.conv: to;
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

immutable int searchLimit=5000;
immutable double EPS= 1e-9;
struct MCTNode{
	int ownIdx=0;
	int parentNodeIdx=0;
	int[] childNodesIdx;
	int wins=0;
	int visits=0; //訪問回数
	int evalution=0;
	int scoreIncrease=0;
	int agentDistance=0;
	double UCB1Score=-INF; //TODO :のちのちUCB1値とOperationの合理性を合わせて評価する予定、勝ち2回分優遇みたいな。
	int depth=0;//深さで回すターンが決まる
	Board board;
	int[2] enemyMove;
	Tuple!(Operation[2],"redOp",Operation[2],"blueOp") operations;
	bool isRoot(){return ownIdx==parentNodeIdx;}
	bool isLeaf(){return childNodesIdx.length<1;}
}
struct MCT{
	const int threshold=100;//展開するかどうかの訪問回数のしきい値
	const int expandWidth=10;//一回の展開で開く状態の数
	Color color;//チームの色
	Color enemyColor;
	private int size=0;//最初にrootNodeをぶちこむので
	int totalVisitsCount=0;
	int searchDepth;
	MCTNode[] nodes;
	
	//係数たち
	double  C1=1000.0;//勝率の重み
	double C2=300.0;//探索回数の少なさの重み
	double C3=0.05;//evalの増値の重み
	double C4=3.0;//スコアの増値の重み
	double C5=4.0;//エージェントの距離

	private void calculateUCB1(){
		foreach(i;1..nodes.length){
			if (nodes[i].visits==0){
				nodes[i].UCB1Score=10000000000;
			}
			else {
				nodes[i].UCB1Score=
							+C1*nodes[i].wins/nodes[i].visits
							+C2*sqrt(2*log(totalVisitsCount)/nodes[i].visits)
							+C3*nodes[i].evalution*abs(nodes[i].evalution)
							+C4*pow(nodes[i].scoreIncrease,3)
							+C5*nodes[i].agentDistance*abs(nodes[i].agentDistance);
			}
		}
	}
	void visitNode(){
		this.calculateUCB1();
		double bestUCB1=-INF;
		int visitedNodeIdx=0;
		foreach (currentNode;this.nodes){
			if (currentNode.UCB1Score>=bestUCB1){
				bestUCB1=currentNode.UCB1Score;
				visitedNodeIdx=currentNode.ownIdx;
			}
		}
		nodes[visitedNodeIdx].UCB1Score-=EPS;
		Board resultBoard=this.playout(nodes[visitedNodeIdx].board,nodes[visitedNodeIdx].depth);
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
			else if (nodes[visitedNodeIdx].depth<=searchDepth){
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
		auto tmp=proceedGame(this.color,parent.board,parent.enemyMove,myMove);
		if (!tmp.isValid)
			return;
		auto trialResult=tmp.payload;
		child.operations=tuple(trialResult.redOp,trialResult.blueOp);
		child.board=trialResult.board;
		child.ownIdx=size+1;
		child.parentNodeIdx=parent.ownIdx;
		child.depth=parent.depth+1;
		child.enemyMove=greedySearch(this.enemyColor,child.board);
		{
		Operation[2] tmpOp;
		tmpOp=color==Color.Red?child.operations.redOp:child.operations.blueOp;
		child.evalution=evalute(color,enemyColor,parent.board,tmpOp)-parent.evalution;
		}
		{
		auto parentCalc=scoreCalculation(parent.board);
		auto childCalc=scoreCalculation(child.board);
		if (color==Color.Red)
		child.scoreIncrease=(childCalc.Red-childCalc.Blue)-(parentCalc.Red-parentCalc.Blue);
		else
		child.scoreIncrease=(childCalc.Blue-childCalc.Red)-(parentCalc.Blue-parentCalc.Red);
		}
		child.agentDistance=calcAgentsDistance(color,child.board);
		++this.size;
		nodes~=child;
		nodes[expandNodeIdx].childNodesIdx~=child.ownIdx;
	}
	
	Board playout(Board origBoard,int depth){
		Board proceededBoard;
		proceededBoard.cells=origBoard.cells.dup;
		proceededBoard.width=origBoard.width;
		foreach(i;0..searchDepth-depth){
			int[2] myDirections=[0:rnd(),1:rnd()];
			int[2] enemyDirections=[0:rnd(),1:rnd()];
			proceededBoard=proceedGameWithoutOp(color,proceededBoard,enemyDirections,myDirections);
		}
		return proceededBoard;
	}
	Operation[2] bestOp(){
		int bestVisitsCount=0;
		nodes.length.writeln();
		assert(nodes.length>2);
		auto bestID=0;//型を書くのがめんどくさい
		foreach(i;0..nodes.length){
			if (nodes[i].depth==1){
				if (bestVisitsCount < nodes[i].visits){
					bestVisitsCount=nodes[i].visits;
					bestID=i.to!int;
		write("id : ");bestID.writeln;
		write("visits : ");bestVisitsCount.writeln;
		write("win/try : " );writeln(nodes[bestID].wins/nodes[bestID].visits.to!double);
		write("evalution : ");nodes[bestID].evalution.writeln;
		write("scoreIncrease : ");nodes[bestID].scoreIncrease.writeln;
		write("agentDistance : ");nodes[bestID].agentDistance.writeln;
		write("totalScore : ");nodes[bestID].UCB1Score.writeln;
				}
			}
		}	
		auto bestOp=nodes[bestID].operations;
		if (this.color==Color.Red)
			return bestOp.redOp;
		else
			return bestOp.blueOp;
	}
}
JSONValue MCTSearch(Color color,int turn,Board board){
	MCT mct;
	mct.color=color;
	mct.enemyColor=color==Color.Red ? Color.Blue:Color.Red;
	assert(mct.color!=mct.enemyColor);
	assert(board.cells.length>20);
	assert(turn>=0);
	mct.searchDepth=min(board.cells.length/20,turn);//盤面は対称なので10%のさらに半分
	mct.searchDepth.writeln;
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
	//auto searchDepth=min(board.cells.length/20,turn);//盤面は対称なので10%のさらに半分
	auto searchDepth=turn;
	MCT mct;
	mct.color=color;
	mct.enemyColor=color==Color.Red ? Color.Red:Color.Blue;
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
