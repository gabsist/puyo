var server = "http://192.168.11.8:";

var socket;

var loginInfo;
var room;

function networkInit() {
	// サーバーに接続
	socket = io.connect(server + '8080');
	
	// 通信開始
	socket.on('connect', function() {
		debug.println("connect to server.");

		// ロビー情報受取
		socket.on('lobby_info', function(data) {
			lobby.lobby_info(data);
		});

		// チャットメッセージ受信
		socket.on('receiveMessage', function(data) {
			lobby.receiveMessage(data);
		});

	});
}


// 部屋に入る
function enterRoom(roomid) {
	// 部屋に接続して入る
	room = new roomManager(roomid);
}

// ログイン
function Login(name, pass) {
	// 初期化
	networkInit();
	
	// ログイン処理
	loginInfo.name = name;
	loginInfo.pass = pass;
	socket.emit('login', {name: name, pass: pass}, function(ret) {
		if( ret.result ) {
			suc = NET_SUCCESS;
			loginInfo.id = ret.id;
			debug.println("login success. (id:"+ret.id+")");

			// ロビーに入る
			lobby.enter();
		} else {
			this.suc = NET_FAIL;
			debug.println("login fail.");
		}
	});
}


// ログイン情報
function loginManager() {
	this.name = "";
	this.pass = "";
	this.id = "";
	this.suc = 0;
}

// ロビー管理
function lobbyManager() {
	this.member = {};

	// ロビーに入る
	this.enter = function() {
		debug.println("lobby_enter send.");

		socket.emit('lobby_enter', {name: loginInfo.name}, function(suc) {
			if( suc ) {
				debug.println("lobby_enter success.");

				// DOMをロビーように
				setDOM(DOM_LOBBY);
			} else {
				debug.println("lobby_enter fail.");
			}
		});
	};

	// ロビー情報受取
	this.lobby_info = function(data) {
		debug.println("lobby_info received.");

		this.member = data;
		for( var id in this.member ) {
			debug.println(this.member[id]);
		}
	}

	// 発言
	this.sendMessage = function(mes) {
		debug.println("sendMessage send.");

		socket.emit('sendMessage', {id: loginInfo.id, message: mes});
	}

	// 発言受信
	this.receiveMessage = function(data) {
		debug.println("receiveMessage received.");

		// チャット表示
		var text = data.name + " > " + data.message + "\n" + $("textarea#chat").val();
		$("textarea#chat").val(text);
	}
}

// 部屋管理
function roomManager(index) {
	var number = index;
	var socket = io.connect(server + '8080/room/'+index);

	// 部屋に入る
	var enter = function(purpose) {
		debug.println("room_enter send. (room"+number+")");

		socket.emit('room_enter', {purpose: purpose, name: loginInfo.name}, function(suc) {
			if( suc ) {
				debug.println("room_enter success. (room"+number+")");

				// DOMを部屋に
				setDOM(DOM_ROOM);

				// ゲーム初期化
				initGame();
			} else {
				debug.println("room_enter fail. (room"+number+")");
			}
		});
	};

	socket.on('connect', function() {
		debug.println("connect to room.");

		// 入る
		enter(ROOM_MEMBER);
	});

	// ゲームスタート
	socket.on('gameStart', function(data) {
		debug.println("game start!");

		var me = "", op = "";
		for( var id in data ) {
			if( id == loginInfo.id ) me = data[id];
			else op = data[id];
		}
		debug.println(me + " vs " + op);
	});
}