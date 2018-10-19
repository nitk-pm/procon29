import std.stdio,std.array,std.conv,std.getopt;
import procon.connecter;
import procon.container;

void main(string[] args){
	Color color;
	string str;
	getopt(args,
		std.getopt.config.required,
		"color|c",&str);
	switch(str){
		case "Red":color=Color.Red;break;
		case "Blue":color=Color.Blue;break;
		default :writeln("Invalid color input");
			 str.writeln;
			 assert(false);
	}

	connect(color);
}
