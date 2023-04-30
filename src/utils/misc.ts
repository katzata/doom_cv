import { DisplayObject, Sprite, Container, Texture } from "pixi.js";

interface TileMap {
	singleTexture?: Texture;
	textures?: Texture[];
	textureMap?: number[];
}

export function centerObjects(width: number, height: number, ...toCenter: DisplayObject[]) {
	const center = (obj: DisplayObject) => {
		const isSprite = obj instanceof Sprite;
		const offsetX = isSprite ? 0 : width / 2;
		const offsetY = isSprite ? 0 : height / 2;

		obj.x = window.innerWidth / 2 - offsetX;
		obj.y = window.innerHeight / 2 - offsetY;

		if (obj instanceof Sprite) {
			obj.anchor.set(0.5);
		};
	};

	toCenter.forEach(center);
}

export function scaleProportionately(currentWidth: number, currentHeight: number, initialWidth: number, initialHeight: number, ...targets: DisplayObject[]): void {
	for (const target of targets) {
		const isSprite = target instanceof Sprite;
		const width: number = currentWidth > currentHeight ? currentWidth : widthCalc();
		const height: number = currentHeight > currentWidth ? currentHeight : heightCalc();

		(target as Container | Sprite).width = !isSprite ? initialWidth : width;
		(target as Container | Sprite).height = !isSprite ? initialHeight : height;

		if (!isSprite) {
			target.scale.x = currentWidth / initialWidth;
			target.scale.y = currentHeight / initialHeight;
		};
	};

	function widthCalc(): number {
		const isWidthConstrained = currentWidth > currentHeight * initialWidth / initialHeight;
		return isWidthConstrained ? currentWidth : currentHeight * initialWidth / initialHeight;
	};

	function heightCalc(): number {
		const isHeightConstrained = currentHeight > currentWidth * initialHeight / initialWidth;
		return isHeightConstrained ? currentHeight : currentWidth * initialHeight / initialWidth;
	};
};

export function wait(seconds: number) {
	return new Promise<void>((res) => setTimeout(res, seconds * 1000));
}

export async function after(
	seconds: number,
	callback: (...args: unknown[]) => unknown
) {
	await wait(seconds);
	return callback();
}

export function getEntries<T extends object>(obj: T) {
	return Object.entries(obj) as Entries<T>;
}

/**
 * Render a row of tiles that spans across the viewport width.
 * Will render two additional tiles which will be moved back and forth (depending on the direction of the player movement).
 */
export function generateMultipleTiles(texture: TileMap, width: number, y: number, options?: object): Sprite[] {
	const tiles = [];

	if (texture.textureMap) {
		for (let i = 0; i < texture.textureMap.length + 2; i++) {
			const x = (i * texture.textures![0].width);
			tiles.push(generateSprite(texture.textures![texture.textureMap[i]], { x, y, ...options }));
		};
	} else {
		for (let i = 0; i < Math.floor(width / texture.singleTexture!.width) + 2; i++) {
			const x = (i * texture.singleTexture!.width);
			tiles.push(generateSprite(texture.singleTexture!, { x, y, ...options }));
		};
	};

	return tiles;
};

/**
 * Generate a spite object.
 */
export function generateSprite(texture: Texture, options?: Record<string, string | number>): Sprite {
	const sprite: Sprite = new Sprite();
	sprite.texture = texture;

	for (let key in options) {
		const value = options[key];

		if (key.indexOf("scale") > -1) {
			const newScale = { x: sprite.scale.x, y: sprite.scale.y };

			if (key.indexOf("Y") > -1) newScale.y = Number(value);

			sprite.scale.set(newScale.x, newScale.y);
		} else {
			// @ts-expect-error
			sprite[key] = value;
		};
	};

	return sprite;
};


