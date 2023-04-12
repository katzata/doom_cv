export const floorTextures = {
    floor: {
        normal: {
            name: "hex_tile",
            options: {
                x: 0,
                y: 0/* floorY */,
                width: 200/* this.width */,
                height: 200/* floorHeight */,
                scaleY: 1/* floorScaleY */
            }
        },
        alt: {
            name: "snakes",
            x: 0,
            y: 0/* floorY */,
            width: 0/* this.width */,
            height: 0/* floorHeight */,
            scaleY: 0/* floorScaleY + .14 */
        }
    },
    topSide: {
        normal: {
            name: "wall_border_skulls",
            options: {
            // y: 0/* borderTopY - Math.floor(24 * (borderTopScaleY + 0.18)) */,
            width: 200/* this.width */,
            height: 24,
            scaleY: 1/* borderTopScaleY + 0.18 */},
        },
        alt: {
            name: "wall_border_flesh_pipes_s_0",
            x: 0,
            y: 0/* borderTopY - Math.floor(24 * (borderTopScaleY + 0.18)) */,
            width: 0/* this.width */,
            height: 24,
            scaleY: 1/* borderTopScaleY + 0.18 */,
        }
    },
    side2: {
        normal: {
            name: "wall_border_mini_skulls",
            options: {
                x: 0,
                y: 0/* borderTopY */,
                width: 0/* this.width */,
                height: 31,
                scaleY: 1/* 1 - (borderScaleY - borderTopScaleY) */
            },
        },
        alt: {
            name: "wall_border_pulled_flesh++",
            x: 0,
            y: 0/* borderTopY */,
            width: 0/* this.width */,
            height: 31,
            scaleY: 1/* 1 - (borderScaleY - borderTopScaleY) */,
        }
    },
    side3: {
        normal: {
            name: "wall_border_skulls",
            x: 0,
            y: 0/* borderBottomY */,
            width: 0/* this.width */,
            height: 24,
            scaleY: 1/* borderScaleY */
        },
        alt: {
            name: "wall_border_flesh_pipes_s_1",
            x: 0,
            y: 0/* borderBottomY */,
            width: 0/* this.width */,
            height: 24,
            scaleY: 1/* borderScaleY */
        }
    },
    side4: {
        normal: {
            name: "wall_border",
            x: 0,
            y: 0/* borderBottomY + 24 * borderScaleY */,
            width: 0/* this.width */,
            height: 32
        },
        alt: {
            name: "wall_border_flesh_pipes_l",
            x: 0,
            y: 0/* borderBottomY + 24 * borderScaleY */,
            width: 0/* this.width */,
            height: 32
        }
    }
};