
export default {

	buildContainers(parent, containers = [], screen) {

		if (!containers.length) return;

		for (let i = 0; i < containers.length; i++) {

			let params = containers[i];
			let name = params.name;

			let obj = this.buildChild.call(this, parent, params);

			if (obj) {

				if (screen) screen[name] = obj;

				if (params.hasOwnProperty('children')) {

					this.buildContainers(obj, params.children, screen);
				}
			}
		}
	},

	buildChild(parent, params) {

		let type = params.type || 'container';
		let result = null;

		if (type === 'container') {

			result = new PIXI.Container();

		}
		else if (type === 'sprite') {

			result = new PIXI.Sprite(this.getTexture(params.image));

		}
		else if (type === 'text') {

			result = new PIXI.Text(params.text, params.styles);

		}

		if (result) {

			result.params = params;

			if (result.anchor) result.anchor.set(0.5);

			if (parent) parent.addChild(result);

			this.applyTransforms(result, result.params);

			if (params.event || params.button) this.addInteraction(result, (params.event || params.button), this);
		}

		return result;
	},

	// /////////////////////////////////////////////////////////////////////////////// EVENTS
	buildEvents(events, screen) {

		for (let key in events) {

			EE.on(key, events[key], screen);
		}
	},

	addInteraction(obj, event, screen) {

		obj.buttonMode = !!(obj.hasOwnProperty('params') ? obj.params.button : true);
		obj.interactive = true;

		obj.on('pointerdown', (e) => {
			EE.emit(screen.name + ' ' + event + ' Down', obj, e);
		});
		obj.on('pointerup', (e) => {
			EE.emit(screen.name + ' ' + event + ' Up', obj, e);
		});
		obj.on('pointermove', (e) => {
			EE.emit(screen.name + ' ' + event + ' Move', obj, e);
		});
		// obj.on('pointerover', (event) => {
		// 	console.log(666)
		// });
		// obj.on('pointerout', (event) => {
		// 	console.log(666)
		// });
	},


	// /////////////////////////////////////////////////////////////////////////////// TRANSFORMS
	applyContainersTransforms(containers) {

		if (!containers.length) return;

		for (let i = 0; i < containers.length; i++) {

			let container = containers[i];
			let params = container.params;

			this.applyTransforms(container, params);

			if (container.children && container.children.length) {

				this.applyContainersTransforms(container.children);
			}
		}
	},

	applyTransforms(obj, params = {}) {

		for (let key in params) {

			if (/position/g.test(key)) {
				params.position = this.getTransformParam(params, 'position', [0, 0]);
				obj.position.set(...params.position);
			}

			if (/rotation/g.test(key)) {
				params.rotation = this.getTransformParam(params, 'rotation', 0);
				obj.rotation = params.rotation;
			}

			if (/scale/g.test(key)) {
				params.scale = this.getTransformParam(params, 'scale', [1, 1]);
				let scale = !Array.isArray(params.scale) ? [params.scale, params.scale] : params.scale;
				obj.scale.set(...scale);
			}

			if (/anchor/g.test(key)) {
				params.anchor = this.getTransformParam(params, 'anchor', 0.5);
				let anchor = !Array.isArray(params.anchor) ? [params.anchor, params.anchor] : params.anchor;
				if (obj.anchor) obj.anchor.set(...anchor);
			}
		}
	},

	getTransformParam(params, paramName, defVal) {

		if (!params) return defVal;

		let val = null;
		let valPortrait = params[paramName + 'Portrait'];
		let valLandscape = params[paramName + 'Landscape'];

		if (App.isPortrait) {
			if (valPortrait !== undefined) val = valPortrait;
		} else {
			if (valLandscape !== undefined) val = valLandscape;
		}

		if (val === null) {
			if (params.hasOwnProperty(paramName)) {
				val = params[paramName];
			} else if (defVal) {
				val = defVal;
			}
		}

		return val;
	},

	getTexture(key) {

		return PIXI.utils.TextureCache[key];
	}
}
