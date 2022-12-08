
import * as PIXI from 'pixi.js';
import assets from './assets';
import Loader from './libs/loader';
import App from './libs/app';

import Gameplay from './screens/gameplay';
import CardsStackGame from './screens/cardsStackGame';
import TextSmileGame from "./screens/textSmilesGame";
import FireEffectGame from "./screens/fireEffectGame";

global.App = App;
global.EE = new PIXI.utils.EventEmitter;

App.init();
App.addTicker();

Loader.load(assets, () => {

    App.Gameplay = App.addScreen(new Gameplay());
    App.CardsStack = App.addScreen(new CardsStackGame());
    App.TextSmileGame = App.addScreen(new TextSmileGame());
    App.FireEffectGame = App.addScreen(new FireEffectGame());

    App.Gameplay.show();

});

