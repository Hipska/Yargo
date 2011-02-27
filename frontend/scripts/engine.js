var target,myChar;
var myID;
var parameters = {};
var sprites = new Array();
var debug = (window.console && true);

myID = 's1';

function $(id){
	return document.getElementById(id);
}

window.onload = function(){
	myChar = $(myID);
	target = $('target');

	$('world').onclick = function(mouse){

		if(mouse.target.className == 'keepout') return;

		var x = mouse.clientX + window.scrollX - 15.5;
		var y = mouse.clientY + window.scrollY - 15.5;

		x = Math.round(x/16)*16;
		y = Math.round(y/16)*16;

		target.style.left	= (x+11) + 'px';
		target.style.top	= (y+11) + 'px';

		// find path..

		myChar.style.left	= x + 'px';
		myChar.style.top	= y + 'px';
	}

}