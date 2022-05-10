import { WIDTH, HEIGHT, FPS } from "./config";
import { ECS } from "./Engine/ECS";
import {Entity} from './Engine/Entity';
import { Game } from "./Engine/Game";
import { MazeGameScene } from "./MazeGameScene";
import { Position } from "./Position";
import { StartMenuScene } from "./StartMenuScene";

let temp = new ECS();

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

if(ctx === null) {
    alert('Canvas context not found! Contact admin.')
} 

const game = new Game(ctx);
const menuScene = new StartMenuScene();
const gameScene = new MazeGameScene()

const mainMenuIndex = game.addScene(menuScene);
const gameIndex = game.addScene(gameScene);

menuScene.sceneIndex = gameIndex;
gameScene.sceneIndex = mainMenuIndex;


let secondsPassed : number;
let oldTimeStamp : number;
let fps : number;

function gameLoop(timeStamp : number) {
    // Calculate the number of seconds passed since the last frame
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    fps = Math.round(1 / secondsPassed);

    // reset background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // game engine operations
    game.update();

    // Draw FPS
    ctx.font = '12px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText("FPS: " + fps, WIDTH-60, 30);

    window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);