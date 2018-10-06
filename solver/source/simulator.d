module procon.simulator;

import std.conv;
import std.stdio;
import std.math;
import std.random;
import std.typecons;
import std.json: parseJSON;
import procon.container;
import procon.calc;
import procon.example;
import procon.decoder;

//進む先が敵陣のパネルならパネル除去操作に変更

@safe @nogc
pure auto searchAgentInitialPos(in Board board){//左上から右へ走査、見つけた順にぶち込む
	Agent[4] agents;
	int agentCnt=0;
	for (int i=board.width+1;i<board.cells.length-board.width-1;i++) {//番兵を除いた左上から右下へのループ
		if (board.cells[i].agent){
			agents[agentCnt++] = Agent(board.cells[i].color, i);
		}
	}
	if (agentCnt != 4){
		//writeln(agentCnt);
		assert(false);
	}
	return agents;
}
unittest {
	immutable board = ExampleJson.parseJSON.decode;
	assert(searchAgentInitialPos(board) == [
		Agent(Color.Blue, idx(1, 1, 11)),
		Agent(Color.Red, idx(9, 1, 11)),
		Agent(Color.Red, idx(1, 6, 11)),
		Agent(Color.Blue, idx(9, 6, 11)),
	]);
}

@nogc @safe
pure nothrow int decideDirection(in int seed, in int width){//真上から時計回りに、0~7で方向を表現、8ならその場で動かない
	int direction;
	switch(seed){
		case 0:direction=-width;break;
		case 1:direction=-width+1;break;
		case 2:direction=1;break;
		case 3:direction=width+1;break;
		case 4:direction=width;break;
		case 5:direction=width-1;break;
		case 6:direction=-1;break;
		case 7:direction=-width-1;break;
		case 8:direction=0;break;
		default:assert(false);
	}
	return direction;
}
unittest {
	assert (decideDirection(0, 1) == -1);
	assert (decideDirection(1, 2) == -1);
	assert (decideDirection(2, 3) == 1);
	assert (decideDirection(3, 4) == 5);
	assert (decideDirection(4, 5) == 5);
	assert (decideDirection(5, 6) == 5);
	assert (decideDirection(6, 7) == -1);
	assert (decideDirection(7, 8) == -9);
	assert (decideDirection(8, 9) == 0);
}

auto proceedGameWithoutOp(in Color color,Board board,in int[2] directions){//1ターン進める、進めたあとの盤面のみを返す
	//1.パネル除去なのか進むのか判定
	//2.衝突などを検知
	Agent[4] agents=searchAgentInitialPos(board);//最終的なエージェントの動作
	auto heldAgents=agents;//エージェントの動きを保持して無効な動きを検知する用
	auto prevAgents=agents;//戻すとき用
	auto directionCnt=0;
	auto prevBoard=board.cells;
	foreach(i;0..4){
		int direction;
		if(color==agents[i].color)
			direction=decideDirection(directions[directionCnt++], board.width);
		else 
			direction=decideDirection(8, board.width);//自チームじゃないエージェントは動かない
		int destination=agents[i].pos+direction;//進んだ先の座標
		if (board.cells[destination].color==Color.Out){
			continue;
		}
		if (!(board.cells[destination].color==board.cells[agents[i].pos].color||board.cells[destination].color==Color.Neut)){
			board.cells[destination].color=Color.Neut;//自陣でもNeutでもない領域に進もうとしているのでタイル除去とする
		}
		else{
			heldAgents[i].pos=destination;
		}
	}
	//FIXME　ここの上下の処理は関数を分けるべき
	//FORGIVEME Operationを取る関係で、上下で分けると戻り値がすごいTupleになってキモい
	bool[4] isInvalidMove=false;
	foreach(i; 0..4){
		foreach(j;0..4){
			if (i==j)
				continue;
			isInvalidMove[i]|=heldAgents[i].pos==heldAgents[j].pos;//同じ場所に移動しようとしているなら無効
		}
	}
	foreach(i;0..4){
		foreach(j;0..4){
			if(i==j||!isInvalidMove[j])
				continue;
			isInvalidMove[i]|=heldAgents[i].pos==agents[j].pos;
		}
	}
	foreach(i;0..4){
		if (isInvalidMove[i])
			continue;
		board.cells[agents[i].pos].agent=false;//エージェントの移動処理
		agents[i].pos=heldAgents[i].pos;

		board.cells[agents[i].pos].color=agents[i].color;
	}
	foreach(i;0..4){
		//assert(board.cells[agents[i].pos].agent==false);
		board.cells[agents[i].pos].agent=true;
		board.cells[agents[i].pos].color=agents[i].color;//お互いの立ってるパネルを除去しようとしたとき、後で処理された方は成功してしまうのでその対策
	}
	return board;
}

auto proceedGame(in Color color,in Board origBoard,in int[2] directions){//1ターン進める、進めたあとの盤面とチームごとにOperation2つを返す。
	//1.パネル除去なのか進むのか判定
	//2.衝突などを検知
	Board board;
	{
	auto tmpCells=origBoard.cells.dup;
	auto tmpWidth=origBoard.width;
	board.cells=tmpCells;
	board.width=tmpWidth;
	}
	Tuple!(Operation[2],"redOp",Operation[2],"blueOp") operations;
	Type[4] typeList;
	Tuple!(int,int)[4] prevPosList, nextPosList;
	Agent[4] agents=searchAgentInitialPos(board);//最終的なエージェントの動作
	auto heldAgents=agents;//エージェントの動きを保持して無効な動きを検知する用
	auto prevAgents=agents;//戻すとき用
	auto prevBoard=board.cells;
	foreach(i;0..4){
		prevPosList[i]=tuple(agents[i].pos%board.width,agents[i].pos/board.width);
		assert(heldAgents[i].pos!=0);
		typeList[i]=Type.Move;
		int direction=decideDirection(rnd, board.width);
		int destination=agents[i].pos+direction;//進んだ先の座標
		if (board.cells[destination].color==Color.Out){
			nextPosList[i]=tuple(agents[i].pos%board.width,agents[i].pos/board.width);
			continue;
		}
		if (!(board.cells[destination].color==board.cells[agents[i].pos].color||board.cells[destination].color==Color.Neut)){
			board.cells[destination].color=Color.Neut;//自陣でもNeutでもない領域に進もうとしているのでタイル除去とする
			typeList[i]=Type.Clear;
		}
		else{
			heldAgents[i].pos=destination;
		}
		nextPosList[i]=tuple(destination%board.width,destination/board.width);
		assert(heldAgents[i].pos!=0);
	}
	//FIXME　ここの上下の処理は関数を分けるべき
	//FORGIVEME Operationを取る関係で、上下で分けると戻り値がすごいTupleになってキモい
	bool[4] isInvalidMove=false;
	foreach(i; 0..4){
		foreach(j;0..4){
			if (i==j)
				continue;
			isInvalidMove[i]|=heldAgents[i].pos==heldAgents[j].pos;//同じ場所に移動しようとしているなら無効
		}
	}
	foreach(i;0..4){
		foreach(j;0..4){
			if(i==j||!isInvalidMove[j])
				continue;
			isInvalidMove[i]|=heldAgents[i].pos==agents[j].pos;
		}
	}
	foreach(i;0..4){
		if (isInvalidMove[i]){
			typeList[i]=Type.Move;
			nextPosList[i]=tuple(agents[i].pos%board.width,agents[i].pos/board.width);
			continue;
		}
		board.cells[agents[i].pos].agent=false;//エージェントの移動処理
		agents[i].pos=heldAgents[i].pos;
		board.cells[agents[i].pos].color=agents[i].color;
	}
	int redOpCnt=0;//GCを回さないためにちゃんと数えないとだめ。
	int blueOpCnt=0;

	foreach(i;0..4){
		board.cells[agents[i].pos].agent=true;
		board.cells[agents[i].pos].color=agents[i].color;//お互いの立ってるパネルを除去しようとしたとき、後で処理された方は成功してしまうのでその対策
			if (agents[i].color==Color.Red){
				operations.redOp[redOpCnt].from=prevPosList[i];
				operations.redOp[redOpCnt].to=nextPosList[i];
				operations.redOp[redOpCnt].type=typeList[i];
				++redOpCnt;
			}
			if (agents[i].color==Color.Blue){
				operations.blueOp[blueOpCnt].from=prevPosList[i];
				operations.blueOp[blueOpCnt].to=nextPosList[i];
				operations.blueOp[blueOpCnt].type=typeList[i];
				++blueOpCnt;
			}
	}
	return Tuple!(Board ,"board", Operation[2],"redOp",Operation[2],"blueOp")(board,operations.redOp,operations.blueOp);
}
