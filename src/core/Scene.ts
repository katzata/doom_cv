import { Container, Graphics, Sprite } from "pixi.js";
import type { SceneUtils } from "./SceneManager";

export interface Scene {
	load?(): void | Promise<void>;
	unload?(): void | Promise<void>;
	start?(): void | Promise<void>;
	onResize?(width: number, height: number): void;
};

export abstract class Scene extends Container {
	abstract name: string;

	constructor(protected utils: SceneUtils) {
		super();
	};

	addMask(width?: number, height?: number, maskRect?: Sprite | Graphics): void {
		if (maskRect) {
			this.mask = maskRect;
			return;
		};

		const mask = new Graphics();
		mask.beginFill(0x000000, 1);
		mask.drawRect(0, 0, width!, height!);

		this.mask = mask;
	};
};

export default Scene;
