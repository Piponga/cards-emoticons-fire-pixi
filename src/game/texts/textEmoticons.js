export default class TextEmoticons extends PIXI.Container {
    constructor(text = '', styles = {}, emoticons = {}) {
        super();

        const defaultStyle = new PIXI.TextStyle();

        this.test = text;
        this.styles = _.extend(defaultStyle, styles);
        this.emotions = emoticons;

        this._words = [];
        this._icons = [];

        this.anchor = new PIXI.ObservablePoint(
            this._onAnchorUpdate,
            this
        );

        this.setText(text, this.styles);
    }

    setText(text = '', styles) {

        this.removeChildren();

        if (styles) this.setStyles(styles);

        text = text.replace(/\t\r/ig, '');

        let words = text.match(/[^\s\n:]+|:[A-Za-z0-9_-]+:|\s+|\n+/ig) || [];

        let lastX = 0, lastY = 0;

        _.each(words, (word, ind) => {

            let element;

            if (this.emotions[word] && this.emotions[word].image) {

                element = new PIXI.Sprite(PIXI.utils.TextureCache[this.emotions[word].image]);

                let anchor = this.emotions[word].anchor || 0.5;
                if (!Array.isArray(anchor)) anchor = [anchor, anchor];
                element.anchor.set(anchor[0], anchor[1]);

                let scale = this.emotions[word].scale || 1;
                if (!Array.isArray(scale)) scale = [scale, scale];
                let elementScaleByFontSize = this.styles.fontSize / element.height;
                scale = [scale[0] * elementScaleByFontSize, scale[1] * elementScaleByFontSize];
                element.scale.set(...scale);

                let position = this.emotions[word].position || [0, 0];
                element.position.set(
                    lastX + element.width / 2 + position[0],
                    lastY + element.height / 2 + position[1]
                );

                lastX += element.width;

                this._icons.push(element);

            } else {

                element = new PIXI.Text(word, this.styles);

                element.position.set(lastX, lastY);

                lastX += element.width;

                this._words.push(element);
            }

            this.addChild(element);
        });

        this._onAnchorUpdate();
    }

    setStyles(styles = {}) {

        _.extend(this.styles, styles);

        _.each(this._words, word => {

        });

        _.each(this._icons, icon => {

        });
    }

    setEmoticons() {

    }

    _onAnchorUpdate() {
        this.pivot.x = this.width * this.anchor.x;
        this.pivot.y = this.height * this.anchor.y;
    }
}
