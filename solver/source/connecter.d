module procon.connecter;

import std.stdio;
import vibe.d;
import vibe.http.websockets;
import std.json;
import procon.container;
import procon.greedySearch;
import procon.encoder;
import procon.decoder;
const serverURL = "ws://127.0.0.1:8080";
/*
JSONValue search(Color color,int turn,Board board){
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
*/
void connect (Color color,int turn){
	while (true){
		auto ws=connectWebSocket(URL.parse(serverURL));
		JSONValue req;
		req["type"]="req-board";
		ws.send(req.toString);
		while(ws.waitForData()){
			auto txt=ws.receiveText();
			//txt.writeln();
			auto json=parseJSON(txt);
			if (json["type"].toString=="\"distribute-board\""){
				Board board=decode(json["payload"]);
				auto opJson = search(color,turn,board);--turn;
				opJson.writeln();
				ws.send(opJson.toString);
			}
		}
	}
}
