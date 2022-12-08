import Screen from '../libs/screen';
import '../game/fire/particle-emitter.js';

export default class FireEffectGame extends Screen {
    constructor() {
        super();

        this.name = 'FireEffectGame';

        this.containers = [
            {name: 'fire cont'}
        ];

        this.events = {

        };
    }

    // ////////////////////////////////////////////////////////////////////////////////////////// EVENTS
    // //////////////////////////////////////////////////////////////////////////////////////////
    beforeBuilt() {

    }

    built() {

        this.emitter1 = new PIXI.particles.Emitter(
            this['fire cont'],
            {
                lifetime: {
                    min: 0.1,
                    max: 0.75
                },
                frequency: 0.001,
                spawnChance: 1,
                particlesPerWave: 1,
                emitterLifetime: -1,
                maxParticles: 10,
                pos: {
                    x: 0,
                    y: 0
                },
                addAtBack: false,
                behaviors: [
                    {
                        type: 'alpha',
                        config: {
                            alpha: {
                                list: [
                                    {
                                        value: 1,
                                        time: 0
                                    },
                                    {
                                        value: 0.8,
                                        time: 0.7
                                    },
                                    {
                                        value: 0,
                                        time: 1
                                    }
                                ],
                            },
                        }
                    },
                    {
                        type: 'scale',
                        config: {
                            scale: {
                                list: [
                                    {
                                        value: 2,
                                        time: 0
                                    },
                                    {
                                        value: 4,
                                        time: 0.5
                                    },
                                    {
                                        value: 6,
                                        time: 0.8
                                    },
                                    {
                                        value: 7,
                                        time: 1
                                    }
                                ],
                            },
                        }
                    },
                    {
                        type: 'color',
                        config: {
                            color: {
                                list: [
                                    {
                                        value: "#ffeb52",
                                        time: 0
                                    },
                                    {
                                        value: "#ffc252",
                                        time: 0.3
                                    },
                                    {
                                        value: "#ff2929",
                                        time: 0.6
                                    },
                                    {
                                        value: "#070606",
                                        time: 1
                                    }
                                ],
                            },
                        }
                    },
                    {
                        type: 'moveSpeed',
                        config: {
                            speed: {
                                list: [
                                    {
                                        value: 10,
                                        time: 0
                                    },
                                    {
                                        value: 400,
                                        time: 0.2
                                    },
                                    {
                                        value: 300,
                                        time: 1
                                    }
                                ],
                                isStepped: false
                            },
                            minMult: 0.8
                        }
                    },
                    {
                        type: 'rotationStatic',
                        config: {
                            min: 260,
                            max: 280
                        }
                    },
                    {
                        type: 'spawnShape',
                        config: {
                            type: 'torus',
                            data: {
                                radius: 5,
                                x: 0,
                                y: 0,
                                innerRadius: 0,
                                rotation: true
                            }
                        }
                    },
                    {
                        type: 'textureRandom',
                        config: {
                            textures: ["e_flame.png", "e_flame_2.png", "e_flame_3.png", "e_flame_4.png"],
                        }
                    }
                ],
            }
        );

        this.emitter2 = new PIXI.particles.Emitter(
            this['fire cont'],
            {
                lifetime: {
                    min: 0.5,
                    max: 1
                },
                frequency: 0.001,
                spawnChance: 1,
                particlesPerWave: 1,
                emitterLifetime: -1,
                maxParticles: 3,
                pos: {
                    x: 0,
                    y: 0
                },
                addAtBack: false,
                behaviors: [
                    {
                        type: 'alpha',
                        config: {
                            alpha: {
                                list: [
                                    {
                                        value: 1,
                                        time: 0
                                    },
                                    {
                                        value: 0,
                                        time: 1
                                    }
                                ],
                            },
                        }
                    },
                    {
                        type: 'scale',
                        config: {
                            scale: {
                                list: [
                                    {
                                        value: 0.4,
                                        time: 0
                                    },
                                    {
                                        value: 1,
                                        time: 1
                                    },
                                    {
                                        value: 0.1,
                                        time: 1
                                    }
                                ],
                            },
                        }
                    },
                    {
                        type: 'color',
                        config: {
                            color: {
                                list: [
                                    {
                                        value: "#ffeb52",
                                        time: 0
                                    },
                                    {
                                        value: "#ff2929",
                                        time: 0.5
                                    },
                                    {
                                        value: "#5e025e",
                                        time: 1
                                    }
                                ],
                            },
                        }
                    },
                    {
                        type: 'moveSpeed',
                        config: {
                            speed: {
                                list: [
                                    {
                                        value: 600,
                                        time: 0
                                    },
                                    {
                                        value: 0,
                                        time: 1
                                    }
                                ],
                                isStepped: false
                            },
                            minMult: 0.8
                        }
                    },
                    {
                        type: 'rotationStatic',
                        config: {
                            min: 240,
                            max: 300
                        }
                    },
                    {
                        type: 'spawnShape',
                        config: {
                            type: 'torus',
                            data: {
                                radius: 20,
                                x: 0,
                                y: -10,
                                innerRadius: 0,
                                rotation: true
                            }
                        }
                    },
                    {
                        type: 'textureRandom',
                        config: {
                            textures: ["e_flame.png", "e_flame_2.png", "e_flame_3.png", "e_flame_4.png"],
                        }
                    }
                ],
            }
        );
    }

    shown() {

        this.emitter1.emit = true;
        this.emitter2.emit = true;
    }

    hidden() {

        this.resetGame();
    }

    resize() {

    }

    update(dt) {

        dt *= 0.01;

        this.emitter1.update(dt);
        this.emitter2.update(dt);
    }

    // ////////////////////////////////////////////////////////////////////////////////////////// GAME
    // //////////////////////////////////////////////////////////////////////////////////////////
    resetGame() {

        this.emitter1.emit = false;
        this.emitter2.emit = false;
    }

}
