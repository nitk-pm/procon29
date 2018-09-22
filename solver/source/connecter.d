module procon.connecter;

import std.stdio;
import vibe.d;
import vibe.http.websockets;
import std.json;
import procon.container;
import procon.search;
import procon.encoder;
import procon.decoder;
const serverURL = "ws://127.0.0.1:8080";

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
