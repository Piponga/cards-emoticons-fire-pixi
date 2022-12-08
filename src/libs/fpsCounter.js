class FPSCounter {
    constructor() {

        this.container = document.createElement('div');
        this.container.style.cssText =
            'position: fixed;\n' +
            '    top: 0px;\n' +
            '    left: 0px;\n' +
            '    z-index: 10000;\n' +
            '    width: 100%;\n' +
            // '    padding: 10px 20px;\n' +
            // '    background-color: #a9a9a9cc;\n' +
            '    color: black;';

        this.fpsText = document.createElement('div');
        this.fpsText.style.cssText =
            '    display: inline-block;\n' +
            '    padding: 10px 20px;\n' +
            '    font-size: 50px;\n' +
            '    background-color: #a9a9a9cc;\n'
            // '    color: black;';
        this.container.appendChild(this.fpsText);

        this.debugText = document.createElement('div');
        this.debugText.style.cssText =
            '    position: absolute;\n' +
            '    display: inline-block;\n' +
            '    left: 130px;\n' +
            '    padding: 5px 20px;\n' +
            '    font-size: 20px;\n' +
            '    background-color: #a9a9a9cc;\n'
            // '    color: black;';
        // this.debugText.innerText = 'Asbbj bhbhlj';
        this.container.appendChild(this.debugText);

        this.beginTime = (performance || Date).now();
        this.prevTime = this.beginTime;
        this.frames = 0;

        this.show();
    }

    setDebugText(text = '') {
        this.debugText.innerText = text;
    }

    begin() {
        this.beginTime = Date.now();
    }

    end() {

        this.frames++;

        let time = Date.now();

        if (time >= this.prevTime + 1000) {

            this.fpsText.innerText = '' + Math.floor((this.frames * 1000) / (time - this.prevTime));

            this.prevTime = time;
            this.frames = 0;
        }
    }

    show() {
        this.container.display = 'block';
    }

    hide() {
        this.container.display = 'none';
    }
}

export default FPSCounter;
