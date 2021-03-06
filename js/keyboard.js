
var keyQueue = new keyList();
var keyState = new keyList();


$('html').keydown( function(e) {
	keyActivate( e.which, true );
});

$('html').keyup( function(e) {
	keyActivate( e.which, false );
});

function keyActivate(code, act) {
	switch( code ) {
		case 37: // left
			if( !keyState.l ) keyQueue.l |= act;
			keyState.l = act;
		break;
		case 38: // up
			if( !keyState.u ) keyQueue.u |= act;
			keyState.u = act;
		break;
		case 39: // right
			if( !keyState.r ) keyQueue.r |= act;
			keyState.r = act;
		break;
		case 40: // down
			if( !keyState.d ) keyQueue.d |= act;
			keyState.d = act;
		break;
		case 90: // z
			if( !keyState.z ) keyQueue.z |= act;
			keyState.z = act;
		break;
		case 88: // x
			if( !keyState.x ) keyQueue.x |= act;
			keyState.x = act;
		break;
	}
}

function keyList() {
	this.z = false;
	this.x = false;
	this.u = false;
	this.d = false;
	this.l = false;
	this.r = false;
	
	this.reset = function() {
		this.z = false;
		this.x = false;
		this.u = false;
		this.d = false;
		this.l = false;
		this.r = false;
	};
}