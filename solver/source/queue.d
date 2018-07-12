module procon.container;
       
import std.stdio;

struct Square {//マスの情報
int score;
bool agent;
string color;
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
