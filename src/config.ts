import type { BgConfig } from "./prefabs/ParallaxBackground";

type Config = {
	view: Record<string, number | string | boolean>;
	level: Record<string, number>;
	viewport: Record<string, number>;
};

const config: Config = {
	view: {
		autoDensity: true,
		powerPreference: "high-performance",
		backgroundColor: 0xA0A0A0,
		centerOnResize: true,
	},
	viewport: {
		width: 1280,
		height: 720,
		aspectRatio: 1280 / 720,
	},
	level: {
		scale: 1,
		aspectRatio: 2280 / 720,
		width: 2280,
		height: 720
	},
	// backgrounds: {
	// 	forest: {
	// 		layers: [
	// 			"sky",
	// 			"clouds_1",
	// 			"rocks",
	// 			"clouds_2",
	// 			"ground_1",
	// 			"ground_2",
	// 			"ground_3",
	// 			"plant",
	// 		],
	// 		panSpeed: 0.2,
	// 	},
	// }
}

export default config;

