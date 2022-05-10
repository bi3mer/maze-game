import { Game } from "./Game";
import { Scene } from "./Scene";

export abstract class ECSScene extends Scene {
    /**
     * Default return -1. Any other numbers will tell the game engine to change 
     * the scene to whatever index is returned.
     * @param canvas 
     * @param keyPresses 
     */
    public abstract update(game: Game): number;
};