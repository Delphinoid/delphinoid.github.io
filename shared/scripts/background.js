const CONTENT_CONTAINER = document.getElementById("content_container");
const CANVAS = document.getElementById("canvas");
const CONTEXT = CANVAS.getContext("2d");

const tickrate = 60.0;
const dt = 1.0/tickrate;
const tick_ms = 1000.0*dt;

var width, height;
var particle_array = [];

background();

function background(){
	background_update_page_dimensions();
	background_initialize();
	background_update_and_render();
	setInterval(background_update_and_render, tick_ms);
	setInterval(background_generate_particle, PARTICLE_SPAWN_TIMER); //setInterval(generate_sprite, 10.0);
}

function background_update_page_dimensions(){
	// The height should be the total height of the
	// scrollable content. The width is the width of the window.
	// If we set the width to the scroll width, we end up in a
	// situation where the scroll width will never shrink when
	// we resize the window, meaning that making the window
	// smaller will leave a bunch of padding on the right.
	//
	// The "192" here is the combined height of the 64px header,
	// the 64px navigation bar and the 64px footer.
	width = window.innerWidth;
	height = Math.max(window.innerHeight, 192.0+CONTENT_CONTAINER.offsetHeight);
}

function background_initialize(){
	
	// Particle lifespan in ms. We multiply by the height twice since
	// PARTICLE_AVERAGE_SPEED is lacking a division by the height.
	const lifespan = height*height*1000.0/PARTICLE_AVERAGE_SPEED;
	// Number of spawn intervals that pass before a particle dies.
	// This is the number of particles that can be on-screen at once.
	const total = Math.min(PARTICLE_MAX, Math.ceil(lifespan/PARTICLE_SPAWN_TIMER));
	const y_offset = height/total;
	var i = total;
	var y = 0.0;
	
	while(i > 0){
		--i;
		particle_array.push(new_particle(i*y_offset/height));
	}
	
}

function background_generate_particle(){
	if(document.hasFocus()){
		if(particle_array.length < PARTICLE_MAX){
			particle_array.push(new_particle(0.0));
		}
	}
}

function background_update_and_render(){
	
	if(document.hasFocus()){
		
		var i = 0;
		
		// Clear the canvas.
		background_update_page_dimensions();
		if(CANVAS.width != width || CANVAS.height != height){
			CANVAS.width  = width;
			CANVAS.height = height;
		}else{
			CONTEXT.clearRect(0, 0, width, height);
		}
		
		while(i < particle_array.length){
			if(particle_array[i].update() == 0){
				particle_array.splice(i, 1);
			}else{
				particle_array[i].render();
				++i;
			}
		}
		
	}
	
}