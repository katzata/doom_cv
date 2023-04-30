export const config = {
    scale: 1,
    postFireDelay: 0.17,
    animationSpeed: 0.135
};

export const initialState = {
    moving: false,
    firing: false,
    reloading: false,
    isDead: false,
    takingHit: false,
    reSpawning: false,
    velocity: {
        x: 0,
        y: 0,
    }
};

export const movement = {
    speed: 4,
    turnDuration: 0.13,
    decelerateDuration: 0.1,
    scale: 1,
    hit: {
        offset: 2,
        ease: "sine",
    },
    fire: {
        x: 0,
        duration: 0.135,
        ease: "sine",
    },
    death: {
        x: [ -1, -4, -2, 3, 8, 15, 22, 34, 33 ],
        y: [ -1, -4, -2, 3, 8, 15, 22, 34, 33 ],
    }
};

export const animations = {
    idle: {
        anim: "idle",
        loop: false
    },
    walk: {
        anim: "walk",
        loop: true,
        speed: 0.1,
    },
    fire: {
        anim: "fire",
        soundName: "sshot",
        loop: false,
        speed: 0.6,
    },
    hit: {
        anim: "hit",
        loop: false,
        speed: 0.135,
    },
    death: {
        anim: "death",
        soundName: "pdeath",
        loop: false,
        speed: 0.135,
    },
    reSpawn: {
        anim: "reSpawn",
        soundName: "telept",
        loop: false,
        speed: 0.135,
    }
};

export const actions = {
    UP: "UP",
    DOWN: "DOWN",
    LEFT: "LEFT",
    RIGHT: "RIGHT",
    FIRE: "FIRE"
};

export const bindings = {
    UP: "KeyW",
    DOWN: "KeyS",
    LEFT: ["KeyA", "ArrowLeft"].join("_"),
    RIGHT: ["KeyD", "ArrowRight"].join("_"),
    FIRE: "Space"
};
