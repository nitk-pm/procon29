module procon.search;
import std.json;
import procon.container;
import procon.encoder;
//import procon.mct;

JSONValue search(Color color,int turn,Board board){
	auto parentEval=Queue!Node();
	Node orig;
	foreach(direction1;0..9)
		foreach(direction2;0..9){
		int[2] directions={direction1,direction2};
			int proceededBoard=proceedGame(color,board,directions);
			Node
		}
}
@safe
pure int evalute(Color color,Board board){
	int priority=0;
	foreach(i;0..board.cells.length){
		if(board.cells[i].color==color)
			priority+=board.cells[i].priority;
	}
	return priority;
}
