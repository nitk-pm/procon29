module procon.search;
import std.json;
import procon.container;
import procon.encoder;
import procon.mct;
const int searchLimit=1000;
JSONValue[2] search(int color,int turn,Board board){
	MCT mct;
	mct.color=color;
	mct.gameTurn=turn;
	Node rootNode;
	rootNode.board=board;
	mct.nodes~=rootNode;
	foreach(i;0..searchLimit){
		mct.visitNode();
	}
	auto bestOp=mct.bestOp();
	return makeOperationJson(color,bestOp);
	
}
