export const floorSettings = {
    floor: {
        scaleY: 0.24
    },
    topRailTop: {
        scaleY: 0.52
    },
    topRailSide: {
        scaleY: 1,
        y: 11.5
    },
    bottomRailTop: {
        scaleY: 0.52,
        y: 88
    },
    bottomRailSide: {
        scaleY: 1,
        y: 88
    },
};

export const floorTextures = {
    floor: {
        normal: ["hex_tile_0", "hex_tile_1"],
        alt: ["wall_meat_0", "wall_meat_1"]
    },
    topRailTop: {
        normal: "wall_border_skulls",
        alt: "wall_border_flesh_pipes_s_0"
    },
    topRailSide: {
        normal: "wall_border_mini_skulls",
        alt: "wall_border_pulled_flesh"
    },
    bottomRailTop: {
        normal: "wall_border_skulls",
        alt: "wall_border_flesh_pipes_s_1"
    },
    bottomRailSide: {
        normal: "wall_border",
        alt: "wall_border_flesh_pipes_l"
    }
};