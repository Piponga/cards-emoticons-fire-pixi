
import BuildMixin from './screen.build';
import App from "./app";

export default class Screen extends PIXI.Container {

	constructor() {
		super();

		this.active = false;

		this.containers = [];
		this.events = {};
	}

	create() {

		this.beforeBuilt();

		this.buildContainers(this, this.containers, this);

		App.stage.addChild(this);

		this.buildEvents(this.events, this);

		this.built();
	}

	// ///////////////////////////////////////////////////////////////////////////////////////
	beforeBuilt() {}

	built() {}

	shown() {}

	hidden() {}

	update() {}

	resize() {}

	// ///////////////////////////////////////////////////////////////////////////////////////
	show() {

		this.active = true;
		this.visible = true;

		App.update.add(this);
		// App.resize.add(this);
		// EE.on('update', this.update, this);
		EE.on('resize', this.resizeContainers, this);

		this.resizeContainers();
		this.shown();
	}

	hide() {

		this.active = false;
		this.visible = false;

		App.update.remove(this);
		// App.resize.remove(this);
		// EE.off('update', this.update, this);
		EE.off('resize', this.resizeContainers, this);

		this.hidden();
	}

	resizeContainers() {

		this.applyContainersTransforms(this.children);

		this.resize();
	}
}

Object.assign(Screen.prototype, BuildMixin);
