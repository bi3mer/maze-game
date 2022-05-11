import { ECSScene } from "../Engine/ECSScene";
import { Game } from "../Engine/Game";
import { Position } from "../Components/Position";
import { Render } from "../Components/Render";
import { RenderSystem } from "../Systems/RenderSystem";

export class MazeGameScene extends ECSScene {
    public sceneIndex: number = 0;
    private size: number = 20;

    constructor() {
        super();
    }

    public onEnter(): void {
        for (let x = 0; x < this.size; ++x) {
            for (let y = 0; y < this.size; ++y) {
                if (Math.random() > 0.5) {
                    const blockID = this.addEntity()
                    this.addComponent(blockID, new Position(x, y));
                    this.addComponent(blockID, new Render('white'));
                }
            }
        }

        this.addSystem(new RenderSystem());
    }
    
    public onExit(): void {
        this.clear();
    }

    public customUpdate(game: Game): number {
        return -1;
    }
}