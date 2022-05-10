import { Key, keyCodeToKey } from "./Key";
import { Scene } from "./Scene";

export class Game {
    private scenes = new Array<Scene>();
    public sceneIndex: number = 0;
    private canvas: CanvasRenderingContext2D;
    private keyDown = new Set<Key>();

    constructor(canvas: CanvasRenderingContext2D) {
        this.canvas = canvas;

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

    }

    public update(): void {
        const i = this.scenes[this.sceneIndex].update(this.canvas, this.keyDown);
        if (i !== -1) {
            this.scenes[this.sceneIndex].onExit();
            this.sceneIndex = i
            this.scenes[this.sceneIndex].onEnter();
        }
    }

    public addScene(scene: Scene): number {
        this.scenes.push(scene);
        return this.scenes.length - 1;
    }
}