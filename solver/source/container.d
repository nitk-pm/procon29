module procon.container;

import std.stdio;
import std.typecons;
const float INF=1e9+7;

// テスト用の補助関数
@safe @nogc
pure nothrow int idx(int x, int y, int w) {
	return (y + 1) * (w + 2) + x + 1;
}
unittest {
	assert (idx(2, 0, 5) == 10);
}

struct Cell {//マスの得点、エージェントの有無、色
	int score;
	int agent;
	Color color;
	int priority;
}
struct Board{
	Cell[] cells;
	int width;

}
enum Color{
	Red,Blue,Neut,Out
}
struct Agent { //エージェントの色と座標
	Color color;
	int pos;//座標は一つの整数で表現する
}
struct Pos{
	int x;
	int y;
}
struct Operation{
	Pos from;
	Pos to;
	Type type;
}
enum Type{
	Move,Clear
}
struct Node{
	int opCmp(ref const Node node)const{return this.evalPoint>node.evalPoint;}
	int ownIdx=0;
	int parentNodeIdx=0;
	int evalPoint=0;
	int depth=0;
	int[2] directions;//後にopでrestoreするように
	//Board board;盤面もたせると重そう
}

struct Queue(T){
	private int head=0,tail=0;
	T[256] arr;
	bool empty(){
		return head==tail;
	}
	T top(){
		return arr[head];
	}
	void pop(){
		head++;
	}
	void push(T a){
		arr[tail++]=a;
	}
}

unittest {
	auto q=Queue!int();
	q.push(1);
	assert(q.top()==1);
	q.push(2);
	assert(q.top()==1);
	q.pop();
	assert(q.top()==2);
	q.pop();
	assert(q.empty);
}
