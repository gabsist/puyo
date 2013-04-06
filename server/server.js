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
	initRoom(room[i]);
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

	// 部屋情報の要求
	socket.on('room_info_require', function(data, fn) {
		console.log('room_info_require request');

		for( i=0; i<ROOM_COUNT; i++ ) {
			socket.emit('room_info', {number: i, member: room[i].member});
		}
		fn(true);
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
	this.viewer = {}; // この部屋にいる人
	this.member = {}; // 対戦者
	this.number = index;
	this.roomsocket = io.of('/room/'+ index);
}

function initRoom(room) {
	room.roomsocket.on('connection', function(socket){
		console.log('room['+room.number+'] connection!');

		// 部屋に接続
		socket.on('room_enter', function(data, fn) {
			console.log('room_enter request: room[' + room.number + '], ' + data.name );

			// 観戦か対戦か
			if( data.purpose == ROOM_MEMBER ) {
				// 対戦
				var n = Object.keys(room.member).length;
				if( n == 0 || n == 1) {
					room.member[socket.id] = data.name;
					fn( true );

					// 部屋にいる人をブロードキャスト
					io.sockets.emit('room_info', {number: room.number, member: room.member});

					// 対戦開始
					if( n == 1 ) {
						console.log('Game Start!!!');
						// 乱数用意
						var seed = Math.floor(Math.random()*10000000);
						for( var id in room.member ) {
							console.log(room.member[id]);
							if(id in room.roomsocket.sockets) {
								room.roomsocket.sockets[id].emit(
									'gameStart',
									{seed: seed, member: room.member} );
							}
						}
					}
				} else {
					fn( false );
				}
			} else if( data.purpose == ROOM_VIEWER ) {
				// 観戦
				room.viewer[socket.id] = data.name;
				fn( true );
			} else {
				fn( false );
			}
		});

		// カレントぷよの情報を受けとった
		socket.on('game_current_info_send', function(data) {
			// 敵にじょうほうを送る
			var opid = data.opponent.id;

			if( opid in room.roomsocket.sockets ) {
				room.roomsocket.sockets[opid].emit(
					'game_current_info_receive',
					data);
			}
		});
	});
};