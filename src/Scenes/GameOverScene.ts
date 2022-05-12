import { Game } from "../Engine/Game";
import { Key } from "../Engine/Key";
import { Scene } from "../Engine/Scene";

export class GameOverScene extends Scene {
    public sceneIndex: number = 0;

    constructor() {
        super();
    }

    public onEnter(): void { }
    public onExit(): void { }

    public update(game: Game): number {
        // I ned delta and to time
        game.ctx.font = '40px Arial';
        game.ctx.fillStyle = 'white'
        game.ctx.fillText('You Won! Nice!', game.width/3.5, game.height/2);
        return -1;
    }
}