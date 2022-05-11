import { StartMenuScene } from "./Scenes/StartMenuScene";
import { MazeGameScene } from "./Scenes/MazeGameScene";
import { Game } from "./Engine/Game";

const game = new Game();
const menuScene = new StartMenuScene();
const gameScene = new MazeGameScene()

const mainMenuIndex = game.addScene(menuScene);
const gameIndex = game.addScene(gameScene);

menuScene.sceneIndex = gameIndex;
gameScene.sceneIndex = mainMenuIndex;

game.start();