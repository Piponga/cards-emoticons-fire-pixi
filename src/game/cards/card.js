import ScreenBuild from '../../libs/screen.build';
// import Pool from '../../libs/pool';

export default class Card extends PIXI.Container {
    constructor(type) {
        super();

        this.frontSide = ScreenBuild.buildChild(this, {
            type: 'sprite',
            image: type + '.png'
        });

        this.backSide = ScreenBuild.buildChild(this, {
            type: 'sprite',
            image: 'card_back.png'
        });
        this.backSide.scale.x = -1;
        this.backSide.alpha = 0;

        this.isBackSide = false;
        this.active = true;
    }

    turnToBack(flyingTime = 1000, callback) {

        flyingTime /= 1000;
        this.isBackSide = true;

        this.frontSide.alpha = 1;
        this.frontSide.skew.y = 0;
        this.frontSide.scale.x = 1;
        this.frontSide.scale.y = 1;

        this.backSide.alpha = 0;
        this.backSide.skew.y = Math.PI / 2;
        this.backSide.scale.x = -0.5;
        this.backSide.scale.y = 0.9;

        this.gsapTurnBack = GSAP.timeline();
        this.gsapTurnBack.to(this.frontSide, {
            skewY: Math.PI / 2,
            scaleX: 0.5,
            scaleY: 0.9,
            duration: flyingTime / 5, ease: 'sine.in', delay: flyingTime * 0.01,
            onComplete: () => {
                this.frontSide.alpha = 0;
                this.backSide.alpha = 1;
                if (callback) callback();
            }
        }).to(this.backSide, {
            skewY: Math.PI,
            scaleX: -1,
            scaleY: 1,
            duration: flyingTime / 5, ease: 'sine.out',
        });
    }

    turnToFront(flyingTime = 1000, callback) {

        flyingTime /= 1000;
        this.isBackSide = false;

        this.backSide.alpha = 1;
        this.backSide.skew.y = Math.PI;
        this.backSide.scale.x = -1;
        this.backSide.scale.y = 1;

        this.frontSide.alpha = 0;
        this.frontSide.skew.y = Math.PI / 2;
        this.frontSide.scale.x = 0.5;
        this.frontSide.scale.y = 0.9;

        this.gsapTurnFront = GSAP.timeline();
        this.gsapTurnFront.to(this.backSide, {
            skewY: Math.PI / 2,
            scaleX: -0.5,
            scaleY: 0.9,
            duration: flyingTime / 5, ease: 'sine.in', delay: flyingTime * 0.01,
            onComplete: () => {
                this.frontSide.alpha = 1;
                this.backSide.alpha = 0;
                if (callback) callback();
            }
        }).to(this.frontSide, {
            skewY: 0,
            scaleX: 1,
            scaleY: 1,
            duration: flyingTime / 5, ease: 'sine.out',
        });
    }

    // flyFromTo(fromPos, toPos, targetContainerPos, targetContainer) {
    //
    //     if (this.isFlying) return;
    //
    //     this.isFlying = true;
    //
    //     this.flyFrom = fromPos;
    //     this.flyTo = toPos;
    //     this.targetContainerPos = targetContainerPos;
    //     this.targetContainer = targetContainer;
    //     this.curFlyingTime = 0;
    // }

    // update(dt) {
    //
    //     if (!this.active) return;
    //
    // }

    reset() {

        if (this.gsapMoveCard) this.gsapMoveCard.kill();
        if (this.gsapTurnBack) this.gsapTurnBack.kill();
        if (this.gsapTurnFront) this.gsapTurnFront.kill();

        this.position.set(0, 0);
        // this.scale.set(1);
        this.alpha = 1;
        this.rotation = 0;

        this.frontSide.alpha = 1;
        this.frontSide.skew.y = 0
        this.frontSide.scale.x = 1;
        this.frontSide.scale.y = 1;

        this.backSide.alpha = 0;
        this.backSide.skew.y = 0;
        this.backSide.scale.x = 1;
        this.backSide.scale.y = 1;

        this.isBackSide = false;
    }

    enable() {
        this.active = true;
        this.visible = true;
        // App.update.add(this);
    }

    disable() {
        this.active = false;
        this.visible = false;
        if (this.parent) this.parent.removeChild(this);
        this.reset();
        // App.update.remove(this);
    }
}

// Pool.getCard = function(type) {
//     return this.getFromCache(type, () => new Card(type));
// };
