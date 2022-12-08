import Screen from '../libs/screen';
import FireEffectGame from "./fireEffectGame";

export default class Gameplay extends Screen {

	constructor() {
		super();

		this.name = 'Gameplay';

		this.containers = [
			// {name: 'card', type: 'sprite', image: '2_club.png'},
			{name: 'buttons cont', children: [
				{name: 'cards game button', positionLandscape: [360, -100], positionPortrait: [-175, 400]},
				{name: 'text game button', positionLandscape: [360, 0], positionPortrait: [0, 400]},
				{name: 'fire game button', positionLandscape: [360, 100], positionPortrait: [175, 400]},
			]},
			{name: 'cards stack cont', positionLandscape: [-100, 170], positionPortrait: [0, 200]},
			{name: 'texts and smiles cont', positionLandscape: [-100, 0], positionPortrait: [0, 0]},
			{name: 'fire effect cont', positionLandscape: [-100, 100], positionPortrait: [0, 100]},
		];

		this.events = {

			'Gameplay cards game Down': (container, e) => {
				this.pulseElasticContainer(container.parent);
			},
			'Gameplay cards game Up': (container, e) => {
				this.showGame('cards');

				// if(App.appContainer.requestFullscreen) {
				// 	App.appContainer.requestFullscreen();
				// }
				// else if(App.app.view.mozRequestFullScreen) {
				// 	App.app.view.mozRequestFullScreen();
				// } else if(App.app.view.webkitRequestFullscreen) {
				// 	App.app.view.webkitRequestFullscreen();
				// } else if(App.app.view.msRequestFullscreen) {
				// 	App.app.view.msRequestFullscreen();
				// }

				// const elem = document.getElementsByTagName("body")[0];
				// // if (elem.requestFullscreen) {
				// // 	elem.requestFullscreen();
				// // }
				//
				// if (!document.fullscreenElement) {
				// 	elem.requestFullscreen();
				// }
			},

			'Gameplay text game Down': (container, e) => {
				this.pulseElasticContainer(container.parent);
			},
			'Gameplay text game Up': (container, e) => {
				this.showGame('texts');
			},

			'Gameplay fire game Down': (container, e) => {
				this.pulseElasticContainer(container.parent);
			},
			'Gameplay fire game Up': (container, e) => {
				this.showGame('fire');
			},
		};
	}

	// ////////////////////////////////////////////////////////////////////////////////////////// EVENTS
	// //////////////////////////////////////////////////////////////////////////////////////////
	beforeBuilt() {

		this.currentGame = 'cards';	// cards, texts, fire
	}

	built() {

		{
			const cardsGraphics = new PIXI.Graphics();
			cardsGraphics.beginFill(PIXI.utils.string2hex('#729633'));
			cardsGraphics.drawRect(-80, -30, 160, 60);
			cardsGraphics.endFill();
			this['cards game button'].addChild(cardsGraphics);

			const cardsText = new PIXI.Text('Cards', {fontSize: 30, fill: 0xffffff});
			cardsText.anchor.set(0.5);
			this['cards game button'].addChild(cardsText);

			this.addInteraction(cardsGraphics, 'cards game', this);
		}

		{
			const textGraphics = new PIXI.Graphics();
			textGraphics.beginFill(PIXI.utils.string2hex('#b2951a'));
			textGraphics.drawRect(-80, -30, 160, 60);
			textGraphics.endFill();
			this['text game button'].addChild(textGraphics);

			const textText = new PIXI.Text('Emoticons', {fontSize: 30, fill: 0xffffff});
			textText.anchor.set(0.5);
			this['text game button'].addChild(textText);

			this.addInteraction(textGraphics, 'text game', this);
		}

		{
			const fireGraphics = new PIXI.Graphics();
			fireGraphics.beginFill(PIXI.utils.string2hex('#b0403c'));
			fireGraphics.drawRect(-80, -30, 160, 60);
			fireGraphics.endFill();
			this['fire game button'].addChild(fireGraphics);

			const fireText = new PIXI.Text('Fire', {fontSize: 30, fill: 0xffffff});
			fireText.anchor.set(0.5);
			this['fire game button'].addChild(fireText);

			this.addInteraction(fireGraphics, 'fire game', this);
		}

	}

	shown() {

		setTimeout(() => {
			// this['Gameplay gem Down']()
			// this.hide();
		}, 1000);

		this.startGameplay();
	}

	hidden() {

	}

	resize() {


	}

	update(dt) {

		// console.log(111, App.ticker.deltaMS )
		// this['gem blue'].rotation += dt/1000;
	}

	// ////////////////////////////////////////////////////////////////////////////////////////// GAME
	// //////////////////////////////////////////////////////////////////////////////////////////
	startGameplay() {

		this['cards stack cont'].addChild(App.CardsStack);
		this['texts and smiles cont'].addChild(App.TextSmileGame);
		this['fire effect cont'].addChild(App.FireEffectGame);

		this.showGame(this.currentGame);
	}

	showGame(gameName = this.currentGame) {

		this.currentGame = gameName;

		App.CardsStack.hide();
		App.TextSmileGame.hide();
		App.FireEffectGame.hide();

		switch (gameName) {
			case 'texts':
				App.TextSmileGame.show();
				break;

			case 'fire':
				App.FireEffectGame.show();
				break;

			default:

				App.CardsStack.show();
				break;
		}
	}

	pulseElasticContainer(container) {

		if (!container) return;

		GSAP.timeline().to(container, {
			scaleX: 1.2, scaleY: 0.8, duration: 0.05, ease: 'power1.out'
		}).to(container, {
			scaleX: 1, scaleY: 1, duration: 1.2, ease: 'elastic.out'
		});
	}

}
