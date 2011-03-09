var target,myChar;
var myID;
var scale;
var sprites = {}, obstacles = {};
var debug = (window.console && true);

myID = 's1';
scale = $V(32,32);

function $(id){
	return document.getElementById(id);
}

window.onload = function(){
	myChar = $(myID);
	target = $('target');

	var obj, list = document.getElementsByClassName('keepout');
	var width, height, v;
	for(var i=0; i<list.length; i++){
		obj = list[i];

		width = obj.getBoundingClientRect().width;
		height = obj.getBoundingClientRect().height;

		v = Vector2D.Zero;
		do{
			v = v.addXY(obj.offsetLeft, obj.offsetTop);
		}while(obj = obj.offsetParent);

		if(debug) console.info('Keepout area:',v,width,height);

		for(var x=0; x<width; x+=scale.X) for(var y=0; y<height; y+=scale.Y){
			obstacles[ v.addXY(x,y).toString() ] = Infinity;
		}
	}

	myChar.pos = $V( myChar.offsetLeft, myChar.offsetTop );

	$('world').onclick = function(mouse){

		if(mouse.target.className == 'keepout') return;
		
		var destination = $V(
			mouse.clientX + window.scrollX - scale.X/2,
			mouse.clientY + window.scrollY - scale.Y/2
		).snapTo(scale);

		var directPath = myChar.pos.subtract(destination);

		if(debug) console.log( 'Current: ' + myChar.pos );
		if(debug) console.log( 'Destination: ' + destination );
		if(debug) console.log( 'Path: ' + directPath.inspect() );

		startPathFinding(destination);

		target.style.left	= (destination.X+11) + 'px';
		target.style.top	= (destination.Y+11) + 'px';

		myChar.style.left	= destination.X + 'px';
		myChar.style.top	= destination.Y + 'px';
		myChar.pos = destination;
	}
}

/**
 *
 */
function startPathFinding(destination){
	var directPath = myChar.pos.subtract(destination);
	var nextPos = myChar.pos;
	do{
		directPath.setModulus(directPath.Modulus-(scale.Modulus/2));
		nextPos = destination.add(directPath).snapTo(scale);
		if(debug) console.log('NextPos: '+nextPos);
		if(debug){
			var breadcrumb = document.createElement('div');
			breadcrumb.style.left = nextPos.X + 'px';
			breadcrumb.style.top  = nextPos.Y + 'px';
			breadcrumb.className = 'nextPos';
			if(obstacles[nextPos.toString()]) breadcrumb.style['background-color'] = 'red';
			$('world').appendChild(breadcrumb);
		}
	}while(!nextPos.equals(destination));
}