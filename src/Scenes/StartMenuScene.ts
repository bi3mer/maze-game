import { Game } from "../Engine/Game";
import { Key } from "../Engine/Key";
import { Scene } from "../Engine/Scene";

export class StartMenuScene extends Scene {
    public sceneIndex: number = 0;

    constructor() {
        super();
    }

    public onEnter(): void { }
    public onExit(): void { }

    public update(game: Game): number {
        if (game.keyDown.has(Key.SPACE)) {
            return this.sceneIndex;
        } else {
            game.ctx.font = '40px Arial';
            game.ctx.fillStyle = 'white'
            game.ctx.fillText('Press Space to Play', game.width/3.5, game.height/2);
            return -1;
        }
    }
}