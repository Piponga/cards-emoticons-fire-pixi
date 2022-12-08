import Screen from '../libs/screen';
import Pool from '../libs/pool';
import TextEmoticons from "../game/texts/textEmoticons";

export default class TextSmileGame extends Screen {
    constructor() {
        super();

        this.name = 'TextSmileGame';

        this.containers = [
            {name: 'text cont'},
            {name: 'progress cont', position: [-50, 80]}
        ];

        this.EMOTICONS = {
            ':smiley:': {image: 'smiley.png', scale: 1},
            ':game_die:': {image: 'game_die.png', scale: 1},
            ':coin:': {image: 'coin.png', scale: 2, position: [0, -10]},
            ':skull:': {image: 'skull.png', scale: 1,},
            ':bomb:': {image: 'bomb.png', scale: 1.8, anchor: [0.5, 0.8]},
            ':cards:': {image: 'cards.png', scale: 1},
            ':diamond:': {image: 'diamond.png', scale: 1},
            ':gold_bag:': {image: 'gold_bag.png', scale: 1},
            ':sword:': {image: 'sword.png', scale: 1.3, anchor: [0.4, 0.7]},
        }

        this.TEXT_PRESET = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

        this.textPresetWords = [];
        this.emoticonsKeys = [];

        this.events = {

        };
    }

    // ////////////////////////////////////////////////////////////////////////////////////////// EVENTS
    // //////////////////////////////////////////////////////////////////////////////////////////
    beforeBuilt() {

    }

    built() {

        this.textPresetWords = this.TEXT_PRESET.split(/[\s\b]+/ig);
        this.emoticonsKeys = Object.keys(this.EMOTICONS);

        // create text field
        this.textEmoticons = new TextEmoticons('Lorem ipsum :sword: dolor', {
            fontSize: 40, fill: '#fff'
        }, this.EMOTICONS);

        this.textEmoticons.anchor.set(0.5);

        this['text cont'].addChild(this.textEmoticons);

        {
            this.progress = new PIXI.Graphics();
            this.progress.beginFill(PIXI.utils.string2hex('#b2951a'));
            this.progress.drawRect(0, -2, 100, 4);
            this.progress.endFill();
            this['progress cont'].addChild(this.progress);
        }
    }

    shown() {

        this.resetGame();

        this.generateText();
    }

    hidden() {

        this.resetGame();
    }

    resize() {

    }

    update(dt) {

    }

    // ////////////////////////////////////////////////////////////////////////////////////////// GAME
    // //////////////////////////////////////////////////////////////////////////////////////////
    resetGame() {

        if (this.gsapGenerateText) this.gsapGenerateText.kill();
    }

    generateText() {

        let randomEmoticons = _.sample(this.emoticonsKeys, _.random(1, 3));
        let randomWords = _.sample(this.textPresetWords, _.random(1, 3));

        let wordsAndEmoticons = randomEmoticons.concat(randomWords);
        wordsAndEmoticons = _.shuffle(wordsAndEmoticons);

        let text = wordsAndEmoticons.join(' ');

        this.textEmoticons.setText(text, {
            fontSize: _.random(20, 50)
        });

        this.progress.scale.x = 1;

        this.gsapGenerateText = GSAP.to(this.progress, {
            scaleX: 0, duration: 2, ease: 'none',
            onComplete: () => {

                this.gsapGenerateText.kill();

                this.generateText();
            }
        });


    }

}
