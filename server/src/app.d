import std.stdio;
import vibe.http.router;
import vibe.http.websockets;
import vibe.d;

shared static this () {
	auto router = new URLRouter;
	router.get("/", handleWebSockets(&handleConn));

	auto settings = new HTTPServerSettings;
	settings.port = 8080;
	settings.bindAddresses = ["::1", "127.0.0.1"];
	listenHTTP(settings, router);
}

void handleConn(scope WebSocket sock) {
	while (sock.connected) {
		auto msg = sock.receiveText();
		sock.send(msg);
	}
}

