import { WIDTH, HEIGHT } from "./config";
import { ECSScene } from "./Engine/ECSScene";
import { Key } from "./Engine/Key";

export class MazeGameScene extends ECSScene {
    public sceneIndex: number = 0;

    constructor() {
        super();
    }

    public onEnter(): void {
        throw new Error("Method not implemented.");
    }
    public onExit(): void {
        throw new Error("Method not implemented.");
    }

    public update(canvas: CanvasRenderingContext2D, keyPresses: Set<Key>): number {
        canvas.font = '40px Arial';
        canvas.fillStyle = 'white'
        canvas.fillText('Game scene', WIDTH/3.5, HEIGHT/2);
        return -1;
    }
}