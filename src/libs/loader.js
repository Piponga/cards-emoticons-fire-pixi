
const Loader = {

	loader: PIXI.Loader.shared,
	progressbar: document.getElementsByClassName('loader-progress-line')[0],
	progressbarContainer: document.getElementsByClassName('loader')[0],

	load: function(assets, onComplete) {

		const complete = () => {
			this.fadeProgressbar();
			onComplete();
		};

		if (!Object.keys(assets).length) {
			complete();
			return;
		}

		const assetsByTypes = this.prepareAssets(assets);

		this.addSprites(assetsByTypes.images);
		this.addSprites(assetsByTypes.atlases);

		this.loader.load();

		this.loader.onProgress.add(loader => {
			this.progressbar.style.width = loader.progress + '%';
		});

		this.loader.onComplete.add(() => {
			complete();
		});

		this.loader.onError.add((err) => {
			console.error('loader error: ', err);
		});
	},

	prepareAssets: function(assets) {

		const result = {
			atlases: [],
			images: [],
			sounds: [],
			texts: [],
		};

		for (let name in assets) {

			let asset = assets[name];

			let url = asset.url;
			let type = asset.type;

			if (type) {

				const params = Object.assign(asset, {name: name, type: type, url: url});

				if (type === 'atlas') {

					result.atlases.push(params);

				} else if (type === 'image') {

					result.images.push(params);

				} else if (type === 'audio') {

					result.sounds.push(params);

				} else if (['json', 'text'].indexOf(type) >= 0) {

					result.texts.push(params);

				}

			} else {

				console.error(name + ' - type not recognized');
			}
		}

		return result;
	},

	addSprites: function (sprites) {

		for (let i = 0; i < sprites.length; i++) {

			let name = sprites[i].name;
			let url = sprites[i].url;

			this.loader.add(name, url, {crossOrigin: '*'});
		}
	},

	fadeProgressbar: function () {

		const obj = {opacity: 1};

		let tween = GSAP.to(obj, {
			delay: 0,
			opacity: 0,
			duration: 0.2,
			ease: 'none',
			onUpdate: () => {
				this.progressbarContainer.style.opacity = obj.opacity;
			},
			onComplete: () => {
				tween.kill();
				this.progressbarContainer.remove();
			}
		});
	}
};

export default Loader;
