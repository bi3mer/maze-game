import { WIDTH, HEIGHT } from "./config";
import { Key } from "./Engine/Key";
import { Scene } from "./Engine/Scene";

export class StartMenuScene extends Scene {
    public sceneIndex: number = 0;

    constructor() {
        super();
    }

    public onEnter(): void { }
    public onExit(): void { }

    public update(canvas: CanvasRenderingContext2D, keyPresses: Set<Key>): number {
        if (keyPresses.has(Key.SPACE)) {
            return this.sceneIndex;
        } else {
            canvas.font = '40px Arial';
            canvas.fillStyle = 'white'
            canvas.fillText('Press Start to Play', WIDTH/3.5, HEIGHT/2);
            return -1;
        }
    }
}