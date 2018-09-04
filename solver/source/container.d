module procon.container;
       
import std.stdio;
import std.typecons;
import std.math;
const int INF = cast(int)1e9+7;

struct Cell {//マスの得点、エージェントの有無、色
	int score;
	bool agent;
	int color;
}
struct Board{
	Cell[] cells;
	int width;

}
enum Color{
	Red,Blue,Neut,Out
}
struct Agent { //エージェントの色と座標
	int color;
	int pos;//座標は一つの整数で表現する
}
struct Operation{
	Tuple!(int,"x",int,"y") from;
	Tuple!(int,"x",int,"y") to;
	int type;
}
enum Type{
	Move,Clear
}

struct Queue(T){
	T[] arr;
	bool empty(){
		return arr.length==0;
	}
	T top(){
		return arr[0];
	}
	void pop(){
		arr = arr[1..$];
	}
	void push(T a){
		arr ~= a;
	}
}
/*
class Node{
	int ownIdx;
	int parentNodeIdx;
	int[] childNodesIdx;
	int wins = 0;
	int visits = 0; //プレーアウトをやってみた回数
	float UCB1Score=0; //TODO :のちのちUCB1値とOperationの合理性を合わせて評価する予定、勝ち2回分優遇みたいな。
	Board board;
	Operation op;//深さが1のノードだけOperationを保持する
	bool isRoot(){return ownIdx==parentNodeIdx;}
	bool isLeaf(){return childNodesIdx.length<1;}
}
class MCT{
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
	int selectNodeIdx(){
		this.calculateUCB1();
		float bestUCB1=0;
		int bestNodeIdx=0;
		foreach (currentNode;this.nodes){
			if (currentNode.UCB1Score>bestUCB1){
				bestUCB1=currentNode.UCB1Score;
				bestNodeIdx=currentNode.ownIdx;
			}
		}
		auto resultBoard = this.playout(nodes[bestNodeIdx].board);
		
	}
	void expandNode(){}
	Board playout(Board board){}
}
*/
unittest {
	auto q = Queue!int();
	q.push(1);
	assert(q.top()==1);
	q.push(2);
	assert(q.top()==1);
	q.pop();
	assert(q.top()==2);
	q.pop();
	assert(q.empty);
}
