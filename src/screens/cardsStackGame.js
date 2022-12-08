import Screen from '../libs/screen';
import Pool from '../libs/pool';
import Stack from "../game/cards/stack";

export default class CardsStackGame extends Screen {
    constructor() {
        super();

        this.name = 'CardsStackGame';

        this.containers = [
            {name: 'stacks cont'},
            {name: 'moving cont back'},
            {name: 'moving cont'},
        ];

        this.BETWEEN_STACKS = 400;
        this.CARDS_COUNT = 144;
        this.CARDS_OFFSET_Y = 2;
        this.CARDS_TYPES = this.generateTypesArray();
        this.CARD_SIZE = 1;

        this.leftStack = [];
        this.rightStack = [];

        this.moveFromContainer = null;
        this.moveToContainer = null;

        this.IS_TURN_CARDS = true;
        this.TOTAL_MOVE_TIME = 2000;
        this.CARD_FLYING_TIME = this.TOTAL_MOVE_TIME * 0.25;

        this.isCardMove = false;
        this.cardMoveDelay = Math.max(0, (this.TOTAL_MOVE_TIME - this.CARD_FLYING_TIME) / this.CARDS_COUNT);
        this.currCardMoveDelay = 0;

        this.events = {

            'Cards Stack Empty': (stack, e) => {

                console.log('shifting time: ', Date.now() - this.time)

                this.swapContainers();
                this.startMoveCardsFromTo();
            },
        };
    }

    // ////////////////////////////////////////////////////////////////////////////////////////// EVENTS
    // //////////////////////////////////////////////////////////////////////////////////////////
    beforeBuilt() {

    }

    built() {

        this.leftStack = new Stack('left');
        this.leftStack.x = -this.BETWEEN_STACKS / 2;
        this['stacks cont'].addChild(this.leftStack);

        this.rightStack = new Stack('right');
        this.rightStack.x = this.BETWEEN_STACKS / 2;
        this['stacks cont'].addChild(this.rightStack);

    }

    shown() {

        this.resetGame();

        this.createCardsStack(this.leftStack);

        this.moveFromContainer = this.leftStack;
        this.moveToContainer = this.rightStack;

        this.startMoveCardsFromTo();
    }

    hidden() {

        this.resetGame();
    }

    resize() {

    }

    update(dt) {

        // if (this.isCardMove) {
        //
        //     this.currCardMoveDelay -= App.ticker.deltaMS;
        //
        //     if (this.currCardMoveDelay <= 0) {
        //
        //         this.currCardMoveDelay = this.cardMoveDelay;
        //
        //         this.moveCardFromTo(this.moveFromContainer, this.moveToContainer);
        //
        //         if (!this.moveFromContainer.children.length) {
        //
        //             this.isCardMove = false;
        //         }
        //     }
        // }
    }

    // ////////////////////////////////////////////////////////////////////////////////////////// GAME
    // //////////////////////////////////////////////////////////////////////////////////////////
    createCardsStack(stack) {

        // prepare cards types
        let typesArr = [];

        for (let i = 0; i < this.CARDS_COUNT; i++) {
            typesArr.push(this.CARDS_TYPES[i % this.CARDS_TYPES.length]);
        }

        typesArr = _.shuffle(typesArr);

        // create cards sprites
        _.each(typesArr, (type, ind) => {

            let card = Pool.getCard(type);

            if (card) {

                card.x = _.random(-2, 2);
                card.y = -ind * this.CARDS_OFFSET_Y;
                card.scale.set(this.CARD_SIZE);

                if (stack) stack.addElement(card);
            }
        });
    }

    resetGame() {

        clearTimeout(this.timeoutStartMoveCard);

        this.leftStack.reset();
        this.rightStack.reset();

        for (let i = this['moving cont'].children.length - 1; i >= 0; i--) this['moving cont'].children[i].disable();
        for (let i = this['moving cont back'].children.length - 1; i >= 0; i--) this['moving cont back'].children[i].disable();

        this.isCardMove = false;
        this.currCardMoveDelay = 0;
    }

    generateTypesArray() {

        const result = [];
        const names = ['club', 'diamond', 'heart', 'spade'];

        for (let n = 1; n <= 13; n++) {
            for (let i = 0; i < names.length; i++) {

                result.push(n + '_' + names[i]);
            }
        }

        return result;
    }

    swapContainers() {

        let tmp = this.moveFromContainer;

        this.moveFromContainer = this.moveToContainer;
        this.moveToContainer = tmp;
    }

    startMoveCardsFromTo(fromContainer = this.moveFromContainer, toContainer = this.moveToContainer) {

        if (!fromContainer) return;
        if (!toContainer) return;

        this.moveFromContainer = fromContainer;
        this.moveToContainer = toContainer;

        this.moveFromContainer.zIndex = 2;
        this.moveToContainer.zIndex = 1;
        this['stacks cont'].sortChildren();

        this.timeoutStartMoveCard = setTimeout(() => {

            this.time = Date.now();
            this.isCardMove = true;

            _.each(this.moveFromContainer.children, () => {
                this.moveCardFromTo(this.moveFromContainer, this.moveToContainer);
            });

        }, 200);
    }

    moveCardFromTo(fromContainer, toContainer) {

        if (!fromContainer) return;
        if (!toContainer) return;

        const movingCont = this['moving cont'];
        const movingContBack = this['moving cont back'];

        const movingCard = fromContainer.pullTopFreeElement();

        if (movingCard) {

            const neighbor = fromContainer.getTopFreeElement();

            let targetIndex = toContainer.reserveTopFreeIndex();
            let posInTargetContainer = {x: 0, y: -this.CARDS_OFFSET_Y * targetIndex};
            posInTargetContainer.x += _.random(-2, 2);

            let startPos = movingCont.toLocal(fromContainer.toGlobal(movingCard.position));
            let endPos = movingCont.toLocal(toContainer.toGlobal(posInTargetContainer));

            // movingCard.position.copyFrom(startPos);
            //
            // if (this.IS_TURN_CARDS) {
            //
            //     movingCont.addChildAt(movingCard, 0);
            //
            //     if (movingCard.isBackSide) {
            //
            //         movingCard.turnToFront(this.CARD_FLYING_TIME, () => {
            //             movingContBack.addChild(movingCard);
            //         });
            //
            //     } else {
            //
            //         movingCard.turnToBack(this.CARD_FLYING_TIME, () => {
            //             movingContBack.addChild(movingCard);
            //         });
            //     }
            //
            // } else {
            //
            //     movingCont.addChild(movingCard);
            // }

            // movingCard.flyFromTo(startPos, endPos, posInTargetContainer, toContainer);

            // movingCard.zIndex = -movingCard.y;
            // movingCont.sortChildren();

            let isMoving = false;
            let isChangedZIndex = false;
            let curveX = endPos.x + _.random(-50, 50);
            let curveX1 = startPos.x + _.random(0, 50) * Math.sign(startPos.x);
            let curveX2 = endPos.x - _.random(0, 50) * Math.sign(startPos.x);
            // let curveY = Math.min(startPos.y, endPos.y) - _.random(480, 500);
            let curveY = Math.min(startPos.y, endPos.y) - _.random(180, 200);
            const obj = {p: 0};

            movingCard.gsapMoveCard = GSAP.to(obj, {
                p: 1,
                duration: this.CARD_FLYING_TIME / 1000,
                ease: 'none',
                delay: targetIndex * this.cardMoveDelay / 1000,
                onStart: () => {

                    movingCard.position.copyFrom(startPos);

                    if (this.IS_TURN_CARDS) {

                        movingCont.addChildAt(movingCard, 0);

                        if (movingCard.isBackSide) {

                            movingCard.turnToFront(this.CARD_FLYING_TIME, () => {
                                if (isMoving) movingContBack.addChild(movingCard);
                            });

                        } else {

                            movingCard.turnToBack(this.CARD_FLYING_TIME, () => {
                                if (isMoving) movingContBack.addChild(movingCard);
                            });
                        }

                    } else {

                        movingCont.addChild(movingCard);
                    }

                    isMoving = true;

                },
                onUpdate: () => {

                    if (!isMoving) return;

                    // movingCard.x = Math.lerp(startPos.x, endPos.x, obj.p);
                    // movingCard.y = Math.lerp(startPos.y, endPos.y, obj.p);
                    // movingCard.x = Math.qarp(startPos.x, curveX, endPos.x, obj.p);
                    // movingCard.y = Math.qarp(startPos.y, curveY, endPos.y, obj.p);
                    movingCard.x = Math.cubic(startPos.x, curveX1, curveX2, endPos.x, obj.p);
                    movingCard.y = Math.cubic(startPos.y, curveY, curveY, endPos.y, obj.p);

                    // if (neighbor && movingCard.y > neighbor.y && !isChangedZIndex) {
                    //     isChangedZIndex = true;
                    //     // movingCard.zIndex = -movingCard.y;
                    //     // movingCont.sortChildren();
                    //     // movingContBack.addChild(movingCard);
                    // } else {
                    //     // movingCard.zIndex = -movingCard.y;
                    // }
                },
                onComplete: () => {

                    isMoving = false;

                    movingCard.position.copyFrom(posInTargetContainer);
                    toContainer.addElement(movingCard);

                    movingCard.gsapMoveCard.kill();

                    if (toContainer.children.length === this.CARDS_COUNT) {

                        EE.emit('Cards Stack Empty', fromContainer);
                    }
                }
            });
        }
    }
}
