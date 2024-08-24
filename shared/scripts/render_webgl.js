//const PARTICLE_VAO = CONTEXT.createVertexArrayOES();
const PARTICLE_VBO = CONTEXT.createBuffer();
const PARTICLE_IBO = CONTEXT.createBuffer();
const PARTICLE_SBO = CONTEXT.createBuffer();
const VERTEX_SHADER = CONTEXT.createShader(CONTEXT.VERTEX_SHADER);
const FRAGMENT_SHADER = CONTEXT.createShader(CONTEXT.FRAGMENT_SHADER);
const SHADER_PROGRAM = CONTEXT.createProgram();
var VIEWPORT_UNIFORM;

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
	// The "274" here is the minimum page width.
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
	CONTEXT.viewport(0, 0, width, height);
	
	CONTEXT.clearColor(0.0, 0.0, 0.0, 0.0);
	CONTEXT.disable(CONTEXT.DEPTH_TEST);
	CONTEXT.enable(CONTEXT.BLEND);
	CONTEXT.blendFunc(CONTEXT.SRC_ALPHA, CONTEXT.ONE_MINUS_SRC_ALPHA);
	
	{
		
		// Compile and attach the vertex shader.
		// All of these shaders use a pretty old version of GLSL!
		//
		// We want to be able to scale the quad by multiplying
		// its vertices by (radius/width, radius/height).
		// However, note that GL clip space coordinates range
		// from -1 to 1 rather than 0 to 1. In other words, one
		// unit in the x-axis is >half< the screen width, and
		// similarly for the height. To compensate, we multiply
		// the vertex offsets by 2.0.
		CONTEXT.shaderSource(VERTEX_SHADER,
		"precision mediump float; \
		uniform vec2 viewport; \
		attribute vec2 vertex; \
		attribute vec2 position; \
		attribute float radius; \
		attribute vec3 colour; \
		varying vec2 uv; \
		varying vec3 f_colour; \
		void main(void){ \
			uv = vec2(vertex.x, -vertex.y); \
			f_colour = colour; \
			gl_Position = vec4( \
				-1.0 + 2.0*(position.x + radius*vertex.x), \
				1.0 - 2.0*(position.y + viewport[0]*radius*vertex.y/viewport[1]), \
			0.0, 1.0); \
		}"); //
		CONTEXT.compileShader(VERTEX_SHADER);
		CONTEXT.attachShader(SHADER_PROGRAM, VERTEX_SHADER);
		
		// Compile and attach the fragment shader.
		// You have no idea how long it took to get the
		// radial gradient to match "createRadialGradient".
		CONTEXT.shaderSource(FRAGMENT_SHADER,
		"precision mediump float; \
		varying vec2 uv; \
		varying vec3 f_colour; \
		void main(void){ \
			float alpha = 1.0-length(uv.xy); \
			if(alpha <= 0.0){ \
				discard; \
			} \
			gl_FragColor = vec4(f_colour, alpha*alpha); \
		}");
		CONTEXT.compileShader(FRAGMENT_SHADER);
		CONTEXT.attachShader(SHADER_PROGRAM, FRAGMENT_SHADER);
		
	}
	
	{
		
		const vertices = new Float32Array([1.0,1.0, -1.0,1.0, -1.0,-1.0, 1.0,-1.0]);
		const indices = new Uint16Array([0,1,2,0,2,3]);
		
		// Bind the particle vertex array object.
		// All following calls to bindBuffer and vertexAttribPointer
		// will berecorded to this vertex array object.
		// Actually, since we're never rebinding, there's no point
		// in using VAOs.
		//VAO_EXTENSION.bindVertexArrayOES(PARTICLE_VAO);
		
		// Set up the particle vertex buffer object and upload its vertex data.
		CONTEXT.bindBuffer(CONTEXT.ARRAY_BUFFER, PARTICLE_VBO);
		CONTEXT.bufferData(CONTEXT.ARRAY_BUFFER, vertices, CONTEXT.STATIC_DRAW);
		CONTEXT.enableVertexAttribArray(0);
		CONTEXT.vertexAttribPointer(0, 2, CONTEXT.FLOAT, false, 0, 0);
		CONTEXT.bindAttribLocation(SHADER_PROGRAM, 0, "vertex");
		
		// Set up the particle index buffer object and upload its index data.
		CONTEXT.bindBuffer(CONTEXT.ELEMENT_ARRAY_BUFFER, PARTICLE_IBO);
		CONTEXT.bufferData(CONTEXT.ELEMENT_ARRAY_BUFFER, indices, CONTEXT.STATIC_DRAW);
		
		// Set up the particle state buffer object.
		CONTEXT.bindBuffer(CONTEXT.ARRAY_BUFFER, PARTICLE_SBO);
		CONTEXT.bufferData(CONTEXT.ARRAY_BUFFER, PARTICLE_MAX*PARTICLE_BYTES, CONTEXT.DYNAMIC_DRAW);
		CONTEXT.enableVertexAttribArray(1);
		CONTEXT.vertexAttribPointer(1, 2, CONTEXT.FLOAT, false, PARTICLE_BYTES, 0);
		INSTANCING_EXTENSION.vertexAttribDivisorANGLE(1, 1);
		CONTEXT.bindAttribLocation(SHADER_PROGRAM, 1, "position");
		CONTEXT.enableVertexAttribArray(2);
		CONTEXT.vertexAttribPointer(2, 1, CONTEXT.FLOAT, false, PARTICLE_BYTES, 8);
		INSTANCING_EXTENSION.vertexAttribDivisorANGLE(2, 1);
		CONTEXT.bindAttribLocation(SHADER_PROGRAM, 2, "radius");
		CONTEXT.enableVertexAttribArray(3);
		CONTEXT.vertexAttribPointer(3, 3, CONTEXT.FLOAT, false, PARTICLE_BYTES, 12);
		CONTEXT.bindAttribLocation(SHADER_PROGRAM, 3, "colour");
		INSTANCING_EXTENSION.vertexAttribDivisorANGLE(3, 1);
		
	}
	
	// Link the shader program.
	CONTEXT.linkProgram(SHADER_PROGRAM);
	CONTEXT.useProgram(SHADER_PROGRAM);
	
	// Set up uniform variables.
	VIEWPORT_UNIFORM = CONTEXT.getUniformLocation(SHADER_PROGRAM, "viewport");
	CONTEXT.uniform2f(VIEWPORT_UNIFORM, width, height);
	
}

function r_update_and_render(){
	
	var instances = 0;
	
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
			if(particle_buffer_last_free >= 0){
				// Overwrite a dead particle.
				const dead = new Float32Array(particle_buffer, particle_buffer_last_free, PARTICLE_PROPERTIES);
				dead[PARTICLE_X_OFFSET] = p[PARTICLE_X_OFFSET];
				dead[PARTICLE_Y_OFFSET] = p[PARTICLE_Y_OFFSET];
				dead[PARTICLE_RADIUS_OFFSET] = p[PARTICLE_RADIUS_OFFSET];
				dead[PARTICLE_RED_OFFSET] = p[PARTICLE_RED_OFFSET];
				dead[PARTICLE_GREEN_OFFSET] = p[PARTICLE_GREEN_OFFSET];
				dead[PARTICLE_BLUE_OFFSET] = p[PARTICLE_BLUE_OFFSET];
				particle_buffer_last_free += PARTICLE_BYTES;
			}
			++instances;
		}
		i += PARTICLE_BYTES;
	}
	
	// Upload the particles' states to the shader.
	// Note that PARTICLE_SBO is already bound!!
	CONTEXT.bufferSubData(CONTEXT.ARRAY_BUFFER, 0, particle_buffer);
	INSTANCING_EXTENSION.drawElementsInstancedANGLE(CONTEXT.TRIANGLES, 6, CONTEXT.UNSIGNED_SHORT, 0, instances);
	
}

function r_clear(){
	r_update_page_dimensions();
	//CONTEXT.clear(CONTEXT.COLOR_BUFFER_BIT);
	if(CANVAS.width != width || CANVAS.height != height){
		CANVAS.width  = width;
		CANVAS.height = height;
		CONTEXT.viewport(0, 0, width, height);
		CONTEXT.uniform2f(VIEWPORT_UNIFORM, width, height);
	}
}