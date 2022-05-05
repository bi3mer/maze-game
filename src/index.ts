import { WIDTH, HEIGHT, FPS } from "./config";


const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

if(ctx === null) {
    alert('Canvas context not found! Contact admin.')
} 

let secondsPassed : number;
let oldTimeStamp : number;
let fps : number;

function gameLoop(timeStamp : number) {
    // Calculate the number of seconds passed since the last frame
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    fps = Math.round(1 / secondsPassed);

    // reset background
    ctx!.fillStyle = 'black';
    ctx!.fillRect(0, 0, WIDTH, HEIGHT);

    // game engine operations
    // update

    // Draw FPS
    ctx!.font = '12px Arial';
    ctx!.fillStyle = 'red';
    ctx!.fillText("FPS: " + fps, WIDTH-60, 30);

    window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);