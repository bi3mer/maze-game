import { Collider } from "../Components/Collider";
import { Player } from "../Components/Player";
import { Position } from "../Components/Position";
import { Render } from "../Components/Render";
import { Entity } from "../Engine/Entity";
import { Game } from "../Engine/Game";
import { Key } from "../Engine/Key";
import { System } from "../Engine/System";

export class PlayerColliderSystem extends System {
  componentsRequired = new Set<Function>([Position, Render, Collider]);
  private playerID: number;

  constructor(playerID: number) {
    super();
    this.playerID = playerID;
  }

  update(game: Game, entities: Set<Entity>): void {
    const playerPos = this.ecs.getComponents(this.playerID).get(Position);
    let collisionFound = false;
    for(let id of entities) {
      const blockPos = this.ecs.getComponents(id).get(Position);
      if(playerPos.equals(blockPos)) {
        playerPos.x = playerPos.oldX;
        playerPos.y = playerPos.oldY;
        collisionFound = true;
        break;
      }
    }

    if (!collisionFound) {
      playerPos.oldX = playerPos.x;
      playerPos.oldY = playerPos.y;
    }
    
  }
}