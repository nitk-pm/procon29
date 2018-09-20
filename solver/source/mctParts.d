module procon.playoutParts;

import std.conv;
import std.stdio;
import std.math;
import std.random;
import std.typecons;
import procon.container;
import procon.calc;

//進む先が敵陣のパネルならパネル除去操作に変更
const int SEARCH_WIDTH=3;

int rnd(){//adhoc太郎
	auto rnd = Random(unpredictableSeed);
	return uniform(0,9,rnd);
}
auto searchAgentInitialPos(Board board){//左上から右へ走査、見つけた順にぶち込む
	Agent[4] agentList;
	int agentCnt=0;
	for(int i=board.width+1;i<board.cells.length-board.width-1;i++)//番兵を除いた左上から右下へのループ
		if (board.cells[i].agent){
			agentList[agentCnt++] = Agent(board.cells[i].color,i);
		}
if (agentCnt!=4){
        writeln(agentCnt);
        assert(false);
}
	return agentList;
}
/+
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
+/
int decideDirection(int width){//真上から時計回りに、0~7で方向を表現、8ならその場で動かない
	int direction;
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
	return direction;
}
auto proceedGameWithoutOp(Board board){//1ターン進める、進めたあとの盤面のみを返す、プレイアウト用
	//1.パネル除去なのか進むのか判定
	//2.衝突などを検知
	Agent[4] agentList=searchAgentInitialPos(board);//最終的なエージェントの動作
	auto heldAgents=agentList;//エージェントの動きを保持して無効な動きを検知する用
	auto prevAgents=agentList;//戻すとき用
	auto prevBoard=board.cells;
	foreach(i;0..4){
		int direction=decideDirection(board.width);
		int destination=agentList[i].pos+direction;//進んだ先の座標
		if (board.cells[destination].color==Color.Out){
			continue;
		}
		if (!(board.cells[destination].color == board.cells[agentList[i].pos].color || board.cells[destination].color == Color.Neut)){
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
                        isInvalidMove[i]|=heldAgents[i].pos==agentList[j].pos;
                }
        }
        foreach(i;0..4){
                if (isInvalidMove[i])
                        continue;
		board.cells[agentList[i].pos].agent=false;//エージェントの移動処理
		agentList[i].pos=heldAgents[i].pos;

		board.cells[agentList[i].pos].color=agentList[i].color;
	}
	foreach(i;0..4){
		//assert(board.cells[agentList[i].pos].agent==false);
		board.cells[agentList[i].pos].agent=true;
		board.cells[agentList[i].pos].color=agentList[i].color;//お互いの立ってるパネルを除去しようとしたとき、後で処理された方は成功してしまうのでその対策
	}
	return board;
}
auto proceedGame(Board board){//1ターン進める、進めたあとの盤面とチームごとにOperation2つを返す。
	//1.パネル除去なのか進むのか判定
	//2.衝突などを検知
	Tuple!(Operation[2],"redOp",Operation[2],"blueOp") operations;
	int[4] typeList;
	Tuple!(int,int)[4] prevPosList, nextPosList;
	Agent[4] agentList=searchAgentInitialPos(board);//最終的なエージェントの動作
	auto heldAgents=agentList;//エージェントの動きを保持して無効な動きを検知する用
	auto prevAgents=agentList;//戻すとき用
	auto prevBoard=board.cells;
	foreach(i;0..4){
                assert(heldAgents[i].pos!=0);
		typeList[i]=Type.Move;
		int direction=decideDirection(board.width);
		int destination=agentList[i].pos+direction;//進んだ先の座標
		if (board.cells[destination].color==Color.Out){
			nextPosList[i]=tuple(agentList[i].pos%board.width,agentList[i].pos/board.width);
			continue;
		}
		if (!(board.cells[destination].color == board.cells[agentList[i].pos].color || board.cells[destination].color == Color.Neut)){
			board.cells[destination].color=Color.Neut;//自陣でもNeutでもない領域に進もうとしているのでタイル除去とする
			typeList[i] = Type.Clear;
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
                        isInvalidMove[i]|=heldAgents[i].pos==agentList[j].pos;
                }
        }
        foreach(i;0..4){
		if (isInvalidMove[i]){
                        typeList[i]=Type.Move;
			nextPosList[i]=tuple(agentList[i].pos%board.width,agentList[i].pos/board.width);
			continue;
		}
		board.cells[agentList[i].pos].agent=false;//エージェントの移動処理
		agentList[i].pos=heldAgents[i].pos;
		board.cells[agentList[i].pos].color=agentList[i].color;
	}
	foreach(i;0..4){
		board.cells[agentList[i].pos].agent=true;
		board.cells[agentList[i].pos].color=agentList[i].color;//お互いの立ってるパネルを除去しようとしたとき、後で処理された方は成功してしまうのでその対策
		int redOpCnt=0;//GCを回さないためにちゃんと数えないとだめ。
		int blueOpCnt=0;
			if (agentList[i].color == Color.Red){
			operations.redOp[redOpCnt].from = prevPosList[i];
			operations.redOp[redOpCnt].to =nextPosList[i];
			operations.redOp[redOpCnt].type =typeList[i];
			++redOpCnt;
		}
			if (agentList[i].color == Color.Blue){
			operations.blueOp[blueOpCnt].from = prevPosList[i];
			operations.blueOp[blueOpCnt].to =nextPosList[i];
			operations.blueOp[blueOpCnt].type =typeList[i];
			++blueOpCnt;
		}
	}
	return Tuple!(Board ,"board", Operation[2],"redOp",Operation[2],"blueOp")(board,operations.redOp,operations.blueOp);
}

unittest{

}	

