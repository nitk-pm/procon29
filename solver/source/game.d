module procon.game;

import std.json;
import std.conv;
import std.stdio;
import std.math;
import std.random;
import procon.container;
import procon.decoder;
import procon.example;
//真上から時計回りに、0~7で方向を表現、8ならその場で動かない
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
	foreach(i;0..3){
		int proPos=agentList[i].pos+rnd();
	}
	foreach(i;0..3){

	}
}

