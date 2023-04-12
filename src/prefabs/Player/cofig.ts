export const config = {
    scale: 1
};

export const movement = {
    speed: 10,
    turnDuration: 0.15,
    decelerateDuration: 0.1,
    scale: 1,
    fire: {
        x: 0,
        duration: .155,
        ease: "sine",
    },
    reload: {
        speedMultiplier: 6,
        duration: 0.1,
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
        soundName: "ssshot",
        loop: false,
        speed: 0.85,
    },
    reload: {
        // soundName: "dash",
        loop: false,
        speed: 0.2,
    }
};

export const actions = {
    UP: "UP",
    DOWN: "DOWN",
    LEFT: "LEFT",
    RIGHT: "RIGHT",
    FIRE: "FIRE",
    SHIFT: "SHIFT",
};

export const bindings = {
    UP: "KeyW",
    DOWN: "KeyS",
    LEFT: ["KeyA", "ArrowLeft"].join("_"),
    RIGHT: ["KeyD", "ArrowRight"].join("_"),
    FIRE: "Space",
    SHIFT: "ShiftLeft",
};
