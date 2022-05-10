import { Game } from "./Game";

export abstract class Scene {
    /**
     * Default return -1. Any other numbers will tell the game engine to change 
     * the scene to whatever index is returned.
     * @param canvas 
     * @param keyPresses 
     */
    public abstract update(game: Game): number;

    public abstract onEnter(): void;
    public abstract onExit(): void;
};