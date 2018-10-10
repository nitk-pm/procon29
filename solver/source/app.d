import std.stdio,std.array,std.conv;
import procon.connecter;
import procon.container;

void main(){
	writeln("\"YourColor(Red||Blue) GameTurn(integer)\"");
startInput:
	string[] input = split(readln());
	string colorStr = input[0];
	Color color;
	switch(colorStr){
		case "Red":color=Color.Red;break;
		case "Blue":color=Color.Blue;break;
		default:writeln("invalid input");goto startInput;
	}
	connect(color);
}
