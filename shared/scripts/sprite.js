const PARTICLE_MAX = 100;
const PARTICLE_SPAWN_TIMER = 250.0;
const PARTICLE_AVERAGE_SPEED = 20.0*100.0*60.0;

function particle(_x, _y, _colour, _radius){
	this.x = _x;
	this.y = _y;
	this.colour = _colour;
	this.radius = _radius;
}

function new_particle(y){
	const r = 128 - Math.floor(Math.random()*32.0);
	const g = 0;
	const b = 128 + Math.floor(Math.random()*32.0);
	const radius = (20.0+Math.random()*80.0)/1920.0;
	return new particle(Math.random(), y-radius, "rgb("+r+","+g+","+b+")", radius);
}

particle.prototype.update = function(){
	this.y += this.radius*100.0*60.0*dt/height; //this.y += 50;
	if(this.y*height-this.radius*width > height){
		return 0;
	}
	return 1;
}

particle.prototype.render = function(){
	
	// Scale particles based on window size.
	const x = this.x*width;
	const y = this.y*height;
	const radius = this.radius*width;
	
	var gradient = CONTEXT.createRadialGradient(x, y, 1.0, x, y, radius);
	gradient.addColorStop(0.0, this.colour);
	gradient.addColorStop(1.0, "rgba(0,0,0,0)");
	CONTEXT.fillStyle = gradient;
	CONTEXT.fillRect(
		Math.max(0.0, x-radius), Math.max(0.0, y-radius),
		Math.min(x+radius, width), Math.min(y+radius, height)
	);
	
	/*
	// Rain particle.
	CONTEXT.beginPath();
	CONTEXT.moveTo(this.x, this.y);
	CONTEXT.lineTo(this.x, this.y-this.radius);
	CONTEXT.lineWidth = 1;
	CONTEXT.strokeStyle = "#777777";
	CONTEXT.stroke();
	*/
	
}