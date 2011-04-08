
function PathFinder(obstacles, scale){
	this.openList = new Array();
	this.openListSize = 100;

	this.closedList = obstacles || new VectorList();

	this.scale = scale || Vector2D.Ones;

	this.iterations = 0;
}

PathFinder.prototype = {
	calculate: function(start,goal){

		this.start = new Path(start);
		this.goal = goal;

		this.openList = new Array();
		this.addToOpenList(this.start);

		this.iterations = 0;

		while(this.openList.length > 0){

			++this.iterations;

			var nextState = this.openList.shift();

			if(nextState.path.position.equals(this.goal)){
				var route = new Array();

				do {
					route.push(nextState.path.position);
				} while(nextState = nextState.path.parent);

				route.reverse();

				return route;

			}else
				this.expand(nextState.path);
		}

		return null;
	},

	expand: function(path){

		// calculate the neighbour positions of current position
		var neighbours = [
			path.addStep($V(path.position.X, path.position.Y - this.scale.Y)),	// up
			path.addStep($V(path.position.X + this.scale.X, path.position.Y)),	// right
			path.addStep($V(path.position.X, path.position.Y + this.scale.Y)),	// down
			path.addStep($V(path.position.X - this.scale.X, path.position.Y))	// left
		];

		// add new possible positions to openList
		for(var i = 0; i < 4; ++i)
			if(neighbours[i].position.X >= 0 && neighbours[i].position.Y >= 0 ) // && !this.closedList.contains(neighbours[i].position))
				this.addToOpenList(neighbours[i]);
	},

	addToOpenList: function(path){

		var i = 0;
		var state = {};

		if(debug) createBreadcrumb(path.position);

		if(this.closedList.contains(path.position))
			return;

		state.value = path.cost + this.goal.distanceFrom(path.position);
		state.path = path;

		while(i < this.openList.length) {

			if(this.openList[i].value > state.value)
				break;

			++i;
		}

		if(i < this.openListSize)
			this.openList.splice(i, -1, state);
	}
}

function Path(position, cost, parent){
	
	this.position = position || null;

	this.cost = cost || 0;

	this.parent = parent || null;
}

Path.prototype = {
	addStep: function(position){
		return new Path(position, this.cost + this.position.distanceFrom(position), this);
	}
}