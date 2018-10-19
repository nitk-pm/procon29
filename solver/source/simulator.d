module procon.simulator;

import std.conv;
import std.stdio;
import std.math;
import std.random;
import std.typecons;
import std.algorithm.mutation:swap;
import std.json: parseJSON;
import procon.container;
import procon.calc;
import procon.example;
import procon.decoder;

//進む先が敵陣のパネルならパネル除去操作に変更

@safe
int rnd(){//adhoc太郎
	auto rnd=Random(unpredictableSeed);
//	return uniform(0,9,rnd);
	return uniform(0,8,rnd);//停留をしない行動パターン
}
unittest {
	// これはあまり意味ない気がする
	assert(rnd() < 9);
	assert(rnd() >= 0);
}

@safe @nogc
pure auto searchAgentInitialPos(in Board board){//左上から右へ走査、見つけた順にぶち込む
	Agent[4] agents;
	int agentCnt=0;
	for (int i=board.width+1;i<board.cells.length-board.width-1;i++) {//番兵を除いた左上から右下へのループ
		if (board.cells[i].agent!=-1){
			agents[agentCnt++] = Agent(board.cells[i].color,i);
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

auto proceedGameWithoutOp(in Color color,Board board,in int[2] myMove){//1ターン進める、進めたあとの盤面のみを返す
	//1.パネル除去なのか進むのか判定
	//2.衝突などを検知
	Agent[4] agents=searchAgentInitialPos(board);//最終的なエージェントの動作
	auto heldAgents=agents;//エージェントの動きを保持して無効な動きを検知する用
	auto directionCnt=0;
	foreach(i;0..4){
		int direction;
		if(color==agents[i].color)
			direction=decideDirection(myMove[directionCnt++], board.width);
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
			if(i==j||!isInvalidMove[j])//進む方向に移動し損ねたエージェントがいても無効
				continue;
			isInvalidMove[i]|=heldAgents[i].pos==agents[j].pos;
		}
	}
	foreach(i;0..4){
		if (isInvalidMove[i])
			continue;
		swap(board.cells[agents[i].pos].agent,board.cells[agents[i].pos].agent);//エージェントの移動処理
		agents[i].pos=heldAgents[i].pos;

		board.cells[agents[i].pos].color=agents[i].color;
	}
	foreach(i;0..4){
		//assert(board.cells[agents[i].pos].agent==false);
		board.cells[agents[i].pos].color=agents[i].color;//お互いの立ってるパネルを除去しようとしたとき、後で処理された方は成功してしまうのでその対策
	}
	return board;
}

auto proceedGame(in Color color,in Board origBoard,in int[2] enemyMove,in int[2]myMove){//1ターン進める、進めたあとの盤面とチームごとにOperation2つを返す。
	//1.パネル除去なのか進むのか判定
	//2.衝突などを検知
	Tuple!(bool,"isValid",Tuple!(Board ,"board", Operation[2],"redOp",Operation[2],"blueOp"),"payload") result;
	result.isValid=false;
	int width=origBoard.width;
	Tuple!(Operation[2],"redOp",Operation[2],"blueOp") operations;
	Type[4] typeList;
	Pos[4] prevPosList, nextPosList;
	Agent[4] agents=searchAgentInitialPos(origBoard);//最終的なエージェントの動作
	int[4] destinationList;//エージェントの動きを保持して無効な動きを検知する用
	auto prevAgents=agents;
	int myDirecitionCnt=0;
	int enemyDirecitionCnt=0;
	foreach(i;0..4){
		prevPosList[i]=Pos(agents[i].pos%width,agents[i].pos/width);
		typeList[i]=Type.Move;
		int direction;
		if (color==agents[i].color)
			direction=decideDirection(myMove[myDirecitionCnt++],width);
		else 
			direction=decideDirection(enemyMove[enemyDirecitionCnt++],width);//敵は貪欲
		int destination=agents[i].pos+direction;//進んだ先の座標
		if (board.cells[destination].color==Color.Out){
			return result;
		}
		if (!(board.cells[destination].color==board.cells[agents[i].pos].color||board.cells[destination].color==Color.Neut)){
			typeList[i]=Type.Clear;
		}
		destinationList[i]=destination;
		nextPosList[i]=Pos(destination%board.width,destination/board.width);
		assert(heldAgents[i].pos!=0);
	}
	//FIXME　ここの上下の処理は関数を分けるべき
	//FORGIVEME Operationを取る関係で、上下で分けると戻り値がすごいTupleになってキモい
	Board board;
	{
	auto tmpCells=origBoard.cells.dup;
	auto tmpWidth=origBoard.width;
	board.cells=tmpCells;
	board.width=tmpWidth;
	}
/*
   同じ場所に移動(除去)しようとしているなら無効->無効な手で移動できなかったエージェントの場所に移動しようとするのも無効
   isInvalidMove==trueとなるとき，少なくとも二人は同じ座標に動こうとしている
   ->残っているのは二人なので，二回ループすれば無効手の影響で動けなかったエージェントをすべて検出できる．
*/
bool[4] isInvalidMove=false;
	foreach(i; 0..4){
		foreach(j;0..4){
			if (i==j)
				continue;
			isInvalidMove[i]|=destinationList[i]==destinationList[j];//同じ場所に移動しようとしているなら無効
		}
	}
	foreach(k;0..2){
		foreach(i;0..4){
			foreach(j;0..4){
				if(i==j||(!isInvalidMove[j]&&typeList[i]==Type.Move))//進む方向に移動し損ねたエージェントがいても無効
					continue;
				isInvalidMove[i]|=destinationList[i].pos==agents[j].pos;
			}
		}
	}
	foreach(i;0..4){
		if (isInvalidMove[i]){
			typeList[i]=Type.Move;
			nextPosList[i]=Pos(agents[i].pos%board.width,agents[i].pos/board.width);
			continue;
		}
		if(typeList[i]==Type.Move){
			swap(board.cells[destinationList[i]].agent,board.cells[prevAgents[i].pos].agent);//エージェントの移動処理
			board.cells[destinationList[i]].color=agents[i].color;
		}
		if (typeList[i]==Type.Clear){
			board.cells[destinationList[i]].color=Color.Neut;
		}
	}
	int redOpCnt=0;//GCを回さないためにちゃんと数えないとだめ。
	int blueOpCnt=0;

	foreach(i;0..4){
		board.cells[destinationList[i]].color=agents[i].color;//お互いの立ってるパネルを除去しようとしたとき、後で処理された方は成功してしまうのでその対策
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
	result.isValid=true;
	result.payload=Tuple!(Board ,"board", Operation[2],"redOp",Operation[2],"blueOp")(board,operations.redOp,operations.blueOp);
	return result
}
