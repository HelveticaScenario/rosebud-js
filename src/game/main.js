import {$width, $height} from '../engine/main.js';
// import {} from '../engine/memory.js';
import {pset, cls, defaultPalette} from '../engine/graphics.js';
import {getRandomNumber} from '../engine/utils.js';

let palette;
let width = 0;
let height = 0;
export function init() {
	palette = defaultPalette();
	width = $width();
	height = $height();
	console.log('init!');
}
let toggle = false;
export function draw(delta) {
	cls();
	// for (let x = 0; x < width; x++) {
	// 	for (let y = 0; y < height; y++) {
	// 		pset(x,y,palette[getRandomNumber(16)])
	// 	}
	// }
	if (toggle) {
		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				pset(x,y,0, x, y);
			}
		}
	} else {
		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				pset(x,y,0, y, x);
			}
		}
	}
	toggle = !toggle;
}

export function update(delta) {

}

