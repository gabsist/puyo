
//
// 定義
//


//-----------------------------------------------
// 大きさ系
//-----------------------------------------------

// ブロックの大きさ
var BLOCK_SIZE = 32;

// フィールドの大きさ
var FIELD_WIDTH = BLOCK_SIZE * 6;
var FIELD_HEIGHT = BLOCK_SIZE * 12;

// 中央の仕切りの幅
var CENTER_WIDTH = 200;
	
// スクリーンの大きさ
var SCREEN_WIDTH = FIELD_WIDTH * 2 + CENTER_WIDTH;
var SCREEN_HEIGHT = FIELD_HEIGHT + 100;

// パディング
var PADDING = 10;

// おじゃまぷよ表示領域
var TITLE_HEIGHT = 72;


//-----------------------------------------------
// シーン
//-----------------------------------------------
var SCENE_TITLE = 0,
	SCENE_LOBBY = 1,
	SCENE_WAIT = 4;
	SCENE_GAME = 5;

var DOM_TITLE = 0,
	DOM_LOBBY = 3,
	DOM_ROOM = 5;

//-----------------------------------------------
// 時間系設定
//-----------------------------------------------

// ぷよの落下
var TIME_NFALL = 300; // 自然落下
var TIME_FALL = 18; // キーダウン
var TIME_FREEFALL = 30; // ちぎれ落下速度

// ぷよの移動インターバル
var TIME_MOVE = 80;

// ぷよ固定の時間
var TIME_FIX = 120;
var FIXCOUNT = 4;	// 固定までの猶予

// ぷよの消滅時間
var TIME_VANISH = 300;

// ぷよにかかる重力と、最高スピード
var GRAVITY = 2;
var MAXSPEED = 10;


//-----------------------------------------------
// ネットワーク系
//-----------------------------------------------

var NET_SUCCESS = 1;
var NET_FAIL = -1;

// 部屋の数
var ROOM_COUNT = 10;

// 部屋に接続する目的
var ROOM_VIEWER = 0, 
	ROOM_MEMBER = 1;


//-----------------------------------------------
// その他
//-----------------------------------------------

// FPS
var FPS = 60;

/*

// ぷよの落下
var TIME_NFALL = 1000; // 自然落下
var TIME_FALL = 50; // キーダウン

// ぷよの移動インターバル
var TIME_MOVE = 160;

// ぷよ固定の時間
var TIME_FIX = 160;
var FIXCOUNT = 4;	// 固定までの猶予

// ぷよの消滅時間
var TIME_VANISH = 500;

// ぷよにかかる重力と、最高スピード
var GRAVITY = 1;
var MAXSPEED = 5;
*/