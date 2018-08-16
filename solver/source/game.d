module procon.game;

import std.json;
import std.conv;
import std.stdio;
import std.math;
import std.random;
import std.typecons:tuple;
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
auto proceedGame(Square[] board,int width,Agent[] agentList){//1ターン進める、進めたあとの盤面とエージェントを返す。
	//1.パネル除去なのか進むのか判定
	//2.衝突などを検知
	auto heldAgents=agentList;//エージェントの動きを保持して無効な動きを検知する用
	auto prevAgents=agentList;//戻すとき用
	auto prevBoard=board;
	foreach(i;0..4){
		int tmp;
		//真上から時計回りに、0~7で方向を表現、8ならその場で動かない
		switch(rnd){
			case 0:tmp=-width;break;
			case 1:tmp=-width+1;break;
			case 2:tmp=1;break;
			case 3:tmp=width+1;break;
			case 4:tmp=width;break;
			case 5:tmp=width-1;break;
			case 6:tmp=-1;break;
			case 7:tmp=-width-1;break;
			case 8:tmp=0;break;
			default:assert(false);
		}
		int proPos=agentList[i].pos+tmp;//進んだ先の座標
		if (board[proPos].color==Color.Out)
			continue;//番外ならその動きは無効
		if (!(board[proPos].color == board[agentList[i].pos].color || board[proPos].color == Color.Neut)){
			board[proPos].color=agentList[i].color;//自陣でもNeutでもない領域に進もうとしているのでタイル除去とする
			continue;
		}
		else 
			heldAgents[i].pos=proPos;
	}
	foreach(i; 0..4){
		bool isInvalidMove=false;
		foreach(j;0..4){
			if (i==j)
				continue;
				isInvalidMove|=heldAgents[i].pos==heldAgents[j].pos;//同じ場所に移動しようとしているなら無効
		}
		if (isInvalidMove)
			continue;
		board[agentList[i].pos].agent=false;//エージェントの移動処理
		agentList[i].pos=heldAgents[i].pos;

		board[agentList[i].pos].color=agentList[i].color;
		board[agentList[i].pos].agent=true;
	}
	return tuple(board,agentList);
}

unittest{
	auto json = parseJSON(ExampleJson);
	auto width = width(json);
	auto board = decode(json);
	auto agentList = searchAgentInitialPos(board,width);
	assert (agentList.length == 4);
	
	/*
	auto tmp = tuple(board,agentList);
	
	foreach(dummy;0..30){
		board = tmp[0];
		agentList=tmp[1];
		tmp=proceedGame(board,width,agentList);
		writeln("");
		foreach(i;0..board.length){
			write(board[i].color);
			if ((i+1)%width==0)writeln("");
		}
		writeln("");
	}
	*/
}

