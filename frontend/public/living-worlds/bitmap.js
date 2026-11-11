// 8-bit Bitmap for use in HTML5 Canvas
// Copyright (c) 2010 - 2024 Joseph Huckaby and PixlCore.
// MIT Licensed: https://github.com/jhuckaby/canvascycle/blob/main/LICENSE.md

Class.create("Bitmap", {
	width: 0,
	height: 0,
	pixels: null,
	palette: null,
	drawCount: 0,
	optPixels: null,
	optColors: null,

	__construct: function (img) {
		// class constructor
		this.width = img.width;
		this.height = img.height;
		this.palette = new Palette(img.colors, img.cycles);
		this.pixels = img.pixels;
	},

	animatedColors: function () {
		// 256-entry map of which palette indices belong to an animated cycle
		var optColors = [];
		for (var idx = 0; idx < 256; idx++) optColors[idx] = 0;

		// mark animated colors in palette
		var cycles = this.palette.cycles;
		for (var idx = 0, len = cycles.length; idx < len; idx++) {
			var cycle = cycles[idx];
			if (cycle.rate) {
				// cycle is animated
				for (var idy = cycle.low; idy <= cycle.high; idy++) {
					optColors[idy] = 1;
				}
			}
		}

		return optColors;
	},

	setCycles: function (cycles) {
		// Swap in a different set of animated ranges. Each time-of-day palette
		// carries its own cycles, and they are not decoration: 175 of the 239
		// palettes across the 19 scenes differ from their scene's base, and three
		// scenes (V05AM October, both V25 July) have no usable base cycle at all,
		// so they rendered as still images all day while their palettes defined
		// real ranges.
		//
		// Copied rather than aliased: Palette.cycle writes cycleAmount onto each
		// Cycle, which would reach back into the stored time-of-day palette.
		var copy = [];
		for (var idx = 0, len = cycles.length; idx < len; idx++) {
			var cycle = cycles[idx];
			copy.push(new Cycle(cycle.rate, cycle.reverse, cycle.low, cycle.high));
		}
		this.palette.cycles = copy;
		this.palette.numCycles = copy.length;

		// optimize() is a 307,200-pixel prepass, so only redo it when the set of
		// animated indices actually moved. Rate and direction changes alone leave
		// the same pixels animated and need no rescan.
		if (!this.optColors) return this.optimize();

		var next = this.animatedColors();
		for (var idx = 0; idx < 256; idx++) {
			if (next[idx] !== this.optColors[idx]) return this.optimize();
		}
	},

	optimize: function () {
		// prepare bitmap for optimized rendering (only refresh pixels that changed)
		var optColors = (this.optColors = this.animatedColors());

		// create array of pixel offsets which are animated
		var optPixels = (this.optPixels = []);
		var pixels = this.pixels;
		var j = 0;
		var i = 0;
		var x, y;
		var xmax = this.width,
			ymax = this.height;

		for (y = 0; y < ymax; y++) {
			for (x = 0; x < xmax; x++) {
				if (optColors[pixels[j]]) optPixels[i++] = j;
				j++;
			} // x loop
		} // y loop
	},

	clear: function (imageData) {
		// clear all pixels to white
		const data = imageData.data;
		let i = 0;
		const xmax = this.width;
		const ymax = this.height;

		for (y = 0; y < ymax; y++) {
			for (x = 0; x < xmax; x++) {
				data[i + 0] = 255; // red
				data[i + 1] = 255; // green
				data[i + 2] = 255; // blue
				data[i + 3] = 255; // alpha
				i += 4;
			}
		}
	},

	render: function (imageData, optimize) {
		// render pixels into canvas imageData object
		var colors = this.palette.getRawTransformedColors();
		var data = imageData.data;
		var pixels = this.pixels;

		if (optimize && this.drawCount && this.optPixels) {
			// only redraw pixels that are part of animated cycles
			var optPixels = this.optPixels;
			var i, j, clr;

			for (var idx = 0, len = optPixels.length; idx < len; idx++) {
				j = optPixels[idx];
				clr = colors[pixels[j]];
				i = j * 4;
				data[i + 0] = clr[0]; // red
				data[i + 1] = clr[1]; // green
				data[i + 2] = clr[2]; // blue
				data[i + 3] = 255; // alpha
			}
		} else {
			// draw every single pixel
			var i = 0;
			var j = 0;
			var x, y, clr;
			var xmax = this.width,
				ymax = this.height;

			for (y = 0; y < ymax; y++) {
				for (x = 0; x < xmax; x++) {
					clr = colors[pixels[j]];
					data[i + 0] = clr[0]; // red
					data[i + 1] = clr[1]; // green
					data[i + 2] = clr[2]; // blue
					data[i + 3] = 255; // alpha
					i += 4;
					j++;
				}
			}
		}

		this.drawCount++;
	},
});
