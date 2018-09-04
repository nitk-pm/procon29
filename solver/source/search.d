module procon.game;

import std.json;
import std.conv;
import std.stdio;
import std.math;
import std.random;
import std.typecons;
import procon.container;
import procon.decoder;
import procon.example;
import procon.calc;
//進む先が敵陣のパネルならパネル除去操作に変更
const int SEARCH_WIDTH=3;

int rnd(){//adhoc太郎
	auto rnd = Random(unpredictableSeed);
	return uniform(0,9,rnd);
}
auto searchAgentInitialPos(Board board){//左上から右へ走査、見つけた順にぶち込む
	Agent[] agentList;
	for(int i=board.width+1;i<board.cells.length-board.width-1;i++)//番兵を除いた左上から右下へのループ
		if (board.cells[i].agent)
			agentList ~= Agent(board.cells[i].color,i);
	return agentList;
}

auto searchNextHandle(int myColor,Board board,Agent[] agentList){//Operation2つを返す
/*	int colorIdx;
	switch(myColor){
		case Color.Red:colorIdx=0;break;
		case Color.Blue:colorIdx=1;break;
		default:assert(false);
	}
	*/
	Tuple!(int,"score",Operation[2],"operations")[SEARCH_WIDTH] nextHandleCandidateList;
	foreach(i;0..SEARCH_WIDTH){
		auto trial = proceedGame(myColor,board,agentList);
		auto score=scoreCalculation(trial.board);//FIXME 名前が危険
		//nextHandleCandidateList[i].score=score[colorIdx]; /+FIXME　コンパイル時に読めないって怒られた+/
		switch(myColor){
			case Color.Red:nextHandleCandidateList[i].score=score[0];break;
			case Color.Blue:nextHandleCandidateList[i].score=score[1];break;
			default:assert(false);
		}
		nextHandleCandidateList[i].operations=(trial.operations);
	}
	auto bestHandle=nextHandleCandidateList[0];
	foreach(currentCandidate;nextHandleCandidateList){
		bestHandle = bestHandle.score > currentCandidate.score ? bestHandle:currentCandidate;
	}
	auto dbg = bestHandle.operations;
	return dbg;
}	

auto proceedGame(int myColor,Board board,Agent[] agentList){//1ターン進める、進めたあとの盤面とOperation2つを返す。
	//1.パネル除去なのか進むのか判定
	//2.衝突などを検知
	Operation[2] operations;
	int[4] typeList;
	Tuple!(int,int)[4] prevPosList, nextPosList;
	auto heldAgents=agentList;//エージェントの動きを保持して無効な動きを検知する用
	auto prevAgents=agentList;//戻すとき用
	auto prevBoard=board.cells;
	foreach(i;0..4){
		typeList[i]=Type.Move;
		int direction;
		//真上から時計回りに、0~7で方向を表現、8ならその場で動かない
		switch(rnd){
			case 0:direction=-board.width;break;
			case 1:direction=-board.width+1;break;
			case 2:direction=1;break;
			case 3:direction=board.width+1;break;
			case 4:direction=board.width;break;
			case 5:direction=board.width-1;break;
			case 6:direction=-1;break;
			case 7:direction=-board.width-1;break;
			case 8:direction=0;break;
			default:assert(false);
		}
		int destination=agentList[i].pos+direction;//進んだ先の座標
		if (board.cells[destination].color==Color.Out){
			nextPosList[i]=tuple(agentList[i].pos%board.width-1,agentList[i].pos/board.width-1);
			continue;
		}
		if (!(board.cells[destination].color == board.cells[agentList[i].pos].color || board.cells[destination].color == Color.Neut)){
			board.cells[destination].color=Color.Neut;//自陣でもNeutでもない領域に進もうとしているのでタイル除去とする
			typeList[i] = Type.Clear;
		}
		else{
			heldAgents[i].pos=destination;
		}
		nextPosList[i]=tuple(destination%board.width-1,destination/board.width-1);
	}
	//FIXME　ここの上下の処理は関数を分けるべき
	foreach(i; 0..4){
		bool isInvalidMove=false;
		foreach(j;0..4){
			if (i==j)
				continue;
			isInvalidMove|=heldAgents[i].pos==heldAgents[j].pos;//同じ場所に移動しようとしているなら無効
		}
		if (isInvalidMove){
			nextPosList[i]=tuple(agentList[i].pos%board.width-1,agentList[i].pos/board.width-1);
			continue;
		}
		board.cells[agentList[i].pos].agent=false;//エージェントの移動処理
		agentList[i].pos=heldAgents[i].pos;

		board.cells[agentList[i].pos].color=agentList[i].color;
		board.cells[agentList[i].pos].agent=true;
	}
	foreach(i;0..4){
		board.cells[agentList[i].pos].color=agentList[i].color;//お互いの立ってるパネルを除去しようとしたとき、後で処理された方は成功してしまうので
		int opCnt=0;
		if (agentList[i].color == myColor){
			operations[opCnt].from = prevPosList[i];
			operations[opCnt].to =nextPosList[i];
			operations[opCnt].type =typeList[i];
			++opCnt;
		}
	}
	return Tuple!(Board ,"board", Operation[2] ,"operations")(board,operations);
}

unittest{
	auto json = parseJSON(ExampleJson);
	auto board = decode(json);
	auto agentList = searchAgentInitialPos(board);
	assert (agentList.length == 4);
	
}
	

