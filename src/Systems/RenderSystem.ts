import { Position } from "../Components/Position";
import { Render } from "../Components/Render";
import { Entity } from "../Engine/Entity";
import { Game } from "../Engine/Game";
import { System } from "../Engine/System";

export class RenderSystem extends System {
    componentsRequired = new Set<Function>([Position, Render]);

    public entitiesSeenLastUpdate: number = -1

    update(game: Game, entities: Set<Entity>): void {
        const xMod = game.width/20;
        const yMod = game.height/20;

        for(let entity of entities.values()) {
            game.ctx.fillStyle = this.ecs.getComponents(entity).get(Render).color;
            const pos = this.ecs.getComponents(entity).get(Position);
            game.ctx.fillRect(pos.x*xMod, pos.y*yMod, xMod, yMod);
        }
    }
}