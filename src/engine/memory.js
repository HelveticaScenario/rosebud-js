import {$width, $height} from './main.js';

const kb = 1024;
let _gfxAddr;
let _gfxSize;
let _mapAddr;
let _mapSize;
let _cartRomSize;
let _screenAddr;
let _screenSize;
let _ramSize;
let _baseRamArray;
let _cartRomArray;

let _memoryInited = false;
let _screenBuffer;

export function screenBuffer() {
	return _screenBuffer;
}

export function initMemory(override) {
	if (!_memoryInited || override) {
		_gfxAddr = 0;
		_gfxSize = 48*kb;
		_mapAddr = _gfxAddr + _gfxSize;
		_mapSize = 16*kb;
		_cartRomSize = _mapAddr + _mapSize;
		_screenAddr = _mapAddr + _mapSize;
		_screenSize = $width() * $height() * 3;
		_ramSize = _screenAddr + _screenSize;
		_baseRamArray = new Uint8Array(_ramSize);
		_screenBuffer = new Uint8Array(_baseRamArray.buffer, _screenAddr, _screenSize);
		_cartRomArray = new Uint8Array(_cartRomSize);
	}
	
}

export function gfxAddr() {
	return _gfxAddr;
}
export function gfxSize() {
	return _gfxSize;
}
export function mapAddr() {
	return _mapAddr;
}
export function mapSize() {
	return _mapSize;
}
export function cartRomSize() {
	return _cartRomSize;
}
export function screenAddr() {
	return _screenAddr;
}
export function screenSize() {
	return _screenSize;
}
export function ramSize() {
	return _ramSize;
}

export function peek(addr) {
  if (addr >= 0 && addr < _ramSize) {
    return _baseRamArray[Math.trunc(addr)];
  } else {
    throw new RangeError(`addr must meet the condition: 0 <= addr < ${_ramSize}, was ${addr}`);
  }
}

export function poke(addr, val) {
  if (addr >= 0 && addr < _ramSize) {
    _baseRamArray[Math.trunc(addr)] = Math.trunc(val);
  } else {
    throw new RangeError(`addr must meet the condition: 0 <= addr < ${_ramSize}, was ${addr}`);
  }
}

export function memcpy(dest_addr, source_addr, len) {
  dest_addr = Math.trunc(dest_addr);
  source_addr = Math.trunc(source_addr);
  len = Math.trunc(len);
  if (
    source_addr >= 0 && source_addr < _ramSize &&
    dest_addr >= 0 && dest_addr < _ramSize &&
    len >= 0 && len < _ramSize &&
    len <= (_ramSize)-source_addr
  ) {
    _baseRamArray.copyWithin(dest_addr, source_addr, source_addr + len);
  } else {
    throw new RangeError(`dest_addr, source_addr, len must meet the condition:
0 <= dest_addr < ${_ramSize},
0 <= source_addr < ${_ramSize},
0 <= len < ${_ramSize},
0 <= (len + source_addr) < ${_ramSize},
were ${dest_addr} ${source_addr} ${len}`);
  }
}

export function reload(dest_addr, source_addr, len) {
  dest_addr = Math.trunc(dest_addr);
  source_addr = Math.trunc(source_addr);
  len = Math.trunc(len);
  if (
    source_addr >= 0 && source_addr < _cartRomSize &&
    dest_addr >= 0 && dest_addr < _ramSize &&
    len >= 0 && len < _cartRomSize &&
    len <= (_cartRomSize)-source_addr &&
    len <= (_ramSize)-dest_addr
  ) {
    _baseRamArray.set(_cartRomArrayArray.subarray(source_addr, source_addr + len), dest_addr);
  } else {
    throw new RangeError(`dest_addr, source_addr, len must meet the condition:
0 <= dest_addr < ${_ramSize},
0 <= source_addr < ${_cartRomSize},
0 <= len < ${_cartRomSize},
0 <= (len + dest_addr) < ${_ramSize},
0 <= (len + source_addr) < ${_cartRomSize},
were ${dest_addr} ${source_addr} ${len}`);
  }
}

export function cstore(dest_addr, source_addr, len) {
  if (dest_addr === undefined && source_addr === undefined && len === undefined) {
    dest_addr = 0;
    source_addr = 0;
    len = _cartRomSize;
  } else {
    dest_addr = Math.trunc(dest_addr);
    source_addr = Math.trunc(source_addr);
    len = Math.trunc(len);
  }
  if (
    source_addr >= 0 && source_addr < _ramSize &&
    dest_addr >= 0 && dest_addr < _cartRomSize &&
    len >= 0 && len < _cartRomSize &&
    len <= (_cartRomSize)-dest_addr &&
    len <= (_ramSize)-source_addr
  ) {
    _cartRomArrayArray.set(_baseRamArray.subarray(source_addr, source_addr + len), dest_addr);
  } else {
    throw new RangeError(`dest_addr, source_addr, len must meet the condition:
0 <= dest_addr < ${_cartRomSize},
0 <= source_addr < ${_ramSize},
0 <= len < ${_cartRomSize},
0 <= (len + dest_addr) < ${_cartRomSize},
0 <= (len + source_addr) < ${_ramSize},
were ${dest_addr} ${source_addr} ${len}`);
  }
}

export function memset(dest_addr, val, len) {
  dest_addr = Math.trunc(dest_addr);
  val = Math.trunc(val);
  len = Math.trunc(len);
  if (
    dest_addr >= 0 && dest_addr < (_ramSize) &&
    len >= 0 && len < (_ramSize) &&
    len <= (_ramSize)-dest_addr
  ) {
    _baseRamArray.fill(val, dest_addr, dest_addr + len);
  } else {
    throw new RangeError(`dest_addr, val, len must meet the condition:
0 <= dest_addr < ${_ramSize},
0 <= len < ${_ramSize},
0 <= (len + dest_addr) < ${_ramSize},
were ${dest_addr} ${len}`);
  }
}
