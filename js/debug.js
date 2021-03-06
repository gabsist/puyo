
var debugMode = true;
var debug = new debugObject();

// デバッグ要素
function debugInit() {
	if( debugMode ) {
		$("<div id='debug'>").appendTo("body");
		$("div#debug").css({
			backgroundColor:"#eee", 
			float:"right",
			width:"300px", height:"300px"});
		
		$("<textarea style='width:100%; height:100%;'>").appendTo("div#debug");
		
		debug.show();
	}
}

function outputField() {
	for(i=0; i<12; i++) {
		for(j=0; j<6; j++) {
			debug.print(field[0][j][11-i]+", ");
		}
		debug.println("");
	}
}

function debugObject() {
	this.log = "Initialize\n";
	
	this.show = function() {
		$("div#debug > textarea").val(this.log);
	};
	
	this.println = function(str) {
		this.log += str + "\n";
		this.show();
	};
	
	this.print = function(str) {
		this.log += str;
		this.show();
	};
	
	this.clear = function() {
		this.log = "";
		this.show();
	};
}