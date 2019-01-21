import {
	mouseX,
	mouseY,
	_onMouseMove,
	_onMouseDown,
	_onMouseUp,
	mouseBtn,
	_onKeyDown,
	_onKeyUp,
	isXInScreen,
	isYInScreen
} from './input.js';

import {
	cls,
	circ,
	pset,
	line,
	rectfill,
	_getColor,
	pget
} from './graphics.js';

import {
	initMemory,
	screenBuffer
} from './memory.js';

import {
	getRandomNumber
} from './utils.js';

let noop = function(){};

export function start(config) {
	let init = config.init || noop;
	let update = config.update || noop;
	let draw = config.draw || noop;
	let screen = $screen(config.canvas);
	let debugging = $debugging(config.debugging, config.debuggingStyles);
	
	attachEventHandlers(screen);

	let width = $width();
	let height = $height();

	let scene = $scene();
	let camera = $camera();

	let renderer = $renderer();
	renderer.setSize( 512, 512, false );

	let stats = $stats();
	initMemory();
	
	var texture = $texture();
	texture.needsUpdate = true;

	var material = $material();
	var sprite = $sprite();
	scene.add( sprite );

	let lastUpdate = ( performance || Date ).now();
	let lastDraw = ( performance || Date ).now();
	function render() {
		requestAnimationFrame( render );
		if (debugging === true) {
			stats.begin();
		}
		
		let newUpdate = ( performance || Date ).now();
		update(newUpdate - lastUpdate);
		lastUpdate = newUpdate;

		let newDraw = ( performance || Date ).now();
		draw(newDraw - lastDraw);
		lastDraw = newDraw;

		flip();

		if (debugging === true) {
			stats.end();
		}
	}
	init();
	render();
}

function attachEventHandlers(screen) {
	window.addEventListener('mousemove', _onMouseMove)
	screen.addEventListener('mousedown', _onMouseDown);
	window.addEventListener('mouseup', _onMouseUp);
	screen.addEventListener('contextmenu', function (ev) {
		ev.preventDefault();
		ev.stopImmediatePropagation();
	})
	window.addEventListener('keydown', _onKeyDown);
	window.addEventListener('keyup', _onKeyUp);
}

let _screen;
export function $screen(screen) {
	if (screen) {
		if (typeof screen === "string") {
			_screen = document.getElementById(screen);
		} else {
			_screen = screen;
		}
	} else if (!_screen) {
		_screen = document.createElement('canvas');
		document.body.appendChild( _screen );
	}
	_screen.classList.add("screen");
	return _screen;
}

let _debugging = false;
export function $debugging(debugging, debuggingStyles) {
	if (debuggingStyles === true) {
		require('./debugging.css');
	}
	if (debugging === true || debugging === false) {
		_debugging = debugging;
	}
	return _debugging;
}

let _width = 128;
export function $width(width) {
	if (width != null) {
		_width = width;
	}
	return _width;
}

let _height = 128;
export function $height(height) {
	if (height != null) {
		_height = height;
	}
	return _height;
}

let _scene;
export function $scene(scene) {
	if (scene != null) {
		_scene = scene;
	} else if (!_scene) {
		_scene = new THREE.Scene();
	}
	return _scene;
}

let _camera;
export function $camera(camera) {
	if (camera != null) {
		_camera = camera;
	} else if (!_camera) {
		_camera = new THREE.OrthographicCamera( $width() / - 2, $width() / 2, $height() / 2, $height() / - 2, 1, 1000 );
		_camera.position.z = 1;
	}
	return _camera;
}

let _renderer;
export function $renderer(renderer) {
	if (renderer != null) {
		_renderer = renderer;
	} else if (!_renderer) {
		_renderer = new THREE.WebGLRenderer({
			canvas: $screen()
		});
	}
	return _renderer;
}

let _stats;
export function $stats(stats) {
	if (stats != null) {
		_stats = stats;
	} else if (!_stats) {
		_stats = new Stats();
		_stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
		_stats.domElement.classList.add("stats");
		document.body.appendChild( _stats.domElement );
	}
	return _stats;
}

let _texture;
export function $texture(texture) {
	if (texture != null) {
		_texture = texture;
	} else if (!_texture) {
		_texture = new THREE.DataTexture( 
			screenBuffer(),
			$width(),
			$height(),
			THREE.RGBFormat,
			THREE.UnsignedByteType
		);
	}
	return _texture;
}

let _material;
export function $material(material) {
	if (material != null) {
		_material = material;
	} else if (!_material) {
		_material = new THREE.SpriteMaterial({ map: $texture() });
	}
	return _material;
}

let _sprite;
export function $sprite(sprite) {
	if (sprite != null) {
		_sprite = sprite;
	} else if (!_sprite) {
		_sprite = new THREE.Sprite($material());
		_sprite.scale.set($width(),$height(),1.0);
	}
	return _sprite;
}

export function flip() {
	$renderer().render( $scene(), $camera() );
}
