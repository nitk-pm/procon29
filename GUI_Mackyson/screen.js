enchant();

function Square(point, status) {
    this.point = point;
    this.status = status;
}
var field =[];
window.onload = function () {
    for (var i = 0; i < 12; ++i) {
        var tmp = Array();
        for (var j = 0; j < 12; ++j) {
            tmp.push(new Square(0, 0));
        }
        field.push(tmp);
    }
    var screenWidth = 640;
    var screenHeight = 480;
    var FRAME_RATE = 30;
    var core = new Core(screenWidth, screenHeight);
    core.fps = FRAME_RATE;
    for (var i = 0; i < 12; ++i)
        for (var j = 0; j < 12; ++j) {
            var tmp1 = new Label();var tmp2 = new Label();
            tmp1.text = field[i][j].point;tmp2.text = field[i][j].status;
            tmp1.x = i * 32; tmp1.y = j * 32;tmp2.x = i * 32 + 20; tmp2.y = j * 32+20;
            core.rootScene.addChild(tmp1);core.rootScene.addChild(tmp2);
        }
    core.onload = function () {

    };
    core.start();
};
