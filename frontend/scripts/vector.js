
function Vector2D() {}

Vector2D.prototype = {
	precision: 1e-6,
	X:0,Y:0,Modulus:0,Angle:0,

	// Returns element i of the vector
	e: function(i) {
		switch(i){
			case 1: return this.X; break;
			case 2: return this.Y; break;
			case 3: return this.Modulus; break;
			case 4: return this.Angle; break;
			default: return null;
		}
	},

	// Sets the modulus ('length') of the vector
	setModulus: function(m) {
		this.Modulus = m;
		return this.calcXY();
	},

	// Sets the angle of the vector
	setAngle: function(a) {
		this.Angle = a;
		return this.calcXY();
	},

	// Sets the modulus and the angle of the vector
	setMA: function(m,a) {
		this.Modulus = m;
		this.Angle = a;
		return this.calcXY();
	},

	// Gets the modulus and the angle of the vector
	getMA: function() {
		return [this.Modulus,this.Angle];
	},

	// Sets the X value of the vector
	setX: function(x){
		this.X = x;
		return this.calcMA();
	},

	// Sets the Y value of the vector
	setY: function(y){
		this.Y = y;
		return this.calcMA();
	},

	// Sets the X and the Y value of the vector
	setXY: function(x,y){
		this.X = x;
		this.Y = y;
		return this.calcMA();
	},

	// Gets the X and the Y value of the vector
	getXY: function(){
		return [this.X,this.Y];
	},

	// Returns true if the vector is equal to the argument
	equals: function(v) {
		return Math.abs(this.X - v.X) < this.precision && Math.abs(this.Y - v.Y) < this.precision;
	},

	// Returns a copy of the vector
	copy: function() {
		return Vector2D.createXY(this.X,this.Y);
	},

	// Calls the iterator for each element of the vector in turn
	each: function(fn) {
		fn(this.X, 1);
		fn(this.Y, 2);
		fn(this.Modulus, 3);
		fn(this.Angle, 4);
	},

	// Returns a new vector created by normalizing the receiver
	toUnitVector: function() {
		return Vector2D.createMA(1,this.Angle);
	},

	// Returns the result of adding the argument to the vector
	add: function(v) {
		return Vector2D.createXY(this.X+v.X,this.Y+v.Y);
	},
	addXY: function(x,y) {
		return Vector2D.createXY(this.X+x,this.Y+y);
	},

	// Returns the result of subtracting the argument from the vector
	subtract: function(v) {
		return Vector2D.createXY(this.X-v.X,this.Y-v.Y);
	},

	// Returns the result of multiplying the elements of the vector by the argument
	multiply: function(k) {
		return Vector2D.createXY(this.X*k,this.Y*k);
	},

	x: function(k) { return this.multiply(k); },

	// Returns the scalar product of the vector with the argument
	dot: function(v) {
		return (this.X * v.X) + (this.Y * v.Y);
	},

	// Returns the vector product of the vector with the argument
	cross: function(v) {
		return Vector2D.createXY(this.X * v.X,this.Y * v.Y);
	},

	// Returns the (absolute) largest element of the vector
	max: function() {
		return (Math.abs(this.X) > Math.abs(this.Y))? Math.abs(this.X) : Math.abs(this.Y);
	},

	// Returns the (absolute) smallest element of the vector
	min: function() {
		return (Math.abs(this.X) < Math.abs(this.Y))? Math.abs(this.X) : Math.abs(this.Y);
	},

	// Returns the index of the first match found
	indexOf: function(x) {
		var i = 0;
		do{
			if(this.e(++i) == x) return i;
		}while(i<4);
		return null;
	},

	// Returns the result of rounding the elements of the vector
	roundXY: function() {
		return Vector2D.createXY(Math.round(this.X),Math.round(this.Y));
	},

	// Returns the result of rounding the modulus of the vector
	roundModulus: function() {
		return Vector2D.createMA(Math.round(this.Modulus),this.Angle);
	},

	// Returns a copy of the vector with elements set to the given value if they
	// differ from it by less than precision
	snapTo: function(snapTo) {
		var snapX = this.X % snapTo.X;
		var newX = this.X - snapX;
		var snapY = this.Y % snapTo.Y;
		var newY = this.Y - snapY;


		return Vector2D.createXY(
			(Math.abs(snapX) - (snapTo.X/2) > this.precision)? newX+snapTo.X : newX ,
			(Math.abs(snapY) - (snapTo.Y/2) > this.precision)? newY+snapTo.Y : newY
		);
	},

	// Returns a copy of the vector with elements set to the given value if they
	// differ from it by less than precision
	snapToXY: function(x,y) {
		var snapX = this.X % x;
		var newX = this.X - snapX;
		var snapY = this.Y % y;
		var newY = this.Y - snapY;


		return Vector2D.createXY(
			(Math.abs(snapX) - (x/2) > this.precision)? newX+x : newX ,
			(Math.abs(snapY) - (y/2) > this.precision)? newY+y : newY
		);
	},

	// Returns the vector's distance from the argument, when considered as a point in space
	distanceFrom: function(v) {
		return this.subtract(v).Modulus;
	},

	// Rotates the vector with given angle
	rotate: function(angle) {
		return Vector2D.createMA(this.Modulus,this.Angle+angle);
	},

	// Utility to make sure vectors are 3D, a zero z-component is added
/*	to3D: function() {
		return Vector3D.create(this.X,this.Y,0);
	}, /**/

	// Returns a string representation of the vector
	inspect: function() {
		return '[Vector2D] X:'+this.X + ' Y:'+this.Y + ' Modulus:'+this.Modulus + ' Angle:'+((this.Angle/Math.PI)*180)+'°';
	},

	toString: function() {
		return '{'+this.X + ','+this.Y+'}';
	},

	// Recalculates the X and Y value
	calcXY: function(){
		this.X = Math.cos(this.Angle) * this.Modulus;
		this.Y = Math.sin(this.Angle) * this.Modulus;
		return this;
	},

	// Recalculates the Modulus and angle
	calcMA: function(){
		this.Modulus = Math.sqrt(Math.pow(this.X,2)+Math.pow(this.Y,2));
		this.Angle = Math.atan2(this.Y,this.X);
		return this;
	}
};

// Construct with X and Y
Vector2D.createXY = function(x,y) {
	var V = new Vector2D();
	return V.setXY(x,y);
};

// Constructor with Modulus and Angle
Vector2D.createMA = function(modulus,angle){
	var V = new Vector2D();
	return V.setMA(modulus,angle);
};

// Default constructor function
Vector2D.create = Vector2D.createXY;

// unit vectors
Vector2D.Xaxis = Vector2D.createXY(1,0);
Vector2D.Yaxis = Vector2D.createXY(0,1);
Vector2D.Zero = Vector2D.createXY(0,0);
Vector2D.Ones = Vector2D.createXY(1, 1);

// Random vector
Vector2D.Random = function(v) {
	if(typeof v == 'undefined') v = Vector2D.Ones;
	var x = Math.random() * v.X;
	var y = Math.random() * v.Y;
	return Vector2D.createXY(x,y);
};

// Utility functions
var $V = Vector2D.create;

function VectorList(){ };
VectorList.prototype = {
	contains: function(vector){
		var index = vector.toString();
		if(this[index]) return this[index];
		else return false;
	},

	add: function(vector, value){
		var index = vector.toString();
		this[index] = value || vector;
	}
};