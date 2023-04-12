import { DisplayObject, Sprite, Container } from "pixi.js";

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

export function scaleProportionately(currentWidth:number, currentHeight: number, initialWidth: number, initialHeight: number, ...targets: DisplayObject[]): void {
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
