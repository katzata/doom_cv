import config from "../config";
import { Player } from "../prefabs/Player/Player";
import Floor from "../prefabs/Floor/Floor";
import Scene from "../core/Scene";
import { /* DisplayObject,  */Container, Graphics, Sprite, Ticker /* Texture */ } from "pixi.js";
import { centerObjects, scaleProportionately } from "../utils/misc";
import { gsap } from "gsap";

export default class Game extends Scene {
	name = "Game";

	private player: Player | undefined;
	private floor: Floor | undefined;
	private bg: Sprite | undefined;
	private maskRect = new Graphics();
	private testBorder = new Graphics();

	offsetX: number = 130;

	load() {
		// const { innerWidth, innerHeight } = window;
		const { viewport } = config;

		this.bg = Sprite.from("level_bg");
		this.bg.x = this.offsetX;

		const currentWidth = this.currentWidth();
		const currentHeight = this.currentHeight();
		scaleProportionately(currentWidth, currentHeight, viewport.width, viewport.height, this);

		// this.floor = new Floor(viewport.width);
		// this.floor.x = 0;
		// this.floor.y = level.height - 150;

		this.player = new Player();
		this.player.x = viewport.width / 4;
		this.player.y = viewport.height / 2;

		this.maskRect.beginFill(0x000000, 1);
		this.maskRect.drawRoundedRect(0, 0, viewport.width, viewport.height, 8);

		this.testBorder.lineStyle({ width: 5, color: 0xf0f0f0 });
		this.testBorder.drawRoundedRect(0, 0, viewport.width, viewport.height, 0);

		this.maskRect.x = 0;
		this.maskRect.y = 0;

		this.addChild(this.bg);
		this.addMask(viewport.width, viewport.height, this.maskRect);
		this.addChild(this.player, this.maskRect, this.testBorder);

		this.handleMovement(this.player);
		centerObjects(currentWidth, currentHeight, this);
		// scaleProportionately(this.levelSize, innerWidth, innerHeight, config.level.aspectRatio);
		// scaleProportionately(this, innerWidth, innerHeight, config.viewport.aspectRatio);
	};

	handleMovement(target: Player) {
		let seconds = 0;

		Ticker.shared.add((delta) => {
		  	seconds += (1 / 60) * delta;


			this.bg!.x += target.state.velocity.x / -8;
		  	this.updatePosition(seconds);
		});
	}

	  updatePosition(x: number) {
		// console.log(x);

		// this.bg.x -= x * index * this.config.panSpeed;
		// for (const [index, child] of this.children.entries()) {
		//   if (child instanceof TilingSprite) {
		// 	this.bg.x -= x * index * this.config.panSpeed;
		//   } else {
		// 	this.bg.x -= x * index * this.config.panSpeed;
		//   }
		// }
	  }

	setOffsetX(offset: number) {
		// console.log(offset);
		this.offsetX += offset;
		this.bg!.x = this.offsetX;
	};

	onResize(width: number, height: number): void {
		// if (this.player) {
		// 	this.player.x = width / 2;
		// 	this.player.y = height/ 2;
		// };

		// if (this.background) {
		// 	this.background.resize(width, height);
		// };
		const currentWidth = this.currentWidth();
		const currentHeight = this.currentHeight();

		scaleProportionately(currentWidth, currentHeight, config.viewport.width, config.viewport.height, this);
		centerObjects(currentWidth, currentHeight, this);
	};

	currentWidth(): number {
		const { innerWidth, innerHeight } = window;
		const { width, height } = config.viewport;
		const isWidthConstrained = innerWidth < innerHeight * width / height;
		return isWidthConstrained ? innerWidth : innerHeight * width / height;
	};

	currentHeight(): number {
		const { innerWidth, innerHeight } = window;
		const { width, height } = config.viewport;
		const isHeightConstrained = innerWidth * height / width > innerHeight;
		return isHeightConstrained ? innerHeight : innerWidth * height / width;
	};
};
