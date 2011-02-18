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

		var x = mouse.clientX + window.scrollX;
		var y = mouse.clientY + window.scrollY;

		myChar.style.left	= x + 'px';
		myChar.style.top	= y + 'px';
	}

}