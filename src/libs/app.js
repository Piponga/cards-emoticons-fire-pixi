
import settings from '../settings';
import { Runner } from '@pixi/runner';
import '@pixi/math-extras';
import './math';
import isMobile from 'is-mobile';
import FPSCounter from "./fpsCounter";

let App = {

	app: null,
	appContainer: null,
	screens: [],
	stage: null,

	init: function () {

		this.app = new PIXI.Application({
			width: settings.width,
			height: settings.height,
			// backgroundColor: 0x1099bb,
			backgroundColor: 0x333333,
			resolution: window.devicePixelRatio || 1,
		});

		this.appContainer = document.getElementById('app');
		this.appContainer.appendChild(this.app.view);

		this.renderer = this.app.renderer;
		this.ticker = PIXI.Ticker.shared;
		this.stage = this.app.stage;

		this.renderer.plugins.interaction.moveWhenInside = true;

		this.aspectRatio = 1;

		this.fpsCounter = new FPSCounter();
		document.body.appendChild(this.fpsCounter.container);

		this.update = new Runner('update');
		// this.resize = new Runner('resize');

		this.addDomEvents();
		this.resizeHandle();
		fullscreenHandle();

		{
			// injection for gsap animation
			Object.defineProperty(PIXI.Container.prototype, 'scaleXY', {
				get: function() { return this.scale.x; },
				set: function(val) { this.scale.set(val); }
			});

			Object.defineProperty(PIXI.Container.prototype, 'scaleX', {
				get: function() { return this.scale.x; },
				set: function(val) { this.scale.x = val; }
			});
			Object.defineProperty(PIXI.Container.prototype, 'scaleY', {
				get: function() { return this.scale.y; },
				set: function(val) { this.scale.y = val; }
			});

			Object.defineProperty(PIXI.Container.prototype, 'skewX', {
				get: function() { return this.skew.x; },
				set: function(val) { this.skew.x = val; }
			});
			Object.defineProperty(PIXI.Container.prototype, 'skewY', {
				get: function() { return this.skew.y; },
				set: function(val) { this.skew.y = val; }
			});
		}
	},

	addDomEvents() {

		const onKeyDown = (e) => {
			// e.preventDefault();
			EE.emit('Game Key Down', e, e.code);
		};

		const onKeyUp = (e) => {
			// e.preventDefault();
			EE.emit('Game Key Up', e, e.code);
		};

		window.addEventListener('keydown', onKeyDown);
		window.addEventListener('keyup', onKeyUp);

		window.addEventListener('resize', this.resizeHandle.bind(this));
	},

	addScreen: function (screen) {

		this.removeScreen(screen);

		this.screens.push(screen);

		if (!this[screen.name]) this[screen.name] = screen;
		else console.error('screen name "' + screen.name + '" already exist');

		screen.create();
		screen.hide();

		return screen;
	},

	removeScreen: function (screen) {

		for (let i = 0; i < this.screens.length; i++) if (this.screens[i] === screen) {

			this.screens.splice(i, 1);
			break;
		}
	},

	addTicker: function () {

		this.ticker.add(this.updateHandle, this);
	},

	updateHandle: function (dt) {

		this.fpsCounter.begin();

		// EE.emit('update', dt);
		this.update.emit(dt);

		this.fpsCounter.end();
	},

	resizeHandle: function (e) {

		this.aspectRatio = window.innerWidth / window.innerHeight;

		this.isLandscape = this.aspectRatio >= 1;
		this.isPortrait = !this.isLandscape;

		const DEFAULT_WIDTH = this.isLandscape ? settings.width : settings.height;
		const DEFAULT_HEIGHT = this.isLandscape ? settings.height : settings.width;

		let resizeScale = (window.innerWidth / window.innerHeight) / (DEFAULT_WIDTH / DEFAULT_HEIGHT);
		let newWidth = resizeScale > 1 ? DEFAULT_WIDTH * resizeScale : DEFAULT_WIDTH;
		let newHeight = resizeScale < 1 ? DEFAULT_HEIGHT / resizeScale : DEFAULT_HEIGHT;

		this.renderer.resize(newWidth, newHeight);
		this.stage.position.set(newWidth / 2, newHeight / 2);

		App.isMobile = isMobile();

		EE.emit('resize', newWidth, newHeight);
		// this.resize.emit(newWidth, newHeight);
	}
};

export default App;

function fullscreenHandle() {

	if (!App.isMobile) return;

	let orientationType = screen.orientation.type;

	const enableFullscreen = () => {

		const elem = document.getElementsByTagName('body')[0];

		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.mozRequestFullScreen) {
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) {
			elem.webkitRequestFullscreen();
		} else if (elem.msRequestFullscreen) {
			elem.msRequestFullscreen();
		}

		screen.orientation.lock(orientationType);

		document.body.removeEventListener('click', enableFullscreen, true);
		document.body.removeEventListener('touchend', enableFullscreen, true);
	}

	const addFullscreenEvent = () => {
		document.body.addEventListener('click', enableFullscreen, true);
		document.body.addEventListener('touchend', enableFullscreen, true);
	}

	addEventListener('fullscreenchange', (event) => {
		if (!document.fullscreenElement) addFullscreenEvent();
	});

	const orientationHandle = () => {
		screen.orientation.unlock();
		orientationType = screen.orientation.type;
	}
	screen.orientation.addEventListener('change', orientationHandle, true);

	orientationHandle();
	addFullscreenEvent();
}
