import { ECSScene } from "../Engine/ECSScene";
import { Game } from "../Engine/Game";
import { Position } from "../Components/Position";
import { RenderSystem } from "../Systems/RenderSystem";
import { Render } from "../Components/Render";
import { getMaze } from "../MazeGenerator";


export class MazeGameScene extends ECSScene {
    public sceneIndex: number = 0;
    private size: number = 20;

    constructor() {
        super();
    }

    public onEnter(): void {
        const grid = getMaze(this.size);

        for (let y = 0; y < this.size; ++y) {
            for(let x = 0; x < this.size; ++x) {
                if(grid[y][x]) {
                    const blockID = this.addEntity();
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