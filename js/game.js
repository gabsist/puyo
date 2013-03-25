
var field;
var puyo = [];
var current;

// メインループ
function mainLoop() {
	switch( scene ) {
	case SCENE_WAIT:

		break;
	case SCENE_GAME:
		// 固定
		if( current[0].isfix ) {
			var animation = false;
			$.each( puyo, function(i) {
				if( puyo[i].fixtimer > 0 || 
					(puyo[i].isvanish && puyo[i].vanishtimer > 0) ) {
					animation = true;
				}
			});
			
			// すべてのアニメーションが終了したら
			if( !animation ) {
				// 消去判定
				if( !vanish() ) {
					// あたらしいぷよ
					current[0] = new parePuyo();
				}
			}
		} else {
			// currentの回転
			if( keyQueue.z ) current[0].rotate( 1 );
			if( keyQueue.x ) current[0].rotate( -1 );
			
			// currentの自然落下
			current[0].nfall();
			
			// currentの移動
			if( keyQueue.l || keyQueue.r ) current[0].movetimer = 100;
			if( keyState.l ) current[0].move( -1 );
			else if( keyState.r ) current[0].move( 1 );
			
			// currentの下移動
			if( keyQueue.d ) current[0].flltimer = 100;
			if( keyState.d ) current[0].fall();
		}
			
		// 個別ぷよの移動
		for( i=0; ; i++ ) {
			if( !puyo[i] ) break;
			
			// 消滅
			if( puyo[i].isvanish && puyo[i].vanishtimer == 0 ) {
				puyo.splice(i, 1);
				i --;
			}
			// 移動
			else {
				puyo[i].move();
			}
		}
		break;
	}
	
	// 描画
	draw();
	
	keyQueue.reset();
}

function draw() {
	// クリア
	ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	
	switch( scene ) {
	case SCENE_WAIT:
		// フィールド描画
		showField();
		
		// 対戦相手募集中
		ctx.fillText("対戦者募集中...", 20, 50);
		break;
	case SCENE_GAME:
		// フィールド描画
		showField();
		
		// カレントぷよ描画
		if( !current[0].isfix ) current[0].draw();
	
		// 全ぷよ
		$.each( puyo, function(i) {
			puyo[i].draw();
		});
		break;
	}
}


function initGame() {
	// フィールド(6x13)
	field = new Array(2);
	$.each(field, function(i) { 
		field[i] = new Array(6);
		$.each(field[i], function(j) {
			field[i][j] = new Array(13);
			$.each(field[i][j], function(k) { field[i][j][k] = 0; });
		});
	});

	// 初期化
	current = [new parePuyo(), new parePuyo()];

	// シーン変更
	scene = SCENE_WAIT;

	// メインループ開始
	setInterval(mainLoop, 1000/FPS);
}

function showField() {
	
	// 背景ブロック
	for( v=0; v<2; v++ ) {
		for( x=0; x<6; x++ ) {
			for( y=0; y<12; y++ ) {
				var offsetx = v * (FIELD_WIDTH + CENTER_WIDTH);
				var offsety = TITLE_HEIGHT;
				var dx = offsetx + x*BLOCK_SIZE;
				var dy = offsety + (11-y)*BLOCK_SIZE;
				
				ctx.drawImage(img.block, dx, dy, BLOCK_SIZE, BLOCK_SIZE);
			}
		}
	}
}

function vanish() {
	var vlist = [];
	var f = new Array(6);
	$.each(f, function(i) {
		f[i] = new Array(13);
		$.each(f[i], function(j) {
			f[i][j] = field[0][i][j];
		});
	});
	
	var rec = function(f, p, t, list) {
		var x = p[0], y = p[1];
		
		// 盤外
		if( x < 0 || x > 5 || y < 0 || y > 12 ) return;
		
		// 同色チェック
		if( f[x][y] == t ) {
			list.push([x, y]);
			f[x][y] = 0;
			rec(f, [x+1, y], t, list);
			rec(f, [x-1, y], t, list);
			rec(f, [x, y+1], t, list);
			rec(f, [x, y-1], t, list);
		}
	};
	
	for( i=0; i<6; i++ ) {
		for( j=0; j<13; j++ ) {
			if( f[i][j] != 0 ) {
				var list = [];
				rec(f, [i,j], f[i][j], list);
				if( list.length >= 4 ) vlist.push(list);
			}
		}
	}
	
	$.each(vlist, function(i) {
		$.each(vlist[i], function(j) {
			var x = vlist[i][j][0], y = vlist[i][j][1];
			field[0][x][y] = 0;
			$.each(puyo, function(p) {
				if( puyo[p].fixedpos[0] == x && puyo[p].fixedpos[1] == y ) {
					puyo[p].isvanish = true;
				}
			});
		});
	});
	
	if( vlist.length == 0 ) return false;
	else return true;
}

//-----------------------------------------------
// オブジェクト
//-----------------------------------------------

// ペアぷよ
function parePuyo() {
	this.type = [Math.floor( Math.random()*4 )+1, Math.floor( Math.random()*4 )+1];
	this.rot = 2; // 0:↓ 1:← 2:↑ 3:→
	this.pos = [BLOCK_SIZE*2, -BLOCK_SIZE];
	this.isfix = false;
	this.fixcount = 0;
	
	// タイマー
	this.nfalltimer = 0;
	this.falltimer = 0;
	this.movetimer = 0;
	
	this.draw = function() {
		ctx.drawImage(
			img.puyo[this.type[0]-1],
			this.pos[0], this.pos[1] + TITLE_HEIGHT,
			BLOCK_SIZE, BLOCK_SIZE);
		ctx.drawImage(
			img.puyo[this.type[1]-1], 
			this.pos[0] + ((this.rot-2)%2)*BLOCK_SIZE, 
			this.pos[1] + ((1-this.rot)%2)*BLOCK_SIZE + TITLE_HEIGHT,
			BLOCK_SIZE, BLOCK_SIZE);
	};
	
	// 回転
	this.rotate = function(d) {
		// 回転してみる
		this.rot = (this.rot + d + 4) % 4;
		
		// 当たり判定
		if( this.collision() ) {
			switch( this.rot ) {
			case 0:
				this.pos[1] = Math.floor((this.pos[1]-BLOCK_SIZE/2)/BLOCK_SIZE)*BLOCK_SIZE;
				this.nfalltimer = 0;
				break;
			case 1:
			case 3:
				var sign = 2-this.rot;
			
				// 動かしてみる
				this.pos[0] += sign*BLOCK_SIZE;
				
				// 当たり判定
				if( this.collision() ) {
					// 戻してもう一回回転
					this.pos[0] -= sign*BLOCK_SIZE;
					this.rotate(d);
				}
				break;
			}
		}
	};
	
	// 自然落下
	this.nfall = function() {
		this.nfalltimer ++;
		if( this.nfalltimer > TIME_NFALL*FPS/1000 ) {
			this.fallput();
			this.nfalltimer = 0;
		}
	};
	
	// キーダウン落下
	this.fall = function() {
		this.falltimer ++;
		if( this.falltimer > TIME_FALL*FPS/1000 ) {
			this.fallput();
			this.falltimer = 0;
		}
	};
	
	// 接地＆接地判定
	this.fallput = function() {
		// とりあえず移動
		this.pos[1] += BLOCK_SIZE/2;
	
		// 接地した
		if( this.collision() ) {
			this.pos[1] -= BLOCK_SIZE/2;
			this.fix();
		}
	};
	
	// 固定
	this.fix = function() {
		this.fixcount ++;
		if( this.fixcount > FIXCOUNT ) {
			for( n=0; n<2; n++ ) {
				var y = this.getYIndex(n);
				var x = this.getXIndex(n);
				for( i=0; i<y.length; i++ ) {
					puyo.push(new puyoObject(this.type[n], [x, y[i]]));
				}
			}
			this.isfix = true;
		}
	};
	
	// 左右移動
	this.move = function(d) {
		this.movetimer ++;
		if( this.movetimer > TIME_MOVE*FPS/1000 ) {
			// とりあえず移動
			this.pos[0] += d * BLOCK_SIZE;
			
			// 当たり判定して戻す
			if( this.collision() ) {
				this.pos[0] -= d * BLOCK_SIZE;
			}
			this.movetimer = 0;
		}
	};
	
	// 当たり判定
	this.collision = function() {
		var col = false;
		
		// 当たり判定
		for( n=0; n<2; n++ ) {
			var y = this.getYIndex(n);
			var x = this.getXIndex(n);
			if( x < 0 || x > 5 || y[0] < 0 || y[1] < 0 ) col = true;
			else {
				for( i=0; i<y.length; i++ ) {
					if( field[0][x][y[i]] > 0 ) {
						col = true;
						break;
					}
				}
			}
		}
		
		return col;
	};
	
	this.getXIndex = function(n) {
		if( n == 0 ) {
			return (this.pos[0] / BLOCK_SIZE);
		} else {
			return (this.pos[0] / BLOCK_SIZE + ((this.rot-2)%2));
		}
	};
	this.getYIndex = function(n) {
		if( n == 0 ) {
			return [11-Math.floor(this.pos[1]/BLOCK_SIZE), 
					11-Math.floor((this.pos[1]+BLOCK_SIZE/2)/BLOCK_SIZE)];
		} else {
			return [11-(Math.floor(this.pos[1]/BLOCK_SIZE) + ((1-this.rot)%2)), 
					11-(Math.floor((this.pos[1]+BLOCK_SIZE/2)/BLOCK_SIZE) + ((1-this.rot)%2))];
		}
	};
}

// 個別ぷよ
function puyoObject(type, pos) {
	this.type = type;
	this.pos = [pos[0]*BLOCK_SIZE, (11-pos[1])*BLOCK_SIZE];
	this.spy = 0;
	this.isvanish = false;
	this.fixtimer = TIME_FIX*FPS/1000;
	this.vanishtimer = TIME_VANISH*FPS/1000;
	this.fixedpos = [pos[0], pos[1]];
	
	this.draw = function() {
		ctx.drawImage(
			img.puyo[this.type-1],
			this.pos[0], this.pos[1] + TITLE_HEIGHT,
			BLOCK_SIZE, BLOCK_SIZE);
	};

	this.move = function() {
		// 自然落下
		this.spy += GRAVITY;
		if( this.spy > MAXSPEED ) this.spy = MAXSPEED;
		this.pos[1] += this.spy;
		
		// 判定
		var x = this.getXIndex(), y = this.getYIndex();
		if( field[0][x][y] > 0 || y < 0) {
			// 戻す
			this.pos[1] = (11-y-1) * BLOCK_SIZE;
			this.spy = 0;
			
			// アニメーション
			this.fixtimer --;
			if( this.fixtimer > 0 ) {
				//
				// ふにょふにょ
				//
			} else {
				this.fixtimer = 0;
			}
			
			// フィールド書き換え
			field[0][x][y+1] = this.type;
			this.fixedpos[0] = x; this.fixedpos[1] = y+1;
		} else {
			// 落下したのでアニメーションカウント復活
			this.fixtimer = TIME_FIX*FPS/1000;
			
			// フィールド書き換え
			field[0][x][y+1] = 0;
		}
		
		// 消えるときのアニメーション
		if( this.isvanish ) {
			this.vanishtimer --;
			if( this.vanishtimer < 0 ) {
				
			} 
		}
	};
	
	this.getXIndex = function(n) {
		return (this.pos[0] / BLOCK_SIZE);
	};
	this.getYIndex = function(n) {
		return (11-Math.ceil(this.pos[1]/BLOCK_SIZE));
	};
}