import { Key, keyCodeToKey } from "./Key";
import { Scene } from "./Scene";

export class Game {
  private scenes = new Array<Scene>();
  private sceneIndex: number = 0;
  public readonly ctx: CanvasRenderingContext2D;;
  public readonly keyDown = new Set<Key>();
  public readonly keyPress = new Set<Key>();
  public readonly width: number;
  public readonly height: number;
  public delta: number;

  constructor() {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      const k = keyCodeToKey(e.key);
      if(!this.keyDown.has(k)) {
        this.keyDown.add(k)
      }
    });

    window.addEventListener('keyup', (e: KeyboardEvent) => {
      const k = keyCodeToKey(e.key);
      this.keyDown.delete(k);
    });

    window.addEventListener('keypress', (e: KeyboardEvent) => {
      this.keyPress.add(keyCodeToKey(e.key))
    });

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.ctx = canvas.getContext("2d")!;

    this.width = canvas.width;
    this.height = canvas.height;
    this.delta = 0;
  }

  public addScene(scene: Scene): number {
    this.scenes.push(scene);
    return this.scenes.length - 1;
  }

  public start(): void {
    let oldTimeStamp : number;
    let fps : number;

    const gameLoop = (timeStamp : number) => {
      // Calculate the number of seconds passed since the last frame
      this.delta = (timeStamp - oldTimeStamp) / 1000;
      oldTimeStamp = timeStamp;
      fps = Math.round(1 / this.delta);

      // reset background
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(0, 0, this.width, this.height);

      // game engine operations
      this.update();

      // Draw FPS
      this.ctx.font = '12px Arial';
      this.ctx.fillStyle = 'red';
      this.ctx.fillText("FPS: " + fps, this.width-60, 30);

      window.requestAnimationFrame(gameLoop);
    }

    window.requestAnimationFrame(gameLoop);
  }

  private update(): void {
    const i = this.scenes[this.sceneIndex].update(this);
    if (i !== -1) {
      this.scenes[this.sceneIndex].onExit();
      this.sceneIndex = i
      this.scenes[this.sceneIndex].onEnter();
    }

    this.keyPress.clear();
  }
}