import { Container, Sprite, Texture, Ticker } from "pixi.js";
import { floorTextures } from "./config";

export default class Floor extends Container {
    private topRail: Sprite = new Sprite();
    private floorRail: Sprite = new Sprite();
    private bottomRail: Sprite = new Sprite();
    levelWidth: number;
    constructor(width: number) {
        super();
        this.levelWidth = width;
        const {floor, topSide, side2, side3, side4 } = floorTextures;
        const test = Object.entries(floorTextures);

        console.log(test);

        // const borderScaleY = 0.45;
		// const borderTopScaleY = 0.33;
		// const floorScaleY = 0.24;
		// const floorHeight = 192;
		// const borderTopY = floorY - 27;
		// const borderBottomY = Math.floor(floorY + floorHeight * floorScaleY);

        // this.renderFloor("normal", width);
        // for (let i = 0; i < test.length; i++) {
        //     // console.log(test[i]);
        // };

        // const topRailTop = Texture.from(topSide.normal.name, topSide.normal.options);
        // this.renderMultipleTiles(topRailTop, width, 0);

        // const topRailSide = Texture.from(side2.normal.name, side2.normal.options);
        // this.renderMultipleTiles(topRailSide, width, 24);
        // const topRailTopSide = this.renderMultipleTiles(topSide.normal);
        // console.log(width);

        this.renderFloorTiles();
        this.monitorTilesOffset();
        console.log(this);

    };

    public renderFloor(floorType: "normal" | "alt" = "normal", width: number): void {
        const test = Object.values(floorTextures);
        let prevItemHeight = 0;
        for (let i = 0; i < test.length; i++) {
            console.log(test[i][floorType]);
            const spriteGroup = Texture.from(test[i][floorType].name);

            console.log(spriteGroup.height);
            this.renderMultipleTiles(spriteGroup, width, prevItemHeight);
            prevItemHeight += spriteGroup.height;
        };
    };

    private renderFloorTiles(): void {
        console.log(this.levelWidth);
        console.log("x");

        this.renderMultipleTiles(Texture.from(floorTextures.floor.normal.name), this.levelWidth, 0);
    };

    private renderMultipleTiles(texture: Texture, width: number, y: number) {
        for (let i = 0; i < Math.floor(width / texture.width) + 3; i++) {
            const sprite = new Sprite();
            sprite.texture = texture;
            sprite.x = (i * texture.width);
            sprite.y = y;
            this.addChild(sprite);
        };
	};

    private monitorTilesOffset() {
        let seconds = 0;

        Ticker.shared.add((delta) => {
            seconds += (1 / 60) * delta;
            // console.log(this.x);

            for (const child of this.children) {
                if (Math.abs(this.x) > child.x + (child as Sprite).width) {
                    child.x = child.x + this.levelWidth + (child as Sprite).width;
                };

                if (Math.abs(this.x - this.levelWidth - (child as Sprite).width) < child.x + (child as Sprite).width) {
                    // console.log(this.levelWidth);
                    child.x = child.x - (this.levelWidth + child.width);
                };
                // console.log(child.x);
            }
      });
    };
};