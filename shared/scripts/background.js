const CONTENT_CONTAINER = document.getElementById("content_container");

const tickrate = 60.0;
const dt = 1.0/tickrate;
const tick_ms = 1000.0*dt;

var width, height;
var particle_buffer = new ArrayBuffer(PARTICLE_MAX*PARTICLE_BYTES);
var particle_buffer_length = 0;

background();

function background(){
	r_initialize();
	background_initialize();
	background_update_and_render();
	setInterval(background_update_and_render, tick_ms);
	setInterval(background_generate_particle, PARTICLE_SPAWN_TIMER); //setInterval(generate_sprite, 10.0);
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
		particle_new(i*y_offset/height);
	}
	
}

function background_generate_particle(){
	if(document.hasFocus()){
		if(particle_buffer_length < PARTICLE_MAX*PARTICLE_BYTES){
			particle_new(0.0);
		}
	}
}

function background_update_and_render(){
	if(document.hasFocus()){
		// Clear the canvas and render.
		r_clear();
		r_update_and_render();
	}
}