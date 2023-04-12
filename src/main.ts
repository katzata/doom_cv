import SceneManager from "./core/SceneManager";

const background: string = "/App_bg/images/app_background2.png";
const overlay: { color: string | number, alpha: number } = { color: "black", alpha: 0.65 };

const sceneManager = new SceneManager({ background, overlay });

await sceneManager.switchScene("Loading");
await sceneManager.switchScene("Game");
