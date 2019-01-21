import {start} from './engine/main.js';
import {init, update, draw} from './game/main.js';

window.rosebud = {
	start(canvas) {
		start({
			canvas,
			debuggingStyles: true,
			debugging: true,
			init,
			update,
			draw,
		});
	}
};
