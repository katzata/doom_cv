import { Container, Graphics, Sprite, Texture, Ticker } from "pixi.js";
import { floorSettings, floorTextures } from "./config";
import { getEntries, generateMultipleTiles } from "../../utils/misc";

interface Row extends Container {
    spriteGroupId: string;
};

interface Tile extends Sprite {
    floorType: string;
};

export default class Floor extends Container {
    private levelWidth: number;
    private floorSettings = floorSettings;

    topRailTop: Container = new Container();
    topRailSide: Container = new Container();
    bottomRailTop: Container = new Container();
    bottomRailSide: Container = new Container();
    floorType: "normal" | "alt" = "normal";

    constructor(width: number) {
        super();
        this.levelWidth = width;

        const floorTiles = this.generateFloorTiles();
        this.addChild(floorTiles);

        const textures = Object.entries(floorTextures);
        let offsetY = 0;

        for (let i = 1; i < textures.length; i++) {
            const [spriteGroup, sprites] = textures[i];
            const singleTexture = Texture.from(sprites.normal);

            // @ts-expect-error
            const spriteTiles = generateMultipleTiles({ singleTexture }, width, offsetY, this.floorSettings[spriteGroup]);
            if (spriteGroup === "bottomRailTop") spriteTiles.map(this.flipSpriteY);
            // @ts-expect-error
            this[spriteGroup].spriteGroupId = spriteGroup;
            // @ts-expect-error
            this[spriteGroup].addChild(...spriteTiles);
            // @ts-expect-error
            this.addChild(this[spriteGroup]);

            offsetY += singleTexture.height;
        };

        // const dimmer = new Graphics();
        // dimmer.beginFill(0x000000);
        // dimmer.alpha = .25;
        // dimmer.drawRect(0, 0, this.width, this.height);

        // this.addChild(dimmer);
        this.monitorPlayerOffset();

        window.onclick = () => {
            this.changeFloorTextures(this.floorType === "alt" ? "normal" : "alt");
        };
    };

    /**
     * Render the floor hex tiles.
     * Randomize the floor tiles.
     */
    private generateFloorTiles(): Row {
        const normalTile = Texture.from(floorTextures.floor.normal[0]);
        const randomTile = Texture.from(floorTextures.floor.normal[1]);
        const altTile = Texture.from(floorTextures.floor.alt[0]);
        const textureMap = [...Array(((this.levelWidth / normalTile.width) + 2))];
        const randomizeTiles = () => Math.random() < .8 ? 0 : 1;
        const floorContainer = (new Container() as Row);
        floorContainer.spriteGroupId = "floor";

        const normalTileMap = {
            textures: [ normalTile, randomTile ],
            textureMap: textureMap
        };

        const options = {
            scaleY: floorSettings.topRailTop.scaleY,
            floorType: "alt",
        };

        floorContainer.addChild(...generateMultipleTiles({singleTexture: altTile}, this.levelWidth, 30 + (24 * floorSettings.topRailTop.scaleY), options));

        options.floorType = "normal";

        for (let i = 0; i < 2; i++) {
            normalTileMap.textureMap = textureMap.map(randomizeTiles);
            floorContainer.addChild(...generateMultipleTiles(normalTileMap, this.levelWidth, 28 + (24 * floorSettings.topRailTop.scaleY) + ((64 * floorSettings.topRailTop.scaleY) * i), options));
        };

        return floorContainer;
    };

    /**
     * Monitor the level offset and change the position of the two additional tiles.
     */
    private monitorPlayerOffset(): void {
        Ticker.shared.add(() => {
            for (const container of (this.children as Container[])) {
                for (const child of (container.children as Sprite[])) {
                    if (Math.abs(this.x) > child.x + child.width) {
                        child.x = child.x + this.levelWidth + child.width;
                    };

                    if (Math.abs(this.x - this.levelWidth - child.width) < child.x + child.width) {
                        child.x = child.x - (this.levelWidth + child.width);
                    };
                };
            };
        });
    };

    public changeFloorTextures(type: typeof this.floorType): void {
        this.floorType = type;

        for (const row of (this.children as Row[])) {
            const { spriteGroupId, children } = row;

            if (spriteGroupId === "floor") {
                for (const child of (children as Tile[])) {
                    child.alpha = this.floorType === child.floorType ? 1 : 0;
                };

                continue;
            };

            for (const sprite of children) {
                // @ts-expect-error
                const newTexture = floorTextures[spriteGroupId][type];
                const currentSprite = (sprite as Sprite);

                currentSprite.texture = Texture.from(newTexture);

                if (spriteGroupId === "bottomRailTop") {
                    this.flipSpriteY(currentSprite);
                };
            };
        };
    };

    private flipSpriteY(sprite: Sprite): void {
        const rotCheck = sprite.rotation === 0;

        sprite.rotation = rotCheck ? 3.1415926536 : 0;
        sprite.anchor.set(rotCheck ? 1 : 0, rotCheck ? 0 : 1);
    };
};