// Color Cycling in HTML5 Canvas
// BlendShift Technology conceived, designed and coded by Joseph Huckaby
// Copyright (c) 2010 - 2024 Joseph Huckaby and PixlCore.
// MIT Licensed: https://github.com/jhuckaby/canvascycle/blob/main/LICENSE.md

FrameCount.visible = false;

function getRandomSceneIndex(currentSceneIndex, totalScenes) {
	let randomSceneIndex = Math.floor(Math.random() * totalScenes);

	while (randomSceneIndex === currentSceneIndex) {
		randomSceneIndex = Math.floor(Math.random() * totalScenes);
	}

	return randomSceneIndex;
}

const CanvasCycle = {
	ctx: null,
	imageData: null,
	clock: 0,
	inGame: false,
	bmp: null,
	globalTimeStart: new Date().getTime(),
	inited: false,
	optTween: null,
	winSize: null,
	globalBrightness: 1.0,
	lastBrightness: 0,
	sceneIdx: -1,
	highlightColor: -1,
	defaultMaxVolume: 0.5,
	transitionDuration: 150,

	settings: {
		targetFPS: 240,
		blendShiftEnabled: true,
		speedAdjust: 1.0,
	},

	contentSize: {
		width: 640,
		optionsWidth: 0,
		height: 480 + 40,
		scale: 1.0,
	},

	init: function () {
		// called when DOM is ready
		if (!this.inited) {
			this.inited = true;

			FrameCount.init();

			const initialSceneIdx = getRandomSceneIndex(-1, scenes.length);

			// start synced to local time
			const now = new Date();
			this.timeOffset =
				(now.getHours() + 1) * 3600 + now.getMinutes() * 60 + now.getSeconds();

			this.sceneIdx = initialSceneIdx;
			const scene = scenes[initialSceneIdx];
			this.loadImage(scene);

			setInterval(() => {
				this.randomScene();
			}, 120 * 1000);
		}
	},

	initPalettes: function (pals) {
		// create palette objects for each raw time-based palette
		const scene = scenes[this.sceneIdx];

		this.palettes = {};
		for (const key in pals) {
			const pal = pals[key];

			if (scene.remap) {
				for (const idx in scene.remap) {
					pal.colors[idx][0] = scene.remap[idx][0];
					pal.colors[idx][1] = scene.remap[idx][1];
					pal.colors[idx][2] = scene.remap[idx][2];
				}
			}

			const palette = (this.palettes[key] = new Palette(
				pal.colors,
				pal.cycles,
			));
			palette.copyColors(palette.baseColors, palette.colors);
		}
	},

	initTimeline: function (entries) {
		// create timeline with pointers to each palette
		this.timeline = {};
		for (const offset in entries) {
			const palette = this.palettes[entries[offset]];
			if (!palette)
				return console.error(
					`ERROR: Could not locate palette for timeline entry: ${entries[offset]}`,
				);
			this.timeline[offset] = palette;
		}
	},

	switchScene: function (sceneIdx) {
		this.hideOverlay();
		const scene = scenes[sceneIdx];
		TweenManager.removeAll({ category: "scenefade" });
		TweenManager.tween({
			target: {
				value: this.globalBrightness,
				newScene: scene,
			},
			duration: this.transitionDuration,
			mode: "EaseInOut",
			algo: "Quadratic",
			props: { value: 0.0 },
			onTweenUpdate: (tween) => {
				CanvasCycle.globalBrightness = tween.target.value;
			},
			onTweenComplete: (tween) => {
				CanvasCycle.loadImage(tween.target.newScene);
			},
			category: "scenefade",
		});
	},

	// Takes the whole scene rather than just its name: four names (V08, V19,
	// V25, V29) appear twice with different scripts, so name alone cannot
	// identify a scene. The old /api/scene?name= endpoint could only ever serve
	// one of each pair.
	loadImage: async function (scene, offsetX) {
		this.stop();

		const { name, title, month, scpt } = scene;
		const slug = `${name}-${month}-${scpt}`;

		// Served straight from public/. No API route, no network dependency on
		// effectgames.com, which no longer hosts these.
		const payload = await fetch(`./scenes/${slug}.json`);

		// All 19 slugs in scenes.js resolve to a file today, so this is purely
		// defensive. Without it a missing scene rejects `payload.json()`, and
		// neither caller (line 64, and the scenefade tween) awaits or catches
		// this function, so the failure surfaced only as an unhandled rejection.
		// The cycling is already stopped by `this.stop()` above, so bailing out
		// leaves the last frame on screen rather than a blank canvas.
		if (!payload.ok) {
			return console.error(
				`ERROR: Could not load scene ${slug}.json: ${payload.status}`,
			);
		}

		const parsed = await payload.json();

		const canvas = document.getElementById("mycanvas");
		if (canvas) {
			canvas.style = "transform: translateX(0);";
			if (offsetX) {
				canvas.style = `transform: translateX(${offsetX}px);`;
			}
		}

		const overlay = document.getElementById("living-worlds-scene-detail");
		if (overlay)
			overlay.innerHTML = `${title.replace(" - ", "<span> - </span>")} <span>[</span>${slug}.json<span>]</span>`;

		this.getAdvice();

		CanvasCycle.processImage(parsed);
	},

	processImage: function (img) {
		this.initPalettes(img.palettes);
		this.initTimeline(img.timeline);

		// force a full palette and pixel refresh for first frame
		this.oldTimeOffset = -1;

		// create an intermediate palette that will hold the time-of-day colors
		this.todPalette = new Palette(img.base.colors, img.base.cycles);

		// initialize, receive image data from server
		this.bmp = new Bitmap(img.base);
		this.bmp.optimize();

		// var canvas = $("mycanvas");
		const canvas = document.getElementById("mycanvas");
		if (!canvas.getContext) return; // no canvas support

		if (!this.ctx) this.ctx = canvas.getContext("2d");
		this.ctx.clearRect(0, 0, this.bmp.width, this.bmp.height);
		this.ctx.fillStyle = "rgb(0,0,0)";
		this.ctx.fillRect(0, 0, this.bmp.width, this.bmp.height);

		if (!this.imageData) {
			if (this.ctx.createImageData) {
				this.imageData = this.ctx.createImageData(
					this.bmp.width,
					this.bmp.height,
				);
			} else if (this.ctx.getImageData) {
				this.imageData = this.ctx.getImageData(
					0,
					0,
					this.bmp.width,
					this.bmp.height,
				);
			} else return; // no canvas data support
		}
		this.bmp.clear(this.imageData);

		if (ua.mobile) {
			// no transition on mobile devices
			this.globalBrightness = 1.0;
		} else {
			this.globalBrightness = 0.0;
			TweenManager.removeAll({ category: "scenefade" });
			TweenManager.tween({
				target: { value: 0 },
				duration: this.transitionDuration,
				mode: "EaseInOut",
				algo: "Quadratic",
				props: { value: 1.0 },
				onTweenUpdate: (tween) => {
					CanvasCycle.globalBrightness = tween.target.value;
				},
				category: "scenefade",
			});
		}

		this.run();
	},

	run: function () {
		// start main loop
		if (!this.inGame) {
			this.inGame = true;
			this.animate();
		}
	},

	stop: function () {
		this.inGame = false;
	},

	animate: function () {
		// animate one frame. and schedule next
		if (this.inGame) {
			let optimize = true;
			const newSec = FrameCount.count();

			if (newSec) {
				// advance time
				this.timeOffset++;
				if (this.timeOffset >= 86400) this.timeOffset = 0;
			}

			if (this.timeOffset !== this.oldTimeOffset) {
				// calculate time-of-day base colors
				this.setTimeOfDayPalette();
				optimize = false;
			}

			if (this.lastBrightness !== this.globalBrightness) optimize = false;
			if (this.highlightColor !== this.lastHighlightColor) optimize = false;

			this.bmp.palette.cycle(
				this.bmp.palette.baseColors,
				GetTickCount(),
				this.settings.speedAdjust,
				this.settings.blendShiftEnabled,
			);
			if (this.highlightColor > -1) {
				this.bmp.palette.colors[this.highlightColor] = new Color(255, 255, 255);
			}
			if (this.globalBrightness < 1.0) {
				// bmp.palette.fadeToColor( pureBlack, 1.0 - globalBrightness, 1.0 );
				this.bmp.palette.burnOut(1.0 - this.globalBrightness, 1.0);
			}
			this.bmp.render(this.imageData, optimize);
			this.ctx.putImageData(this.imageData, 0, 0);

			this.lastBrightness = this.globalBrightness;
			this.lastHighlightColor = this.highlightColor;
			this.oldTimeOffset = this.timeOffset;

			TweenManager.logic(this.clock);
			this.clock++;

			if (this.inGame)
				requestAnimationFrame(() => {
					CanvasCycle.animate();
				});
		}
	},

	setTimeOfDayPalette: function () {
		// fade palette to proper time-of-day

		// locate nearest timeline palette before, and after current time
		// auto-wrap to find nearest out-of-bounds events (i.e. tomorrow and yesterday)
		const before = {
			palette: null,
			dist: 86400,
			offset: 0,
		};
		for (const offset in this.timeline) {
			if (offset <= this.timeOffset && this.timeOffset - offset < before.dist) {
				before.dist = this.timeOffset - offset;
				before.palette = this.timeline[offset];
				before.offset = offset;
			}
		}
		if (!before.palette) {
			// no palette found, so wrap around and grab one with highest offset
			let temp = 0;
			for (const offset in this.timeline) {
				if (offset > temp) temp = offset;
			}
			before.palette = this.timeline[temp];
			before.offset = temp - 86400; // adjust timestamp for day before
		}

		const after = {
			palette: null,
			dist: 86400,
			offset: 0,
		};
		for (const offset in this.timeline) {
			if (offset >= this.timeOffset && offset - this.timeOffset < after.dist) {
				after.dist = offset - this.timeOffset;
				after.palette = this.timeline[offset];
				after.offset = offset;
			}
		}
		if (!after.palette) {
			// no palette found, so wrap around and grab one with lowest offset
			let temp = 86400;
			for (const offset in this.timeline) {
				if (offset < temp) temp = offset;
			}
			after.palette = this.timeline[temp];
			after.offset = temp + 86400; // adjust timestamp for day after
		}

		// copy the 'before' palette colors into our intermediate palette
		this.todPalette.copyColors(
			before.palette.baseColors,
			this.todPalette.colors,
		);

		// now, fade to the 'after' palette, but calculate the correct 'tween' time
		this.todPalette.fade(
			after.palette,
			this.timeOffset - before.offset,
			after.offset - before.offset,
		);

		// finally, copy the final colors back to the bitmap palette for cycling and rendering
		this.bmp.palette.importColors(this.todPalette.colors);
	},

	setRate: function (rate) {
		this.settings.targetFPS = rate;
	},

	setSpeed: function (speed) {
		this.settings.speedAdjust = speed;
	},

	setBlendShift: function (enabled) {
		this.settings.blendShiftEnabled = enabled;
	},

	randomScene: function () {
		const randomSceneIdx = getRandomSceneIndex(this.sceneIdx, scenes.length);
		this.sceneIdx = randomSceneIdx;
		this.switchScene(randomSceneIdx);
	},

	hideOverlay: () => {
		const overlay = document.getElementById("living-worlds-overlay");
		overlay.style =
			"animation-name: fade-out; animation-duration: 600ms; animation-iteration-count: 1; animation-fill-mode: forwards";
	},
	showOverlay: () => {
		const overlay = document.getElementById("living-worlds-overlay");
		if (overlay) {
			overlay.style =
				"animation-name: fade; animation-duration: 600ms; animation-iteration-count: 1;";
		}
	},
	getAdvice: async () => {
		const quoteElement = document.getElementById("living-worlds-quote");

		if (!quoteElement) {
			return;
		}

		// Advice Slip is a third party, and /api/advice answers 502 with
		// `{ error }` when it is unreachable. Reading `json.advice` unconditionally
		// put the string "undefined" on screen as the quote. A failure now leaves
		// whatever quote is already showing; on the first scene there is none, so
		// the element is hidden rather than rendering an empty pair of quote marks.
		try {
			const response = await fetch("/api/advice");

			if (!response.ok) {
				throw new Error(`/api/advice returned ${response.status}`);
			}

			const { advice } = await response.json();

			if (!advice) {
				throw new Error("/api/advice returned no advice");
			}

			quoteElement.textContent = advice;
		} catch (error) {
			console.error("ERROR: Could not load advice:", error);
		}

		quoteElement.style.display = quoteElement.textContent ? "" : "none";

		// Runs either way: the overlay also carries the scene detail, which is
		// still worth showing when the quote is missing.
		setTimeout(() => CanvasCycle.showOverlay(), 800);
	},
};

const CC = CanvasCycle;
