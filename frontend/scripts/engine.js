var target,myChar;
var myID;
var scale;
var obstacles;
var pathfinding;
var sprites = {};
var debug = (window.console && true);

myID = 's1';
scale = $V(32,32);
obstacles = new VectorList();

/**
 * Find element in DOM tree by ID
 */
function $(id){
	return document.getElementById(id);
}

/**
 * Delete element in DOM tree by ID
 */
function d$(id){
	var node = $(id);
	node.parentNode.removeChild(node);
}

window.onload = function(){
	myChar = $(myID);
	target = $('target');

	// collect forbidden regions
	var obj, list = document.getElementsByClassName('keepout');
	var width, height, v;
	for(var i=0; i<list.length; i++){
		obj = list[i];

		width = obj.getBoundingClientRect().width;
		height = obj.getBoundingClientRect().height;

		v = Vector2D.Zero;
		do{
			v = v.addXY(obj.offsetLeft, obj.offsetTop);
		}while((obj = obj.offsetParent));

		if(debug) console.info('Keepout area:'+v+' w:'+width+' h:'+height);

		for(var x=0; x<width; x+=scale.X) for(var y=0; y<height; y+=scale.Y){
			obstacles.add( v.addXY(x,y), Infinity );
		}
	}

	// load current position
	myChar.pos = $V( myChar.offsetLeft, myChar.offsetTop );

	// start pathfinding
	pathfinding = new PathFinder(obstacles, scale);

	$('world').onclick = function(mouse){

		if(mouse.target.className == 'keepout') return;
		
		var destination = $V(
			mouse.clientX + window.scrollX - scale.X/2,
			mouse.clientY + window.scrollY - scale.Y/2
		).snapTo(scale);

		if(myChar.pos.equals(destination)) return;

		if(debug) console.log( 'Current:', myChar.pos );
		if(debug) console.log( 'Destination:', destination );

		// calculate path
		var path = pathfinding.calculate(myChar.pos, destination);
		
		// path found
		if(path){
			if(debug) console.log( 'Path: (steps)', path.length );

			target.style.left	= (destination.X+11) + 'px';
			target.style.top	= (destination.Y+11) + 'px';

			myChar.style.left	= destination.X + 'px';
			myChar.style.top	= destination.Y + 'px';
			myChar.pos = destination;
		}
	}
}

/**
 *
 */
function directPath(destination){
	var directPath = myChar.pos.subtract(destination);
	var nextPos = myChar.pos;
	var loop = 0;
	do{
		directPath.setModulus(directPath.Modulus-Math.min(scale.X, scale.Y));
		nextPos = destination.add(directPath).snapTo(scale);
		if(debug) createBreadcrumb(nextPos, 'green');
		loop++;
	}while(!nextPos.equals(destination) && loop < 1000);

	return nextPos.equals(destination);
}

function createBreadcrumb(pos, color){

	var breadcrumb = document.createElement('div');
	breadcrumb.id = 'bc'+Math.random();
	breadcrumb.style.left = pos.X + 'px';
	breadcrumb.style.top  = pos.Y + 'px';
	breadcrumb.className = 'nextPos';
	if(obstacles.contains(pos)) breadcrumb.style['background-color'] = 'red';
	else if(color) breadcrumb.style['background-color'] = color;

	$('world').appendChild(breadcrumb);

	setTimeout( function(){breadcrumb.parentNode.removeChild(breadcrumb)}, 2000 );
}