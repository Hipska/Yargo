// load Vector library
importScripts('../vector.js');

var path;
var speed = .08; // value represents number of pixels per ms
var timer;
var currentPos;

onmessage = function(evt){
	// load data
	currentPos = $V(evt.data.X, evt.data.Y);
	// speed = evt.data.speed;

	// next messages are to add steps to the path
	onmessage = addSteps;
}

function addSteps(evt){
	path = evt.data;
	if(!timer) nextStep();
}

function nextStep(){
	var step = {duration:Infinity,position:currentPos};

	// check if the end of the path is reached
	if(path.length == 0){

		// clear the timer
		clearTimeout(timer);
		timer = null;

		// send to parent thread to display this step
		postMessage(step);

	// proceed to next step
	}else{

		// get the first position from the path
		var pos = path.shift();
		step.position = $V(pos.X, pos.Y);

		// calculate duration..
		step.duration = currentPos.distanceFrom(step.position)/speed;

		// send to parent thread to display this step
		postMessage(step);

		// proceed to the next step after this step has completed
		timer = setTimeout(nextStep, step.duration);

		// save current position for next step
		currentPos = step.position;
	}
}