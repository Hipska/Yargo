
function PathFinder(obstacles, scale){
	this.openList = new Array();
	this.openListSize = 50;

	this.closedList = obstacles || new VectorList();

	this.scale = scale || Vector2D.Ones;

	this.iterations = 0;
}

PathFinder.prototype = {
	calculate: function(start,goal){

		this.start = new Path(start);
		this.goal = goal;

		this.openList = new Array();
		this.expand(this.start);

		this.iterations = 0;

		while(this.openList.length > 0){

			++this.iterations;

			var path = this.openList.shift();

			if(path.lastStep().equals(this.goal)){

				path.steps.shift();

				if(debug) path.steps.forEach( function(position){createBreadcrumb(position,'green');} );
				return path.steps;

			}else this.expand(path);
			
		}

		return null;
	},

	expand: function(path){

		// calculate the neighbour positions of current position
		var neighbours = [
			path.expand( -this.scale.X, -this.scale.Y),	// up-left
			path.expand( -this.scale.X,  this.scale.Y),	// down-left
			path.expand(  this.scale.X,  this.scale.Y),	// down-right
			path.expand(  this.scale.X, -this.scale.Y),	// up-right

			path.expand( 0, -this.scale.Y ),	// up
			path.expand( this.scale.X, 0 ),	// right
			path.expand( 0, this.scale.Y ),	// down
			path.expand( -this.scale.X, 0 )	// left
		];

		// add new possible positions to openList
		for(var i = 0; i < 8; ++i){
			var position = neighbours[i].lastStep();
			if(position.X >= 0 && position.Y >= 0 && !path.stepsHash.contains(position)){
				neighbours[i].cost = neighbours[i].stepCost + position.distanceFrom(this.goal);
				this.addToOpenList(neighbours[i]);
			}
		}
	},

	addToOpenList: function(path){

		var i = 0;

		if(debug) createBreadcrumb(path.lastStep(), 'orange');

		if(this.closedList.contains(path.lastStep()))
			return;

		while(i < this.openList.length) {

			if(this.openList[i].cost > path.cost)
				break;

			++i;
		}

		if(i < this.openListSize)
			this.openList.splice(i, -1, path);
	}
}

function Path(position, cost){

	this.steps = new Array();
	this.stepsHash = new VectorList();

	this.stepCost = cost || 0;
	this.cost = Infinity;

	if(position) this.addStep(position);
}

Path.prototype = {
	expand: function(x,y){
		var newPath = this.clone();
		var lastStep = this.lastStep();
		var newStep = lastStep.addXY(x,y);
		newPath.addStep(newStep, lastStep.distanceFrom(newStep));
		return newPath;
	},

	addStep: function(position, stepCost){
		if(stepCost) this.stepsCost += stepCost;

		this.steps.push(position);
		this.stepsHash.add(position);
	},

	lastStep: function(){
		return this.steps[this.steps.length-1];
	},

	clone: function(){
		var clone = new Path();

		// copy variables
		clone.stepsCost = this.stepCost;
		clone.steps = this.steps.slice();

		// re-build hash
		clone.steps.forEach(function(pos){clone.stepsHash.add(pos);});

		return clone;
	}
}