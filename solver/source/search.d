module procon.game;

import std.json;
import std.conv;
import std.stdio;
import std.math;
import std.random;
import std.typecons;
import procon.container;
import procon.decoder: width, decode;
import procon.example;
//進む先が敵陣のパネルならパネル除去操作に変更
int rnd(){//adhoc太郎
	auto rnd = Random(unpredictableSeed);
	return uniform(0,9,rnd);
}
auto searchAgentInitialPos(Square[] board,int width){//左上から右へ走査、見つけた順にぶち込む
	Agent[] agentList;
	for(int i=width+1;i<board.length-width-1;i++)//番兵を除いた左上から右下へのループ
		if (board[i].agent)
			agentList ~= Agent(board[i].color,i);
	return agentList;
}

auto searchNextHandle(int color,Square[] board,int width,Agent[] agentList){//
	
}

auto proceedGame(int myColor,Square[] board,int width,Agent[] agentList){//1ターン進める、進めたあとの盤面とOperation2つを返す。
	//1.パネル除去なのか進むのか判定
	//2.衝突などを検知
	Operation[4] operations;
	int[4] typeList;
	Tuple!(int,int)[4] prevPosList, nextPosList;
	auto heldAgents=agentList;//エージェントの動きを保持して無効な動きを検知する用
	auto prevAgents=agentList;//戻すとき用
	auto prevBoard=board;
	foreach(i;0..4){
		typeList[i]=Type.Move;
		int direction;
		//真上から時計回りに、0~7で方向を表現、8ならその場で動かない
		switch(rnd){
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
		int destination=agentList[i].pos+direction;//進んだ先の座標
		if (board[destination].color==Color.Out){
			nextPosList[i]=tuple(agentList[i].pos%width-1,agentList[i].pos/width-1);
			continue;
		}
		if (!(board[destination].color == board[agentList[i].pos].color || board[destination].color == Color.Neut)){
			board[destination].color=Color.Neut;//自陣でもNeutでもない領域に進もうとしているのでタイル除去とする
			typeList[i] = Type.Clear;
		}
		else{
			heldAgents[i].pos=destination;
		}
		nextPosList[i]=tuple(destination%width-1,destination/width-1);
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
			nextPosList[i]=tuple(agentList[i].pos%width-1,agentList[i].pos/width-1);
			continue;
		}
		board[agentList[i].pos].agent=false;//エージェントの移動処理
		agentList[i].pos=heldAgents[i].pos;

		board[agentList[i].pos].color=agentList[i].color;
		board[agentList[i].pos].agent=true;
	}
	foreach(i;0..4){
		board[agentList[i].pos].color=agentList[i].color;//お互いの立ってるパネルを除去しようとしたとき、後で処理された方は成功してしまうので
		int opCnt=0;
		if (agentList[i].color == myColor){
			operations[opCnt].from = prevPosList[i];
			operations[opCnt].to =nextPosList[i];
			operations[opCnt].type =typeList[i];
			++opCnt;
		}
	}
	return tuple(board,operations);
}

unittest{
	auto json = parseJSON(ExampleJson);
	auto width = width(json);
	auto board = decode(json);
	auto agentList = searchAgentInitialPos(board,width);
	assert (agentList.length == 4);
	
}
	

