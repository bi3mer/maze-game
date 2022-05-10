import { ECSScene } from "./Engine/ECSScene";
import { Game } from "./Engine/Game";
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

    public update(game: Game): number {
        game.ctx.font = '40px Arial';
        game.ctx.fillStyle = 'white'
        game.ctx.fillText('Game scene', game.width/3.5, game.height/2);
        return -1;
    }
}