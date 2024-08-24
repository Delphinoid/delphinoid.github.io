const PARTICLE_MAX = 100;
const PARTICLE_SPAWN_TIMER = 250.0;
const PARTICLE_AVERAGE_SPEED = 20.0*100.0*60.0;
const PARTICLE_BYTES = 24;

const PARTICLE_PROPERTIES = 6;
const PARTICLE_X_OFFSET = 0;
const PARTICLE_Y_OFFSET = 1;
const PARTICLE_RADIUS_OFFSET = 2;
const PARTICLE_RED_OFFSET = 3;
const PARTICLE_GREEN_OFFSET = 4;
const PARTICLE_BLUE_OFFSET = 5;

function particle_new(y){
	const p = new Float32Array(particle_buffer, particle_buffer_length, PARTICLE_PROPERTIES);
	p[PARTICLE_RED_OFFSET] = 0.5 - Math.random()*0.125;
	p[PARTICLE_GREEN_OFFSET] = 0.0;
	p[PARTICLE_BLUE_OFFSET] = 0.5 + Math.random()*0.125;
	p[PARTICLE_RADIUS_OFFSET] = (20.0+Math.random()*80.0)/1920.0;
	p[PARTICLE_X_OFFSET] = Math.random();
	p[PARTICLE_Y_OFFSET] = y-p[PARTICLE_RADIUS_OFFSET];
	particle_buffer_length += PARTICLE_BYTES;
}

function particle_tick(p, overwrite){
	p[PARTICLE_Y_OFFSET] += p[PARTICLE_RADIUS_OFFSET]*100.0*60.0*dt/height; //this.y += 50;
	if(p[PARTICLE_Y_OFFSET]*height-p[PARTICLE_RADIUS_OFFSET]*width > height){
		return 0;
	}
	return 1;
}