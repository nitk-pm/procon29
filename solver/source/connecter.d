module procon.connecter;
import vibe.d;
import vibe.http.websockets;
import std.json;
import procon.container;
import procon.search;
import procon.encoder;
import procon.decoder;
const serverURL = "ws://127.0.0.1:8080";

void connectFlow (int color,int turn){
	while (turn>0){
		auto ws = connectWebSocket(URL.parse(serverURL));
		while(ws.waitForData()){
			auto txt = ws.receiveText();
			auto json = parseJSON(txt);
			Board board=decode(json);
			auto opJson = search(color,turn,board);--turn;
			ws.send(opJson[0].toString);
			ws.send(opJson[1].toString);
		}
	}
}
