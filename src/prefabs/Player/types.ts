export type AnimState = {
    anim: string;
    soundName?: string;
    loop?: boolean;
    speed?: number;
};

export enum Directions {
    LEFT = -1,
    RIGHT = 1,
};