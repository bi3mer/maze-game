import { Player } from "../Components/Player";
import { Position } from "../Components/Position";
import { Render } from "../Components/Render";
import { Entity } from "../Engine/Entity";
import { Game } from "../Engine/Game";
import { Key } from "../Engine/Key";
import { System } from "../Engine/System";

export class PlayerSystem extends System {
  componentsRequired = new Set<Function>([Position, Render, Player]);
  private size: number;

  constructor(size: number) {
    super();
    this.size = size;
  }

  update(game: Game, entities: Set<Entity>): void {
    if(entities.size > 1) {
      alert('fatal error: there should not be more than one player!');
      return;
    }

    let playerID = entities.values().next().value;
    let pos = this.ecs.getComponents(playerID).get(Position);
    const x = pos.x;
    const y = pos.y;

    for(let key of game.keyPress) {
      switch(key) {
        case Key.A:
        case Key.LEFT:
          pos.x -= 1;
          if(pos.x < 0) {
            pos.x = x;
          }
          break;
        case Key.S:
        case Key.DOWN:
          pos.y += 1;
          if(pos.y >= this.size) {
            pos.y = y;
          }
          break;
        case Key.D:
        case Key.RIGHT:
          pos.x += 1
          if (pos.x >= this.size) {
            pos.x = x;
          }
          break;
        case Key.W:
        case Key.UP:
          pos.y -= 1;
          if(pos.y < 0) {
            pos.y = y;
          }
          break;
        // nothing to do in the default case
      }
    }
  }
}