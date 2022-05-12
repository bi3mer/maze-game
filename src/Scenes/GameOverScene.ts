import { Game } from "../Engine/Game";
import { Scene } from "../Engine/Scene";

export class GameOverScene extends Scene {
  public sceneIndex: number = 0;
  public timer: number = 0;

  constructor() {
    super();
  }

  public onEnter(): void { 
    this.timer = 0;
  }
  
  public onExit(): void { }

  public update(game: Game): number {
    this.timer += game.delta
    if(this.timer > 2) {
      return this.sceneIndex;
    } else {
      game.ctx.font = '40px Arial';
      game.ctx.fillStyle = 'green'
      game.ctx.fillText('You Won! Nice!', game.width/3.5, game.height/2);
      return -1;
    }
  }
}