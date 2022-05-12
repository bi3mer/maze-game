import { ECSScene } from "../Engine/ECSScene";
import { Game } from "../Engine/Game";
import { Position } from "../Components/Position";
import { RenderSystem } from "../Systems/RenderSystem";
import { Render } from "../Components/Render";
import { getMaze } from "../MazeGenerator";
import { Player } from "../Components/Player";
import { PlayerSystem } from "../Systems/PlayerSystem";
import { Collider } from "../Components/Collider";
import { PlayerColliderSystem } from "../Systems/PlayerColliderSystem";

export class MazeGameScene extends ECSScene {
  public sceneIndex: number = 0;
  private size: number = 20;
  private playerID: number = 0;

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
          this.addComponent(blockID, new Render('white', 0, 1));
          this.addComponent(blockID, new Collider());
        } else if(x === this.size - 1 && y == this.size - 1) {
          const blockID = this.addEntity();
          this.addComponent(blockID, new Position(x, y));
          this.addComponent(blockID, new Render('green', 0, 1));
        }
      }
    }

    // I need some kind of render order. Right now, this only works because
    // I add the player last. Otherwise, the blocks would be rendered over 
    // the player.
    this.playerID = this.addEntity();
    this.addComponent(this.playerID, new Position(0,0));
    this.addComponent(this.playerID, new Render('red', 0.2, 0.5));
    this.addComponent(this.playerID, new Player());

    this.addSystem(new PlayerSystem(this.size));
    this.addSystem(new PlayerColliderSystem(this.playerID));
    this.addSystem(new RenderSystem());
  }
  
  public onExit(): void {
    this.clear();
  }

  public customUpdate(game: Game): number {
    const playerPos = this.getComponents(this.playerID).get(Position);
    if (playerPos.x == this.size - 1 && playerPos.y == this.size - 1) {
      return this.sceneIndex;
    }
    return -1;
  }
}