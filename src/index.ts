import { StartMenuScene } from "./Scenes/StartMenuScene";
import { MazeGameScene } from "./Scenes/MazeGameScene";
import { Game } from "./Engine/Game";
import { GameOverScene } from "./Scenes/GameOverScene";

const game = new Game();
const menuScene = new StartMenuScene();
const gameScene = new MazeGameScene()
const gameOverScene = new GameOverScene();

const mainMenuIndex = game.addScene(menuScene);
const gameIndex = game.addScene(gameScene);
const gameOverIndex = game.addScene(gameOverScene);

menuScene.sceneIndex = gameIndex;
gameScene.sceneIndex = gameOverIndex;
gameOverScene.sceneIndex = mainMenuIndex;

game.start();