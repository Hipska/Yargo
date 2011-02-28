var target,myChar;
var myID;
var scale;
var obstacles = {};
var sprites = new Array();
var debug = (window.console && true);

myID = 's1';
scale = 32;

function $(id){
	return document.getElementById(id);
}

window.onload = function(){
	myChar = $(myID);
	target = $('target');

	var obj, list = document.getElementsByClassName('keepout');
	var width, height, top, left;
	for(var i=0; i<list.length; i++){
		obj = list[i];

		width = obj.getBoundingClientRect().width;
		height = obj.getBoundingClientRect().height;

		top = left = 0;
		do{
			top += obj.offsetTop;
			left += obj.offsetLeft;
		}while(obj = obj.offsetParent);

		if(debug) console.log(top,left);

		for(var x=0; x<width; x+=scale) for(var y=0; y<height; y+=scale){
			obstacles[ (left+x) +','+ (top+y) ] = Infinity;
		}
	}

	$('world').onclick = function(mouse){

		if(mouse.target.className == 'keepout') return;

		var x = mouse.clientX + window.scrollX - 15.5;
		var y = mouse.clientY + window.scrollY - 15.5;

		x = Math.round(x/scale)*scale;
		y = Math.round(y/scale)*scale;

		target.style.left	= (x+11) + 'px';
		target.style.top	= (y+11) + 'px';

		// process path..

		myChar.style.left	= x + 'px';
		myChar.style.top	= y + 'px';
	}

}