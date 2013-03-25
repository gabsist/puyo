// 定義
var ROOM_COUNT = 10;
var ROOM_VIEWER = 0, ROOM_MEMBER = 1;


var io = require('socket.io').listen(8080);

// 接続ユーザー( socketid: name )
var member = {};

// 部屋
var room = new Array(ROOM_COUNT);
for( i=0; i<ROOM_COUNT; i++ ) {
	room[i] = new roomManager(i);
}


// 接続
io.sockets.on('connection', function(socket) {
	console.log('connection!');
	
	// ログイン
	socket.on('login', function(data, fn) {
		console.log('Login request: ' + data.name + " , " + data.pass);
		
		var ret = {result: true, id: socket.id};

		// 返信
		fn(ret);
	});

	// ロビーに接続
	socket.on('lobby_enter', function(data, fn) {
		console.log('enter_lobby request: ' + data.name );

		// メンバーに追加
		member[socket.id] = data.name;

		// 返信
		fn(true);

		// ロビー情報を通知
		socket.emit('lobby_info', member);
	});

	// チャットメッセージ受信
	socket.on('sendMessage', function(data, fn) {
		console.log('sendMessage request: ' + data.id );

		if( member[data.id] ) {
			// ブロードキャスト
			console.log('broadcast receiveMessage');
			socket.emit('receiveMessage', { name: member[data.id], message: data.message });
			socket.broadcast.emit('receiveMessage', { name: member[data.id], message: data.message });
		}
	});

});


// 部屋管理
function roomManager(index) {
	var viewer = {}; // この部屋にいる人
	var member = {}; // 対戦者
	var number = index;

	var roomsocket = io.of('/room/'+ index).on('connection', function(socket){
		console.log('room['+number+'] connection!');

		// 部屋に接続
		socket.on('room_enter', function(data, fn) {
			console.log('room_enter request: room[' + number + '], ' + data.name );

			// 観戦か対戦か
			if( data.purpose == ROOM_MEMBER ) {
				// 対戦
				var n = Object.keys(member).length;
				if( n == 0 || n == 1) {
					member[socket.id] = data.name;
					fn( true );

					// 対戦開始
					if( n == 1 ) {
						console.log('Game Start!!!');
						for( var id in member ) {
							console.log(member[id]);
							if(id in roomsocket.sockets) {
								roomsocket.sockets[id].emit('gameStart', member);
							}
						}
					}
				} else {
					fn( false );
				}
			} else if( data.purpose == ROOM_VIEWER ) {
				// 観戦
				viewer[socket.id] = data.name;
				fn( true );
			} else {
				fn( false );
			}
		});

/*
		// ゲームを始めた旨の通知をbroadcast
		socket.on('game start', function(){
			console.log('started');
			socket.broadcast.emit('game start',{});
		});
		// ジャンプした通知をbroadcast
		socket.on('jump', function(data){
			console.log('jumped');
			socket.broadcast.emit('jump',{frame: data.frame, score: data.score, voltage: data.voltage});
		});
		// ゲームの状況をbroadcast
		socket.on('game info', function(data){
			socket.broadcast.emit('game info',{frame: data.frame, score: data.score, voltage: data.voltage});
		});
*/
	});
}

