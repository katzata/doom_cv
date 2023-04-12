import { Container, Sprite, Texture } from "pixi.js";
import { floorTextures } from "./config";

export default class Floor extends Container {
    private topRail: Sprite = new Sprite();
    private floorRail: Sprite = new Sprite();
    private bottomRail: Sprite = new Sprite();

    constructor(width: number) {
        super();
        const {floor, topSide, side2, side3, side4 } = floorTextures;
        const test = Object.entries(floorTextures);
        // const borderScaleY = 0.45;
		// const borderTopScaleY = 0.33;
		// const floorScaleY = 0.24;
		// const floorHeight = 192;
		// const borderTopY = floorY - 27;
		// const borderBottomY = Math.floor(floorY + floorHeight * floorScaleY);

        this.renderFloor("normal", width);
        // for (let i = 0; i < test.length; i++) {
        //     // console.log(test[i]);
        // };

        // const topRailTop = Texture.from(topSide.normal.name, topSide.normal.options);
        // this.renderMultipleTiles(topRailTop, width, 0);

        // const topRailSide = Texture.from(side2.normal.name, side2.normal.options);
        // this.renderMultipleTiles(topRailSide, width, 24);
        // const topRailTopSide = this.renderMultipleTiles(topSide.normal);
        // console.log(width);
    };

    public renderFloor(floorType: "normal" | "alt" = "normal", width: number) {
        const test = Object.values(floorTextures);

        for (let i = 0; i < test.length; i++) {
            console.log(test[i][floorType]);
            const spriteGroup = Texture.from(test[i][floorType].name);
            this.renderMultipleTiles(spriteGroup, width, 0);
        };
    };

    private renderMultipleTiles(texture: Texture, width: number, y: number) {
        for (let i = 0; i < Math.floor(width / texture.width) + 2; i++) {
            const sprite = new Sprite();
            sprite.texture = texture;
            sprite.x = i * texture.width;
            sprite.y = y;
            this.addChild(sprite);
        };
	};
};