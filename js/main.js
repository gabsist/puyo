
var scene;
var lobby;
var ctx;
var img;

function init() {
	// debug
	if( debugMode ) debugInit();
	
	// DOM要素の初期化
	if( !initDOM() ) {
		alert("DOMの初期化に失敗");
		return;
	}
	setDOM(DOM_TITLE);
	
	// 画像の初期化
	img = new imageList();
	
	// シーン
	scene = SCENE_TITLE;

	// ロビーマネージャー初期化
	lobby = new lobbyManager();
	// ログイン情報初期化
	loginInfo = new loginManager();
}

function initDOM() {
	// スクリーン
	$("<div id='screen'>").appendTo("body");
	$("div#screen").css({
		backgroundColor:"#FFDAB9", 
		padding: "0px",
		margin: "0px",
		width:SCREEN_WIDTH+"px", height:SCREEN_HEIGHT+"px"
	});
		
	// キャンバス
	$("<canvas width='"+SCREEN_WIDTH+"' height='"+SCREEN_HEIGHT+"'>").appendTo("div#screen");
	
	// canvas要素のチェック
	var canvas = $("canvas")[0];
	if( !canvas || !canvas.getContext ) {
		return false;
	}
	
	ctx = canvas.getContext('2d');

	// ログイン画面
	$("<div id='loginform'>").appendTo("div#screen");
	$("div#loginform").css({
		backgroundColor:"#eee", 
		padding: "0px",
		margin: "0px",
		textAlign: "center",
		position: "absolute",
		left: SCREEN_WIDTH/4+"px", top: SCREEN_HEIGHT/4+"px",
		width:SCREEN_WIDTH/2+"px", height:SCREEN_HEIGHT/2+"px"
	});
	$("<input type='text' id='username' value='username!'>").appendTo("div#loginform");
	$("input#username").css({
		backgroundColor:"#FFF", 
		width:"80px", height:"20px"
	});
	$("<input type='text' id='password' value='password!'>").appendTo("div#loginform");
	$("input#password").css({
		backgroundColor:"#FFF", 
		width:"80px", height:"20px"
	});
	$("<input type='button' id='login' value='ログイン'>").appendTo("div#loginform");
	$("input#login").css({
		backgroundColor:"#FFF", 
		width:"60px", height:"20px"
	});
	$("input#login").click( function() {
		Login($("input#username").val(), $("input#password").val());
	});

	// ロビー
	$("<div id='lobby'>").appendTo("div#screen");
	$("div#lobby").css({
		backgroundColor:"#6496ED", 
		padding: "0px",
		margin: "0px",
		width: "100%", height: "100%"
	});
	// 部屋ボタン作成
	for( i=0; i<ROOM_COUNT; i++ ) {
		$("<div id='"+i+"'>").appendTo("div#lobby");
		$("div#"+i).css({
			backgroundColor:"#90EE90", 
			padding: "0px",
			margin: "0px",
			position: "absolute",
			left: "20px",
			top: (20+i*40)+"px",
			width: "120px", height: "30px"
		});
		$("div#"+i).text("Room"+i+": ");

		$("div#"+i).click( function() {
			enterRoom(this.id);
		});
	}
	$("<input type='text' id='chatinput'>").appendTo("div#lobby");
	$("input#chatinput").css({
		backgroundColor:"#FFF", 
		position: "absolute",
		top: SCREEN_HEIGHT-120 + "px",
		width: SCREEN_WIDTH+"px", height: "20px"
	});
	$("input#chatinput").keydown( function(event) {
		if (event.keyCode === 13) {
			lobby.sendMessage($("input#chatinput").val());
		}
	});
	$("<textarea id='chat'>").appendTo("div#lobby");
	$("textarea#chat").css({
		backgroundColor:"#FFF",
		position: "absolute",
		top: SCREEN_HEIGHT-100 + "px",
		width: SCREEN_WIDTH+"px", height: "100px"
	});

	return true;
}

function setDOM(s) {
	switch( s ) {
		case DOM_TITLE:
		$("canvas").hide();
		$("div#loginform").show();
		$("div#lobby").hide();
		break;

		case DOM_LOBBY:
		$("canvas").hide();
		$("div#loginform").hide();
		$("div#lobby").show();
		break;

		case DOM_ROOM:
		$("canvas").show();
		$("div#loginform").hide();
		$("div#lobby").hide();
		break;
	}
}


function imageList() {
	this.puyo = null;
	this.block = null;
	
	this.initialize = function() {
		var createImage = function(path) {
			var i = new Image();
			i.src = path;
			return i;
		};
		
		// ぷよ画像
		this.puyo = new Array(4);
		for(i=0; i<4; i++) this.puyo[i] = createImage("./image/puyo"+i+".png");
		
		// 背景ブロック
		this.block = createImage("./image/block.png");
	};
	
	this.initialize();
}
