import { settings, Application, Sprite, Texture, Graphics } from "pixi.js";
import Scene from "./Scene";
import { Debug } from "../utils/debug";
import { scaleProportionately, centerObjects } from "../utils/misc";
import AssetLoader from "./AssetLoader";
import config from "../config";

interface Props {
  background?: string;
  overlay?: Overlay;
};

interface Overlay {
  color: string | number,
  alpha: number
};

if (import.meta.env.DEV) Debug.init();

export interface SceneUtils {
  assetLoader: AssetLoader;
};

export default class SceneManager {
  private sceneConstructors = this.importScenes();

  app: Application;
  sceneInstances = new Map<string, Scene>();
  currentScene?: Scene;
  background: Sprite = new Sprite();
  backgroundWidth: number = 0;
  backgroundHeight: number = 0;
  overlay: Graphics = new Graphics();

  constructor({ background, overlay }: Props) {
    this.app = new Application({
      view: document.querySelector("#app") as HTMLCanvasElement,
      width: config.viewport.width,
      height: config.viewport.height,
      resizeTo: window,
      autoDensity: true,
		  powerPreference: "high-performance",
      backgroundColor: 0x303030
    });

    if (background) {
      this.addBackground(background).then(() => {
        if (overlay) {
          this.addOverlay(overlay);
        };
      });
    };

    window.addEventListener("resize", (ev: UIEvent) => {
      const { innerWidth, innerHeight} = ev.target as Window;
      scaleProportionately(innerWidth, innerHeight, this.backgroundWidth, this.backgroundHeight, this.background);
      centerObjects(innerWidth, innerHeight, this.background);
      this.currentScene?.onResize?.(innerWidth, innerHeight);
    });
  }

  importScenes() {
    const sceneModules = import.meta.glob("/src/scenes/*.ts", {
      eager: true,
    }) as Record<string, { default: ConstructorType<typeof Scene> }>;

    return Object.entries(sceneModules).reduce((acc, [path, module]) => {
      const fileName = path.split("/").pop()?.split(".")[0];

      if (!fileName) throw new Error("Error while parsing filename");

      acc[fileName] = module.default;

      return acc;
    }, {} as Record<string, ConstructorType<typeof Scene>>);
  }

  private addBackground(background: string): Promise<void> {
    // console.log(background);

    const bgTexture = Texture.fromURL(background);

    return bgTexture.then((res: Texture) => {
      // console.log(this.background, res.width, res.height);
      this.backgroundWidth = res.width;
      this.backgroundHeight = res.height;
      this.background.texture = res;

      scaleProportionately(innerWidth, innerHeight, this.backgroundWidth, this.backgroundHeight, this.background);
      this.app.stage.addChild(this.background);
    });
  };

  private addOverlay({ color, alpha }: Overlay): void {
    this.overlay.beginFill(Number(color), alpha);
    // this.overlay.alpha.set(opacity);
    this.overlay.drawRect(0, 0, this.backgroundWidth, this.backgroundHeight);
    this.app.stage.addChild(this.overlay);
  };

  async switchScene(sceneName: string, deletePrevious = true): Promise<Scene> {
    await this.removeScene(deletePrevious);

    this.currentScene = this.sceneInstances.get(sceneName);

    if (!this.currentScene) this.currentScene = await this.initScene(sceneName);

    if (!this.currentScene)
      throw new Error(`Failed to initialize scene: ${sceneName}`);

    this.app.stage.addChild(this.currentScene);

    if (this.currentScene.start) await this.currentScene.start();

    return this.currentScene;
  }

  private async removeScene(destroyScene: boolean) {
    if (!this.currentScene) return;

    if (destroyScene) {
      this.sceneInstances.delete(this.currentScene.name);

      this.currentScene.destroy({ children: true });
    } else {
      this.app.stage.removeChild(this.currentScene);
    }

    if (this.currentScene.unload) await this.currentScene.unload();

    this.currentScene = undefined;
  }

  private async initScene(sceneName: string) {
    settings.ROUND_PIXELS = true;
    console.log(settings.ROUND_PIXELS);

    const sceneUtils = {
      assetLoader: new AssetLoader(),
    };

    const scene = new this.sceneConstructors[sceneName](sceneUtils);

    this.sceneInstances.set(sceneName, scene);

    if (scene.load) await scene.load();

    return scene;
  }
}
