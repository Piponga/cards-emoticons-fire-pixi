
export default class Stack extends PIXI.Container {
    constructor(name) {
        super();

        this.name = name;

        this.topFreeIndex = 0;
        this.ghostsQueue = [];

        this.active = true;
    }

    addElement(element) {

        if (!element) return;

        this.addChild(element);

        if (this.children.length > this.ghostsQueue.length) {

            this.ghostsQueue.push(this.children.length - 1);
        }
    }

    pullTopFreeElement() {

        this.topFreeIndex = this.ghostsQueue.pop() || 0;

        return this.children[this.topFreeIndex];

    }

    getTopFreeElement() {

        return this.children[this.topFreeIndex - 1];
    }

    reserveTopFreeIndex() {

        this.topFreeIndex = this.ghostsQueue.length;

        this.ghostsQueue.push(this.topFreeIndex);

        return this.topFreeIndex;
    }


    reset() {
        this.topFreeIndex = 0;
        this.ghostsQueue = [];

        for (let i = this.children.length - 1; i >= 0; i--) this.children[i].disable();
    }

    enable() {
        this.active = true;
        this.visible = true;
    }

    disable() {
        this.active = false;
        this.visible = false;
        this.reset();
    }
}
