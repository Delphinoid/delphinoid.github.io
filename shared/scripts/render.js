{
	// I hate this.
	// For some reason background.js kept loading before
	// render.js no matter what I did, so I give up.
	var script = document.createElement("script");
	script.src = ROOT + "/shared/scripts/background.js";
	document.body.appendChild(script);
}

function r_update_page_dimensions(){
	// The height should be the total height of the
	// scrollable content. The width is the width of the window.
	// If we set the width to the scroll width, we end up in a
	// situation where the scroll width will never shrink when
	// we resize the window, meaning that making the window
	// smaller will leave a bunch of padding on the right.
	//
	// The "192" here is the combined height of the 64px header,
	// the 64px navigation bar and the 64px footer.
	width = window.innerWidth < 274.0 ? CONTENT_CONTAINER.offsetWidth : window.innerWidth;
	height = Math.max(window.innerHeight, 192.0+CONTENT_CONTAINER.offsetHeight);
}

function r_initialize(){
	r_update_page_dimensions();
	CANVAS.width  = width;
	CANVAS.height = height;
}

function r_update_and_render(){
	
	var i = 0;
	var particle_buffer_last_free = -1;
	var total_bytes = particle_buffer_length;
	
	while(i < total_bytes){
		
		const p = new Float32Array(particle_buffer, i, PARTICLE_PROPERTIES);
		
		if(particle_tick(p) == 0){
			if(particle_buffer_last_free < 0){
				particle_buffer_last_free = i;
			}
			particle_buffer_length -= PARTICLE_BYTES;
		}else{
			
			const x = p[PARTICLE_X_OFFSET]*width;
			const y = p[PARTICLE_Y_OFFSET]*height;
			const radius = p[PARTICLE_RADIUS_OFFSET]*width;
			
			var gradient = CONTEXT.createRadialGradient(x, y, 1.0, x, y, radius);
			gradient.addColorStop(0.0, "rgb(" + 255*p[PARTICLE_RED_OFFSET] + "," + 255*p[PARTICLE_GREEN_OFFSET] + "," + 255*p[PARTICLE_BLUE_OFFSET] + ")");
			gradient.addColorStop(1.0, "rgba(0,0,0,0)");
			CONTEXT.fillStyle = gradient;
			CONTEXT.fillRect(
				Math.max(0.0, x-radius), Math.max(0.0, y-radius),
				Math.min(x+radius, width), Math.min(y+radius, height)
			);
			
			/*
			// Rain particle.
			CONTEXT.beginPath();
			CONTEXT.moveTo(x, y);
			CONTEXT.lineTo(x, y-radius);
			CONTEXT.lineWidth = 1;
			CONTEXT.strokeStyle = "#777777";
			CONTEXT.stroke();
			*/
			
			if(particle_buffer_last_free >= 0){
				// Overwrite a dead particle.
				const free = new Float32Array(particle_buffer, particle_buffer_last_free, PARTICLE_PROPERTIES);
				free[PARTICLE_X_OFFSET] = p[PARTICLE_X_OFFSET];
				free[PARTICLE_Y_OFFSET] = p[PARTICLE_Y_OFFSET];
				free[PARTICLE_RADIUS_OFFSET] = p[PARTICLE_RADIUS_OFFSET];
				free[PARTICLE_RED_OFFSET] = p[PARTICLE_RED_OFFSET];
				free[PARTICLE_GREEN_OFFSET] = p[PARTICLE_GREEN_OFFSET];
				free[PARTICLE_BLUE_OFFSET] = p[PARTICLE_BLUE_OFFSET];
				particle_buffer_last_free += PARTICLE_BYTES;
			}
			
		}
		
		i += PARTICLE_BYTES;
		
	}
	
}

function r_clear(){
	r_update_page_dimensions();
	if(CANVAS.width != width || CANVAS.height != height){
		CANVAS.width  = width;
		CANVAS.height = height;
	}else{
		CONTEXT.clearRect(0, 0, width, height);
	}
}