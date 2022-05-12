/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Components/Collider.ts":
/*!************************************!*\
  !*** ./src/Components/Collider.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Collider = void 0;
const Component_1 = __webpack_require__(/*! ../Engine/Component */ "./src/Engine/Component.ts");
class Collider extends Component_1.Component {
    constructor() {
        super();
    }
}
exports.Collider = Collider;


/***/ }),

/***/ "./src/Components/Player.ts":
/*!**********************************!*\
  !*** ./src/Components/Player.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Player = void 0;
const Component_1 = __webpack_require__(/*! ../Engine/Component */ "./src/Engine/Component.ts");
class Player extends Component_1.Component {
    constructor() {
        super();
    }
}
exports.Player = Player;


/***/ }),

/***/ "./src/Components/Position.ts":
/*!************************************!*\
  !*** ./src/Components/Position.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Position = void 0;
const Component_1 = __webpack_require__(/*! ../Engine/Component */ "./src/Engine/Component.ts");
class Position extends Component_1.Component {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.oldX = x;
        this.oldY = y;
    }
    equals(other) {
        return this.x == other.x && this.y == other.y;
    }
}
exports.Position = Position;


/***/ }),

/***/ "./src/Components/Render.ts":
/*!**********************************!*\
  !*** ./src/Components/Render.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Render = void 0;
const Component_1 = __webpack_require__(/*! ../Engine/Component */ "./src/Engine/Component.ts");
class Render extends Component_1.Component {
    constructor(color, offset, size) {
        super();
        this.color = color;
        this.offset = offset;
        this.size = size;
    }
}
exports.Render = Render;


/***/ }),

/***/ "./src/Engine/Component.ts":
/*!*********************************!*\
  !*** ./src/Engine/Component.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComponentContainer = exports.Component = void 0;
class Component {
}
exports.Component = Component;
class ComponentContainer {
    constructor() {
        this.map = new Map();
    }
    add(component) {
        this.map.set(component.constructor, component);
    }
    get(componentClass) {
        return this.map.get(componentClass);
    }
    has(componentClass) {
        return this.map.has(componentClass);
    }
    hasAll(componentClasses) {
        for (let cls of componentClasses) {
            if (!this.map.has(cls)) {
                return false;
            }
        }
        return true;
    }
    delete(componentClass) {
        this.map.delete(componentClass);
    }
}
exports.ComponentContainer = ComponentContainer;


/***/ }),

/***/ "./src/Engine/ECSScene.ts":
/*!********************************!*\
  !*** ./src/Engine/ECSScene.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ECSScene = void 0;
const Scene_1 = __webpack_require__(/*! ./Scene */ "./src/Engine/Scene.ts");
const Component_1 = __webpack_require__(/*! ./Component */ "./src/Engine/Component.ts");
class ECSScene extends Scene_1.Scene {
    constructor() {
        super(...arguments);
        // Main state
        this.entities = new Map();
        this.systems = new Map();
        // Bookkeeping for entities.
        this.nextEntityID = 0;
        this.entitiesToDestroy = new Array();
    }
    /**
     * Default return -1. Any other numbers will tell the game engine to change
     * the scene to whatever index is returned.
     * @param canvas
     * @param keyPresses
     */
    update(game) {
        // Update all systems. (Later, we'll add a way to specify the
        // update order.)
        for (let [system, entities] of this.systems.entries()) {
            system.update(game, entities);
        }
        // Remove any entities that were marked for deletion during the
        // update.
        while (this.entitiesToDestroy.length > 0) {
            this.destroyEntity(this.entitiesToDestroy.pop());
        }
        return this.customUpdate(game);
    }
    // API: Entities
    addEntity() {
        let entity = this.nextEntityID;
        this.nextEntityID++;
        this.entities.set(entity, new Component_1.ComponentContainer());
        return entity;
    }
    /**
     * Marks `entity` for removal. The actual removal happens at the end
     * of the next `update()`. This way we avoid subtle bugs where an
     * Entity is removed mid-`update()`, with some Systems seeing it and
     * others not.
     */
    removeEntity(entity) {
        this.entitiesToDestroy.push(entity);
    }
    addComponent(entity, component) {
        this.entities.get(entity).add(component);
        this.checkE(entity);
    }
    getComponents(entity) {
        return this.entities.get(entity);
    }
    removeComponent(entity, componentClass) {
        var _a;
        (_a = this.entities.get(entity)) === null || _a === void 0 ? void 0 : _a.delete(componentClass);
        this.checkE(entity);
    }
    // API: Systems
    addSystem(system) {
        // Checking invariant: systems should not have an empty
        // Components list, or they'll run on every entity. Simply remove
        // or special case this check if you do want a System that runs
        // on everything.
        if (system.componentsRequired.size == 0) {
            console.warn('System not added: empty Components list.');
            console.warn(system);
            return;
        }
        // Give system a reference to the ECS so it can actually do
        // anything.
        system.ecs = this;
        // Save system and set who it should track immediately.
        this.systems.set(system, new Set());
        for (let entity of this.entities.keys()) {
            this.checkES(entity, system);
        }
    }
    /**
     * Note: I never actually had a removeSystem() method for the entire
     * time I was programming the game Fallgate (2 years!). I just added
     * one here for a specific testing reason (see the next post).
     * Because it's just for demo purposes, this requires an actual
     * instance of a System to remove (which would be clunky as a real
     * API).
     */
    removeSystem(system) {
        this.systems.delete(system);
    }
    clear() {
        this.entities.clear();
        this.systems.clear();
    }
    destroyEntity(entity) {
        this.entities.delete(entity);
        for (let entities of this.systems.values()) {
            entities.delete(entity); // no-op if doesn't have it
        }
    }
    // @TODO: can I remove this?
    checkE(entity) {
        for (let system of this.systems.keys()) {
            this.checkES(entity, system);
        }
    }
    /**
     * I think this can be removed but I'm going to leave it in for now.
     * @param entity
     * @param system
     */
    checkES(entity, system) {
        let have = this.entities.get(entity);
        let need = system.componentsRequired;
        if (have.hasAll(need)) {
            // should be in system
            this.systems.get(system).add(entity); // no-op if in
        }
        else {
            // should not be in system
            this.systems.get(system).delete(entity); // no-op if out
        }
    }
}
exports.ECSScene = ECSScene;
;


/***/ }),

/***/ "./src/Engine/Game.ts":
/*!****************************!*\
  !*** ./src/Engine/Game.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Game = void 0;
const Key_1 = __webpack_require__(/*! ./Key */ "./src/Engine/Key.ts");
class Game {
    constructor() {
        this.scenes = new Array();
        this.sceneIndex = 0;
        this.keyDown = new Set();
        this.keyPress = new Set();
        window.addEventListener('keydown', (e) => {
            const k = (0, Key_1.keyCodeToKey)(e.key);
            if (!this.keyDown.has(k)) {
                this.keyDown.add(k);
            }
        });
        window.addEventListener('keyup', (e) => {
            const k = (0, Key_1.keyCodeToKey)(e.key);
            this.keyDown.delete(k);
        });
        window.addEventListener('keypress', (e) => {
            this.keyPress.add((0, Key_1.keyCodeToKey)(e.key));
        });
        const canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
        this.delta = 0;
    }
    ;
    addScene(scene) {
        this.scenes.push(scene);
        return this.scenes.length - 1;
    }
    start() {
        let oldTimeStamp;
        let fps;
        const gameLoop = (timeStamp) => {
            // Calculate the number of seconds passed since the last frame
            this.delta = (timeStamp - oldTimeStamp) / 1000;
            oldTimeStamp = timeStamp;
            fps = Math.round(1 / this.delta);
            // reset background
            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(0, 0, this.width, this.height);
            // game engine operations
            this.update();
            // Draw FPS
            this.ctx.font = '12px Arial';
            this.ctx.fillStyle = 'red';
            this.ctx.fillText("FPS: " + fps, this.width - 60, 30);
            window.requestAnimationFrame(gameLoop);
        };
        window.requestAnimationFrame(gameLoop);
    }
    update() {
        const i = this.scenes[this.sceneIndex].update(this);
        if (i !== -1) {
            this.scenes[this.sceneIndex].onExit();
            this.sceneIndex = i;
            this.scenes[this.sceneIndex].onEnter();
        }
        this.keyPress.clear();
    }
}
exports.Game = Game;


/***/ }),

/***/ "./src/Engine/Key.ts":
/*!***************************!*\
  !*** ./src/Engine/Key.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.keyCodeToKey = exports.Key = void 0;
var Key;
(function (Key) {
    Key[Key["LEFT"] = 0] = "LEFT";
    Key[Key["RIGHT"] = 1] = "RIGHT";
    Key[Key["DOWN"] = 2] = "DOWN";
    Key[Key["UP"] = 3] = "UP";
    Key[Key["W"] = 4] = "W";
    Key[Key["A"] = 5] = "A";
    Key[Key["S"] = 6] = "S";
    Key[Key["D"] = 7] = "D";
    Key[Key["SPACE"] = 8] = "SPACE";
    Key[Key["ESCAPE"] = 9] = "ESCAPE";
    Key[Key["INVALID"] = 10] = "INVALID";
})(Key = exports.Key || (exports.Key = {}));
function keyCodeToKey(key) {
    switch (key) {
        case 'Down':
        case 'ArrowDown':
            return Key.LEFT;
        case 'Up':
        case 'ArrowUp':
            return Key.UP;
        case 'Right':
        case 'ArrowRight':
            return Key.RIGHT;
        case 'Left':
        case 'ArrowLeft':
            return Key.LEFT;
        case ' ':
        case 'Space':
            return Key.SPACE;
        case 'Escape':
            return Key.ESCAPE;
        case 'a':
            return Key.A;
        case 's':
            return Key.S;
        case 'd':
            return Key.D;
        case 'w':
            return Key.W;
        default:
            console.warn(`Unhandled key: ${key}.`);
            return Key.INVALID;
    }
}
exports.keyCodeToKey = keyCodeToKey;


/***/ }),

/***/ "./src/Engine/Scene.ts":
/*!*****************************!*\
  !*** ./src/Engine/Scene.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Scene = void 0;
class Scene {
}
exports.Scene = Scene;
;


/***/ }),

/***/ "./src/Engine/System.ts":
/*!******************************!*\
  !*** ./src/Engine/System.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.System = void 0;
class System {
}
exports.System = System;


/***/ }),

/***/ "./src/MazeGenerator.ts":
/*!******************************!*\
  !*** ./src/MazeGenerator.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getMaze = void 0;
function getValidNeighbors(size, pos, visited) {
    let neighbors = [
        [pos[0] + 1, pos[1]],
        [pos[0] - 1, pos[1]],
        [pos[0], pos[1] + 1],
        [pos[0], pos[1] - 1],
    ];
    let validNeighbors = [];
    for (let i = 0; i < neighbors.length; ++i) {
        const x = neighbors[i][0];
        const y = neighbors[i][1];
        if (x < 0 || x >= size || y < 0 || y >= size) {
            continue;
        }
        if (visited != null && visited.has(neighbors[i].join(','))) {
            continue;
        }
        validNeighbors.push(neighbors[i]);
    }
    return validNeighbors;
}
function getMaze(size) {
    // build the grid and initialize as true to represent that there exists
    // a wall.
    let grid = [];
    for (let x = 0; x < size; ++x) {
        let row = [];
        for (let y = 0; y < size; ++y) {
            row.push(true);
        }
        grid.push(row);
    }
    // top left and bottom right are always not walls.
    grid[0][0] = false;
    let visited = new Set();
    visited.add('0,0');
    let stack = [[0, 0]];
    while (stack.length != 0) {
        let currentPosition = stack.pop();
        // let stackIndex = Math.floor(Math.random() * stack.length);
        // let currentPosition = stack[stackIndex];
        // stack.splice(stackIndex,1);
        // get neighbors and validate that they fit in the bounds and are
        // not visited
        let validatedNeighbors = getValidNeighbors(size, currentPosition, visited);
        // for every valid neighbor, we need to further verify that there 
        // are at least three walls around. Otherwise, it can not be turned
        // into an empty cell
        let modifiableNeighbors = [];
        for (let i = 0; i < validatedNeighbors.length; ++i) {
            let accessibleNeighbors = getValidNeighbors(size, validatedNeighbors[i], null);
            let wallCount = 4 - accessibleNeighbors.length; // borders count as a wall
            for (let j = 0; j < accessibleNeighbors.length; ++j) {
                const x = accessibleNeighbors[j][0];
                const y = accessibleNeighbors[j][1];
                if (grid[y][x]) {
                    ++wallCount;
                }
            }
            if (wallCount > 2) {
                modifiableNeighbors.push(validatedNeighbors[i]);
            }
        }
        if (modifiableNeighbors.length == 0) {
            continue;
        }
        let randomNeighbor = modifiableNeighbors[Math.floor(Math.random() * modifiableNeighbors.length)];
        grid[randomNeighbor[1]][randomNeighbor[0]] = false;
        stack.push(currentPosition);
        stack.push(randomNeighbor);
        visited.add(randomNeighbor.join(','));
    }
    // if the bottom right is not reachable, remove walls till path is possible
    let pos = [size - 1, size - 1];
    while (grid[pos[1]][pos[0]]) {
        grid[pos[1]][pos[0]] = false;
        --pos[0];
    }
    return grid;
}
exports.getMaze = getMaze;


/***/ }),

/***/ "./src/Scenes/GameOverScene.ts":
/*!*************************************!*\
  !*** ./src/Scenes/GameOverScene.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameOverScene = void 0;
const Scene_1 = __webpack_require__(/*! ../Engine/Scene */ "./src/Engine/Scene.ts");
class GameOverScene extends Scene_1.Scene {
    constructor() {
        super();
        this.sceneIndex = 0;
        this.timer = 0;
    }
    onEnter() {
        this.timer = 0;
    }
    onExit() { }
    update(game) {
        this.timer += game.delta;
        if (this.timer > 2) {
            return this.sceneIndex;
        }
        else {
            game.ctx.font = '40px Arial';
            game.ctx.fillStyle = 'green';
            game.ctx.fillText('You Won! Nice!', game.width / 3.5, game.height / 2);
            return -1;
        }
    }
}
exports.GameOverScene = GameOverScene;


/***/ }),

/***/ "./src/Scenes/MazeGameScene.ts":
/*!*************************************!*\
  !*** ./src/Scenes/MazeGameScene.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MazeGameScene = void 0;
const ECSScene_1 = __webpack_require__(/*! ../Engine/ECSScene */ "./src/Engine/ECSScene.ts");
const Position_1 = __webpack_require__(/*! ../Components/Position */ "./src/Components/Position.ts");
const RenderSystem_1 = __webpack_require__(/*! ../Systems/RenderSystem */ "./src/Systems/RenderSystem.ts");
const Render_1 = __webpack_require__(/*! ../Components/Render */ "./src/Components/Render.ts");
const MazeGenerator_1 = __webpack_require__(/*! ../MazeGenerator */ "./src/MazeGenerator.ts");
const Player_1 = __webpack_require__(/*! ../Components/Player */ "./src/Components/Player.ts");
const PlayerSystem_1 = __webpack_require__(/*! ../Systems/PlayerSystem */ "./src/Systems/PlayerSystem.ts");
const Collider_1 = __webpack_require__(/*! ../Components/Collider */ "./src/Components/Collider.ts");
const PlayerColliderSystem_1 = __webpack_require__(/*! ../Systems/PlayerColliderSystem */ "./src/Systems/PlayerColliderSystem.ts");
class MazeGameScene extends ECSScene_1.ECSScene {
    constructor() {
        super();
        this.sceneIndex = 0;
        this.size = 20;
        this.playerID = 0;
    }
    onEnter() {
        const grid = (0, MazeGenerator_1.getMaze)(this.size);
        for (let y = 0; y < this.size; ++y) {
            for (let x = 0; x < this.size; ++x) {
                if (grid[y][x]) {
                    const blockID = this.addEntity();
                    this.addComponent(blockID, new Position_1.Position(x, y));
                    this.addComponent(blockID, new Render_1.Render('white', 0, 1));
                    this.addComponent(blockID, new Collider_1.Collider());
                }
                else if (x === this.size - 1 && y == this.size - 1) {
                    const blockID = this.addEntity();
                    this.addComponent(blockID, new Position_1.Position(x, y));
                    this.addComponent(blockID, new Render_1.Render('green', 0, 1));
                }
            }
        }
        // I need some kind of render order. Right now, this only works because
        // I add the player last. Otherwise, the blocks would be rendered over 
        // the player.
        this.playerID = this.addEntity();
        this.addComponent(this.playerID, new Position_1.Position(0, 0));
        this.addComponent(this.playerID, new Render_1.Render('red', 0.2, 0.5));
        this.addComponent(this.playerID, new Player_1.Player());
        this.addSystem(new PlayerSystem_1.PlayerSystem(this.size));
        this.addSystem(new PlayerColliderSystem_1.PlayerColliderSystem(this.playerID));
        this.addSystem(new RenderSystem_1.RenderSystem());
    }
    onExit() {
        this.clear();
    }
    customUpdate(game) {
        const playerPos = this.getComponents(this.playerID).get(Position_1.Position);
        if (playerPos.x == this.size - 1 && playerPos.y == this.size - 1) {
            return this.sceneIndex;
        }
        return -1;
    }
}
exports.MazeGameScene = MazeGameScene;


/***/ }),

/***/ "./src/Scenes/StartMenuScene.ts":
/*!**************************************!*\
  !*** ./src/Scenes/StartMenuScene.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StartMenuScene = void 0;
const Key_1 = __webpack_require__(/*! ../Engine/Key */ "./src/Engine/Key.ts");
const Scene_1 = __webpack_require__(/*! ../Engine/Scene */ "./src/Engine/Scene.ts");
class StartMenuScene extends Scene_1.Scene {
    constructor() {
        super();
        this.sceneIndex = 0;
    }
    onEnter() { }
    onExit() { }
    update(game) {
        if (game.keyDown.has(Key_1.Key.SPACE)) {
            return this.sceneIndex;
        }
        else {
            game.ctx.font = '40px Arial';
            game.ctx.fillStyle = 'white';
            game.ctx.fillText('Press Space to Play', game.width / 3.5, game.height / 2);
            return -1;
        }
    }
}
exports.StartMenuScene = StartMenuScene;


/***/ }),

/***/ "./src/Systems/PlayerColliderSystem.ts":
/*!*********************************************!*\
  !*** ./src/Systems/PlayerColliderSystem.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerColliderSystem = void 0;
const Collider_1 = __webpack_require__(/*! ../Components/Collider */ "./src/Components/Collider.ts");
const Position_1 = __webpack_require__(/*! ../Components/Position */ "./src/Components/Position.ts");
const Render_1 = __webpack_require__(/*! ../Components/Render */ "./src/Components/Render.ts");
const System_1 = __webpack_require__(/*! ../Engine/System */ "./src/Engine/System.ts");
class PlayerColliderSystem extends System_1.System {
    constructor(playerID) {
        super();
        this.componentsRequired = new Set([Position_1.Position, Render_1.Render, Collider_1.Collider]);
        this.playerID = playerID;
    }
    update(game, entities) {
        const playerPos = this.ecs.getComponents(this.playerID).get(Position_1.Position);
        let collisionFound = false;
        for (let id of entities) {
            const blockPos = this.ecs.getComponents(id).get(Position_1.Position);
            if (playerPos.equals(blockPos)) {
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
exports.PlayerColliderSystem = PlayerColliderSystem;


/***/ }),

/***/ "./src/Systems/PlayerSystem.ts":
/*!*************************************!*\
  !*** ./src/Systems/PlayerSystem.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerSystem = void 0;
const Player_1 = __webpack_require__(/*! ../Components/Player */ "./src/Components/Player.ts");
const Position_1 = __webpack_require__(/*! ../Components/Position */ "./src/Components/Position.ts");
const Render_1 = __webpack_require__(/*! ../Components/Render */ "./src/Components/Render.ts");
const Key_1 = __webpack_require__(/*! ../Engine/Key */ "./src/Engine/Key.ts");
const System_1 = __webpack_require__(/*! ../Engine/System */ "./src/Engine/System.ts");
class PlayerSystem extends System_1.System {
    constructor(size) {
        super();
        this.componentsRequired = new Set([Position_1.Position, Render_1.Render, Player_1.Player]);
        this.size = size;
    }
    update(game, entities) {
        if (entities.size > 1) {
            alert('fatal error: there should not be more than one player!');
            return;
        }
        let playerID = entities.values().next().value;
        let pos = this.ecs.getComponents(playerID).get(Position_1.Position);
        const x = pos.x;
        const y = pos.y;
        for (let key of game.keyPress) {
            switch (key) {
                case Key_1.Key.A:
                case Key_1.Key.LEFT:
                    pos.x -= 1;
                    if (pos.x < 0) {
                        pos.x = x;
                    }
                    break;
                case Key_1.Key.S:
                case Key_1.Key.DOWN:
                    pos.y += 1;
                    if (pos.y >= this.size) {
                        pos.y = y;
                    }
                    break;
                case Key_1.Key.D:
                case Key_1.Key.RIGHT:
                    pos.x += 1;
                    if (pos.x >= this.size) {
                        pos.x = x;
                    }
                    break;
                case Key_1.Key.W:
                case Key_1.Key.UP:
                    pos.y -= 1;
                    if (pos.y < 0) {
                        pos.y = y;
                    }
                    break;
                // nothing to do in the default case
            }
        }
    }
}
exports.PlayerSystem = PlayerSystem;


/***/ }),

/***/ "./src/Systems/RenderSystem.ts":
/*!*************************************!*\
  !*** ./src/Systems/RenderSystem.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RenderSystem = void 0;
const Position_1 = __webpack_require__(/*! ../Components/Position */ "./src/Components/Position.ts");
const Render_1 = __webpack_require__(/*! ../Components/Render */ "./src/Components/Render.ts");
const System_1 = __webpack_require__(/*! ../Engine/System */ "./src/Engine/System.ts");
class RenderSystem extends System_1.System {
    constructor() {
        super(...arguments);
        this.componentsRequired = new Set([Position_1.Position, Render_1.Render]);
    }
    update(game, entities) {
        const xMod = game.width / 20;
        const yMod = game.height / 20;
        for (let entity of entities.values()) {
            const render = this.ecs.getComponents(entity).get(Render_1.Render);
            const pos = this.ecs.getComponents(entity).get(Position_1.Position);
            game.ctx.fillStyle = render.color;
            game.ctx.fillRect(pos.x * xMod + xMod * render.offset, pos.y * yMod + yMod * render.offset, xMod * render.size, yMod * render.size);
        }
    }
}
exports.RenderSystem = RenderSystem;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const StartMenuScene_1 = __webpack_require__(/*! ./Scenes/StartMenuScene */ "./src/Scenes/StartMenuScene.ts");
const MazeGameScene_1 = __webpack_require__(/*! ./Scenes/MazeGameScene */ "./src/Scenes/MazeGameScene.ts");
const Game_1 = __webpack_require__(/*! ./Engine/Game */ "./src/Engine/Game.ts");
const GameOverScene_1 = __webpack_require__(/*! ./Scenes/GameOverScene */ "./src/Scenes/GameOverScene.ts");
const game = new Game_1.Game();
const menuScene = new StartMenuScene_1.StartMenuScene();
const gameScene = new MazeGameScene_1.MazeGameScene();
const gameOverScene = new GameOverScene_1.GameOverScene();
const mainMenuIndex = game.addScene(menuScene);
const gameIndex = game.addScene(gameScene);
const gameOverIndex = game.addScene(gameOverScene);
menuScene.sceneIndex = gameIndex;
gameScene.sceneIndex = gameOverIndex;
gameOverScene.sceneIndex = mainMenuIndex;
game.start();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tYXplLWdhbWUvLi9zcmMvQ29tcG9uZW50cy9Db2xsaWRlci50cyIsIndlYnBhY2s6Ly9tYXplLWdhbWUvLi9zcmMvQ29tcG9uZW50cy9QbGF5ZXIudHMiLCJ3ZWJwYWNrOi8vbWF6ZS1nYW1lLy4vc3JjL0NvbXBvbmVudHMvUG9zaXRpb24udHMiLCJ3ZWJwYWNrOi8vbWF6ZS1nYW1lLy4vc3JjL0NvbXBvbmVudHMvUmVuZGVyLnRzIiwid2VicGFjazovL21hemUtZ2FtZS8uL3NyYy9FbmdpbmUvQ29tcG9uZW50LnRzIiwid2VicGFjazovL21hemUtZ2FtZS8uL3NyYy9FbmdpbmUvRUNTU2NlbmUudHMiLCJ3ZWJwYWNrOi8vbWF6ZS1nYW1lLy4vc3JjL0VuZ2luZS9HYW1lLnRzIiwid2VicGFjazovL21hemUtZ2FtZS8uL3NyYy9FbmdpbmUvS2V5LnRzIiwid2VicGFjazovL21hemUtZ2FtZS8uL3NyYy9FbmdpbmUvU2NlbmUudHMiLCJ3ZWJwYWNrOi8vbWF6ZS1nYW1lLy4vc3JjL0VuZ2luZS9TeXN0ZW0udHMiLCJ3ZWJwYWNrOi8vbWF6ZS1nYW1lLy4vc3JjL01hemVHZW5lcmF0b3IudHMiLCJ3ZWJwYWNrOi8vbWF6ZS1nYW1lLy4vc3JjL1NjZW5lcy9HYW1lT3ZlclNjZW5lLnRzIiwid2VicGFjazovL21hemUtZ2FtZS8uL3NyYy9TY2VuZXMvTWF6ZUdhbWVTY2VuZS50cyIsIndlYnBhY2s6Ly9tYXplLWdhbWUvLi9zcmMvU2NlbmVzL1N0YXJ0TWVudVNjZW5lLnRzIiwid2VicGFjazovL21hemUtZ2FtZS8uL3NyYy9TeXN0ZW1zL1BsYXllckNvbGxpZGVyU3lzdGVtLnRzIiwid2VicGFjazovL21hemUtZ2FtZS8uL3NyYy9TeXN0ZW1zL1BsYXllclN5c3RlbS50cyIsIndlYnBhY2s6Ly9tYXplLWdhbWUvLi9zcmMvU3lzdGVtcy9SZW5kZXJTeXN0ZW0udHMiLCJ3ZWJwYWNrOi8vbWF6ZS1nYW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL21hemUtZ2FtZS8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQ29sbGlkZXIgPSB2b2lkIDA7XG5jb25zdCBDb21wb25lbnRfMSA9IHJlcXVpcmUoXCIuLi9FbmdpbmUvQ29tcG9uZW50XCIpO1xuY2xhc3MgQ29sbGlkZXIgZXh0ZW5kcyBDb21wb25lbnRfMS5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbn1cbmV4cG9ydHMuQ29sbGlkZXIgPSBDb2xsaWRlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5QbGF5ZXIgPSB2b2lkIDA7XG5jb25zdCBDb21wb25lbnRfMSA9IHJlcXVpcmUoXCIuLi9FbmdpbmUvQ29tcG9uZW50XCIpO1xuY2xhc3MgUGxheWVyIGV4dGVuZHMgQ29tcG9uZW50XzEuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG59XG5leHBvcnRzLlBsYXllciA9IFBsYXllcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Qb3NpdGlvbiA9IHZvaWQgMDtcbmNvbnN0IENvbXBvbmVudF8xID0gcmVxdWlyZShcIi4uL0VuZ2luZS9Db21wb25lbnRcIik7XG5jbGFzcyBQb3NpdGlvbiBleHRlbmRzIENvbXBvbmVudF8xLkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IoeCwgeSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgICAgICB0aGlzLm9sZFggPSB4O1xuICAgICAgICB0aGlzLm9sZFkgPSB5O1xuICAgIH1cbiAgICBlcXVhbHMob3RoZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCA9PSBvdGhlci54ICYmIHRoaXMueSA9PSBvdGhlci55O1xuICAgIH1cbn1cbmV4cG9ydHMuUG9zaXRpb24gPSBQb3NpdGlvbjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5SZW5kZXIgPSB2b2lkIDA7XG5jb25zdCBDb21wb25lbnRfMSA9IHJlcXVpcmUoXCIuLi9FbmdpbmUvQ29tcG9uZW50XCIpO1xuY2xhc3MgUmVuZGVyIGV4dGVuZHMgQ29tcG9uZW50XzEuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihjb2xvciwgb2Zmc2V0LCBzaXplKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICAgICAgdGhpcy5vZmZzZXQgPSBvZmZzZXQ7XG4gICAgICAgIHRoaXMuc2l6ZSA9IHNpemU7XG4gICAgfVxufVxuZXhwb3J0cy5SZW5kZXIgPSBSZW5kZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQ29tcG9uZW50Q29udGFpbmVyID0gZXhwb3J0cy5Db21wb25lbnQgPSB2b2lkIDA7XG5jbGFzcyBDb21wb25lbnQge1xufVxuZXhwb3J0cy5Db21wb25lbnQgPSBDb21wb25lbnQ7XG5jbGFzcyBDb21wb25lbnRDb250YWluZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLm1hcCA9IG5ldyBNYXAoKTtcbiAgICB9XG4gICAgYWRkKGNvbXBvbmVudCkge1xuICAgICAgICB0aGlzLm1hcC5zZXQoY29tcG9uZW50LmNvbnN0cnVjdG9yLCBjb21wb25lbnQpO1xuICAgIH1cbiAgICBnZXQoY29tcG9uZW50Q2xhc3MpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwLmdldChjb21wb25lbnRDbGFzcyk7XG4gICAgfVxuICAgIGhhcyhjb21wb25lbnRDbGFzcykge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXAuaGFzKGNvbXBvbmVudENsYXNzKTtcbiAgICB9XG4gICAgaGFzQWxsKGNvbXBvbmVudENsYXNzZXMpIHtcbiAgICAgICAgZm9yIChsZXQgY2xzIG9mIGNvbXBvbmVudENsYXNzZXMpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5tYXAuaGFzKGNscykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGRlbGV0ZShjb21wb25lbnRDbGFzcykge1xuICAgICAgICB0aGlzLm1hcC5kZWxldGUoY29tcG9uZW50Q2xhc3MpO1xuICAgIH1cbn1cbmV4cG9ydHMuQ29tcG9uZW50Q29udGFpbmVyID0gQ29tcG9uZW50Q29udGFpbmVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkVDU1NjZW5lID0gdm9pZCAwO1xuY29uc3QgU2NlbmVfMSA9IHJlcXVpcmUoXCIuL1NjZW5lXCIpO1xuY29uc3QgQ29tcG9uZW50XzEgPSByZXF1aXJlKFwiLi9Db21wb25lbnRcIik7XG5jbGFzcyBFQ1NTY2VuZSBleHRlbmRzIFNjZW5lXzEuU2NlbmUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICAvLyBNYWluIHN0YXRlXG4gICAgICAgIHRoaXMuZW50aXRpZXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuc3lzdGVtcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgLy8gQm9va2tlZXBpbmcgZm9yIGVudGl0aWVzLlxuICAgICAgICB0aGlzLm5leHRFbnRpdHlJRCA9IDA7XG4gICAgICAgIHRoaXMuZW50aXRpZXNUb0Rlc3Ryb3kgPSBuZXcgQXJyYXkoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRGVmYXVsdCByZXR1cm4gLTEuIEFueSBvdGhlciBudW1iZXJzIHdpbGwgdGVsbCB0aGUgZ2FtZSBlbmdpbmUgdG8gY2hhbmdlXG4gICAgICogdGhlIHNjZW5lIHRvIHdoYXRldmVyIGluZGV4IGlzIHJldHVybmVkLlxuICAgICAqIEBwYXJhbSBjYW52YXNcbiAgICAgKiBAcGFyYW0ga2V5UHJlc3Nlc1xuICAgICAqL1xuICAgIHVwZGF0ZShnYW1lKSB7XG4gICAgICAgIC8vIFVwZGF0ZSBhbGwgc3lzdGVtcy4gKExhdGVyLCB3ZSdsbCBhZGQgYSB3YXkgdG8gc3BlY2lmeSB0aGVcbiAgICAgICAgLy8gdXBkYXRlIG9yZGVyLilcbiAgICAgICAgZm9yIChsZXQgW3N5c3RlbSwgZW50aXRpZXNdIG9mIHRoaXMuc3lzdGVtcy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIHN5c3RlbS51cGRhdGUoZ2FtZSwgZW50aXRpZXMpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJlbW92ZSBhbnkgZW50aXRpZXMgdGhhdCB3ZXJlIG1hcmtlZCBmb3IgZGVsZXRpb24gZHVyaW5nIHRoZVxuICAgICAgICAvLyB1cGRhdGUuXG4gICAgICAgIHdoaWxlICh0aGlzLmVudGl0aWVzVG9EZXN0cm95Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveUVudGl0eSh0aGlzLmVudGl0aWVzVG9EZXN0cm95LnBvcCgpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jdXN0b21VcGRhdGUoZ2FtZSk7XG4gICAgfVxuICAgIC8vIEFQSTogRW50aXRpZXNcbiAgICBhZGRFbnRpdHkoKSB7XG4gICAgICAgIGxldCBlbnRpdHkgPSB0aGlzLm5leHRFbnRpdHlJRDtcbiAgICAgICAgdGhpcy5uZXh0RW50aXR5SUQrKztcbiAgICAgICAgdGhpcy5lbnRpdGllcy5zZXQoZW50aXR5LCBuZXcgQ29tcG9uZW50XzEuQ29tcG9uZW50Q29udGFpbmVyKCkpO1xuICAgICAgICByZXR1cm4gZW50aXR5O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNYXJrcyBgZW50aXR5YCBmb3IgcmVtb3ZhbC4gVGhlIGFjdHVhbCByZW1vdmFsIGhhcHBlbnMgYXQgdGhlIGVuZFxuICAgICAqIG9mIHRoZSBuZXh0IGB1cGRhdGUoKWAuIFRoaXMgd2F5IHdlIGF2b2lkIHN1YnRsZSBidWdzIHdoZXJlIGFuXG4gICAgICogRW50aXR5IGlzIHJlbW92ZWQgbWlkLWB1cGRhdGUoKWAsIHdpdGggc29tZSBTeXN0ZW1zIHNlZWluZyBpdCBhbmRcbiAgICAgKiBvdGhlcnMgbm90LlxuICAgICAqL1xuICAgIHJlbW92ZUVudGl0eShlbnRpdHkpIHtcbiAgICAgICAgdGhpcy5lbnRpdGllc1RvRGVzdHJveS5wdXNoKGVudGl0eSk7XG4gICAgfVxuICAgIGFkZENvbXBvbmVudChlbnRpdHksIGNvbXBvbmVudCkge1xuICAgICAgICB0aGlzLmVudGl0aWVzLmdldChlbnRpdHkpLmFkZChjb21wb25lbnQpO1xuICAgICAgICB0aGlzLmNoZWNrRShlbnRpdHkpO1xuICAgIH1cbiAgICBnZXRDb21wb25lbnRzKGVudGl0eSkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbnRpdGllcy5nZXQoZW50aXR5KTtcbiAgICB9XG4gICAgcmVtb3ZlQ29tcG9uZW50KGVudGl0eSwgY29tcG9uZW50Q2xhc3MpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICAoX2EgPSB0aGlzLmVudGl0aWVzLmdldChlbnRpdHkpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZGVsZXRlKGNvbXBvbmVudENsYXNzKTtcbiAgICAgICAgdGhpcy5jaGVja0UoZW50aXR5KTtcbiAgICB9XG4gICAgLy8gQVBJOiBTeXN0ZW1zXG4gICAgYWRkU3lzdGVtKHN5c3RlbSkge1xuICAgICAgICAvLyBDaGVja2luZyBpbnZhcmlhbnQ6IHN5c3RlbXMgc2hvdWxkIG5vdCBoYXZlIGFuIGVtcHR5XG4gICAgICAgIC8vIENvbXBvbmVudHMgbGlzdCwgb3IgdGhleSdsbCBydW4gb24gZXZlcnkgZW50aXR5LiBTaW1wbHkgcmVtb3ZlXG4gICAgICAgIC8vIG9yIHNwZWNpYWwgY2FzZSB0aGlzIGNoZWNrIGlmIHlvdSBkbyB3YW50IGEgU3lzdGVtIHRoYXQgcnVuc1xuICAgICAgICAvLyBvbiBldmVyeXRoaW5nLlxuICAgICAgICBpZiAoc3lzdGVtLmNvbXBvbmVudHNSZXF1aXJlZC5zaXplID09IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignU3lzdGVtIG5vdCBhZGRlZDogZW1wdHkgQ29tcG9uZW50cyBsaXN0LicpO1xuICAgICAgICAgICAgY29uc29sZS53YXJuKHN5c3RlbSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gR2l2ZSBzeXN0ZW0gYSByZWZlcmVuY2UgdG8gdGhlIEVDUyBzbyBpdCBjYW4gYWN0dWFsbHkgZG9cbiAgICAgICAgLy8gYW55dGhpbmcuXG4gICAgICAgIHN5c3RlbS5lY3MgPSB0aGlzO1xuICAgICAgICAvLyBTYXZlIHN5c3RlbSBhbmQgc2V0IHdobyBpdCBzaG91bGQgdHJhY2sgaW1tZWRpYXRlbHkuXG4gICAgICAgIHRoaXMuc3lzdGVtcy5zZXQoc3lzdGVtLCBuZXcgU2V0KCkpO1xuICAgICAgICBmb3IgKGxldCBlbnRpdHkgb2YgdGhpcy5lbnRpdGllcy5rZXlzKCkpIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tFUyhlbnRpdHksIHN5c3RlbSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogTm90ZTogSSBuZXZlciBhY3R1YWxseSBoYWQgYSByZW1vdmVTeXN0ZW0oKSBtZXRob2QgZm9yIHRoZSBlbnRpcmVcbiAgICAgKiB0aW1lIEkgd2FzIHByb2dyYW1taW5nIHRoZSBnYW1lIEZhbGxnYXRlICgyIHllYXJzISkuIEkganVzdCBhZGRlZFxuICAgICAqIG9uZSBoZXJlIGZvciBhIHNwZWNpZmljIHRlc3RpbmcgcmVhc29uIChzZWUgdGhlIG5leHQgcG9zdCkuXG4gICAgICogQmVjYXVzZSBpdCdzIGp1c3QgZm9yIGRlbW8gcHVycG9zZXMsIHRoaXMgcmVxdWlyZXMgYW4gYWN0dWFsXG4gICAgICogaW5zdGFuY2Ugb2YgYSBTeXN0ZW0gdG8gcmVtb3ZlICh3aGljaCB3b3VsZCBiZSBjbHVua3kgYXMgYSByZWFsXG4gICAgICogQVBJKS5cbiAgICAgKi9cbiAgICByZW1vdmVTeXN0ZW0oc3lzdGVtKSB7XG4gICAgICAgIHRoaXMuc3lzdGVtcy5kZWxldGUoc3lzdGVtKTtcbiAgICB9XG4gICAgY2xlYXIoKSB7XG4gICAgICAgIHRoaXMuZW50aXRpZXMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5zeXN0ZW1zLmNsZWFyKCk7XG4gICAgfVxuICAgIGRlc3Ryb3lFbnRpdHkoZW50aXR5KSB7XG4gICAgICAgIHRoaXMuZW50aXRpZXMuZGVsZXRlKGVudGl0eSk7XG4gICAgICAgIGZvciAobGV0IGVudGl0aWVzIG9mIHRoaXMuc3lzdGVtcy52YWx1ZXMoKSkge1xuICAgICAgICAgICAgZW50aXRpZXMuZGVsZXRlKGVudGl0eSk7IC8vIG5vLW9wIGlmIGRvZXNuJ3QgaGF2ZSBpdFxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEBUT0RPOiBjYW4gSSByZW1vdmUgdGhpcz9cbiAgICBjaGVja0UoZW50aXR5KSB7XG4gICAgICAgIGZvciAobGV0IHN5c3RlbSBvZiB0aGlzLnN5c3RlbXMua2V5cygpKSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrRVMoZW50aXR5LCBzeXN0ZW0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEkgdGhpbmsgdGhpcyBjYW4gYmUgcmVtb3ZlZCBidXQgSSdtIGdvaW5nIHRvIGxlYXZlIGl0IGluIGZvciBub3cuXG4gICAgICogQHBhcmFtIGVudGl0eVxuICAgICAqIEBwYXJhbSBzeXN0ZW1cbiAgICAgKi9cbiAgICBjaGVja0VTKGVudGl0eSwgc3lzdGVtKSB7XG4gICAgICAgIGxldCBoYXZlID0gdGhpcy5lbnRpdGllcy5nZXQoZW50aXR5KTtcbiAgICAgICAgbGV0IG5lZWQgPSBzeXN0ZW0uY29tcG9uZW50c1JlcXVpcmVkO1xuICAgICAgICBpZiAoaGF2ZS5oYXNBbGwobmVlZCkpIHtcbiAgICAgICAgICAgIC8vIHNob3VsZCBiZSBpbiBzeXN0ZW1cbiAgICAgICAgICAgIHRoaXMuc3lzdGVtcy5nZXQoc3lzdGVtKS5hZGQoZW50aXR5KTsgLy8gbm8tb3AgaWYgaW5cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIHNob3VsZCBub3QgYmUgaW4gc3lzdGVtXG4gICAgICAgICAgICB0aGlzLnN5c3RlbXMuZ2V0KHN5c3RlbSkuZGVsZXRlKGVudGl0eSk7IC8vIG5vLW9wIGlmIG91dFxuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0cy5FQ1NTY2VuZSA9IEVDU1NjZW5lO1xuO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkdhbWUgPSB2b2lkIDA7XG5jb25zdCBLZXlfMSA9IHJlcXVpcmUoXCIuL0tleVwiKTtcbmNsYXNzIEdhbWUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnNjZW5lcyA9IG5ldyBBcnJheSgpO1xuICAgICAgICB0aGlzLnNjZW5lSW5kZXggPSAwO1xuICAgICAgICB0aGlzLmtleURvd24gPSBuZXcgU2V0KCk7XG4gICAgICAgIHRoaXMua2V5UHJlc3MgPSBuZXcgU2V0KCk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGsgPSAoMCwgS2V5XzEua2V5Q29kZVRvS2V5KShlLmtleSk7XG4gICAgICAgICAgICBpZiAoIXRoaXMua2V5RG93bi5oYXMoaykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmtleURvd24uYWRkKGspO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGsgPSAoMCwgS2V5XzEua2V5Q29kZVRvS2V5KShlLmtleSk7XG4gICAgICAgICAgICB0aGlzLmtleURvd24uZGVsZXRlKGspO1xuICAgICAgICB9KTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMua2V5UHJlc3MuYWRkKCgwLCBLZXlfMS5rZXlDb2RlVG9LZXkpKGUua2V5KSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XG4gICAgICAgIHRoaXMuY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgdGhpcy53aWR0aCA9IGNhbnZhcy53aWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBjYW52YXMuaGVpZ2h0O1xuICAgICAgICB0aGlzLmRlbHRhID0gMDtcbiAgICB9XG4gICAgO1xuICAgIGFkZFNjZW5lKHNjZW5lKSB7XG4gICAgICAgIHRoaXMuc2NlbmVzLnB1c2goc2NlbmUpO1xuICAgICAgICByZXR1cm4gdGhpcy5zY2VuZXMubGVuZ3RoIC0gMTtcbiAgICB9XG4gICAgc3RhcnQoKSB7XG4gICAgICAgIGxldCBvbGRUaW1lU3RhbXA7XG4gICAgICAgIGxldCBmcHM7XG4gICAgICAgIGNvbnN0IGdhbWVMb29wID0gKHRpbWVTdGFtcCkgPT4ge1xuICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBudW1iZXIgb2Ygc2Vjb25kcyBwYXNzZWQgc2luY2UgdGhlIGxhc3QgZnJhbWVcbiAgICAgICAgICAgIHRoaXMuZGVsdGEgPSAodGltZVN0YW1wIC0gb2xkVGltZVN0YW1wKSAvIDEwMDA7XG4gICAgICAgICAgICBvbGRUaW1lU3RhbXAgPSB0aW1lU3RhbXA7XG4gICAgICAgICAgICBmcHMgPSBNYXRoLnJvdW5kKDEgLyB0aGlzLmRlbHRhKTtcbiAgICAgICAgICAgIC8vIHJlc2V0IGJhY2tncm91bmRcbiAgICAgICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAvLyBnYW1lIGVuZ2luZSBvcGVyYXRpb25zXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgLy8gRHJhdyBGUFNcbiAgICAgICAgICAgIHRoaXMuY3R4LmZvbnQgPSAnMTJweCBBcmlhbCc7XG4gICAgICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSAncmVkJztcbiAgICAgICAgICAgIHRoaXMuY3R4LmZpbGxUZXh0KFwiRlBTOiBcIiArIGZwcywgdGhpcy53aWR0aCAtIDYwLCAzMCk7XG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWVMb29wKTtcbiAgICAgICAgfTtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lTG9vcCk7XG4gICAgfVxuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgY29uc3QgaSA9IHRoaXMuc2NlbmVzW3RoaXMuc2NlbmVJbmRleF0udXBkYXRlKHRoaXMpO1xuICAgICAgICBpZiAoaSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuc2NlbmVzW3RoaXMuc2NlbmVJbmRleF0ub25FeGl0KCk7XG4gICAgICAgICAgICB0aGlzLnNjZW5lSW5kZXggPSBpO1xuICAgICAgICAgICAgdGhpcy5zY2VuZXNbdGhpcy5zY2VuZUluZGV4XS5vbkVudGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5rZXlQcmVzcy5jbGVhcigpO1xuICAgIH1cbn1cbmV4cG9ydHMuR2FtZSA9IEdhbWU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMua2V5Q29kZVRvS2V5ID0gZXhwb3J0cy5LZXkgPSB2b2lkIDA7XG52YXIgS2V5O1xuKGZ1bmN0aW9uIChLZXkpIHtcbiAgICBLZXlbS2V5W1wiTEVGVFwiXSA9IDBdID0gXCJMRUZUXCI7XG4gICAgS2V5W0tleVtcIlJJR0hUXCJdID0gMV0gPSBcIlJJR0hUXCI7XG4gICAgS2V5W0tleVtcIkRPV05cIl0gPSAyXSA9IFwiRE9XTlwiO1xuICAgIEtleVtLZXlbXCJVUFwiXSA9IDNdID0gXCJVUFwiO1xuICAgIEtleVtLZXlbXCJXXCJdID0gNF0gPSBcIldcIjtcbiAgICBLZXlbS2V5W1wiQVwiXSA9IDVdID0gXCJBXCI7XG4gICAgS2V5W0tleVtcIlNcIl0gPSA2XSA9IFwiU1wiO1xuICAgIEtleVtLZXlbXCJEXCJdID0gN10gPSBcIkRcIjtcbiAgICBLZXlbS2V5W1wiU1BBQ0VcIl0gPSA4XSA9IFwiU1BBQ0VcIjtcbiAgICBLZXlbS2V5W1wiRVNDQVBFXCJdID0gOV0gPSBcIkVTQ0FQRVwiO1xuICAgIEtleVtLZXlbXCJJTlZBTElEXCJdID0gMTBdID0gXCJJTlZBTElEXCI7XG59KShLZXkgPSBleHBvcnRzLktleSB8fCAoZXhwb3J0cy5LZXkgPSB7fSkpO1xuZnVuY3Rpb24ga2V5Q29kZVRvS2V5KGtleSkge1xuICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgIGNhc2UgJ0Rvd24nOlxuICAgICAgICBjYXNlICdBcnJvd0Rvd24nOlxuICAgICAgICAgICAgcmV0dXJuIEtleS5MRUZUO1xuICAgICAgICBjYXNlICdVcCc6XG4gICAgICAgIGNhc2UgJ0Fycm93VXAnOlxuICAgICAgICAgICAgcmV0dXJuIEtleS5VUDtcbiAgICAgICAgY2FzZSAnUmlnaHQnOlxuICAgICAgICBjYXNlICdBcnJvd1JpZ2h0JzpcbiAgICAgICAgICAgIHJldHVybiBLZXkuUklHSFQ7XG4gICAgICAgIGNhc2UgJ0xlZnQnOlxuICAgICAgICBjYXNlICdBcnJvd0xlZnQnOlxuICAgICAgICAgICAgcmV0dXJuIEtleS5MRUZUO1xuICAgICAgICBjYXNlICcgJzpcbiAgICAgICAgY2FzZSAnU3BhY2UnOlxuICAgICAgICAgICAgcmV0dXJuIEtleS5TUEFDRTtcbiAgICAgICAgY2FzZSAnRXNjYXBlJzpcbiAgICAgICAgICAgIHJldHVybiBLZXkuRVNDQVBFO1xuICAgICAgICBjYXNlICdhJzpcbiAgICAgICAgICAgIHJldHVybiBLZXkuQTtcbiAgICAgICAgY2FzZSAncyc6XG4gICAgICAgICAgICByZXR1cm4gS2V5LlM7XG4gICAgICAgIGNhc2UgJ2QnOlxuICAgICAgICAgICAgcmV0dXJuIEtleS5EO1xuICAgICAgICBjYXNlICd3JzpcbiAgICAgICAgICAgIHJldHVybiBLZXkuVztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgVW5oYW5kbGVkIGtleTogJHtrZXl9LmApO1xuICAgICAgICAgICAgcmV0dXJuIEtleS5JTlZBTElEO1xuICAgIH1cbn1cbmV4cG9ydHMua2V5Q29kZVRvS2V5ID0ga2V5Q29kZVRvS2V5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlNjZW5lID0gdm9pZCAwO1xuY2xhc3MgU2NlbmUge1xufVxuZXhwb3J0cy5TY2VuZSA9IFNjZW5lO1xuO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlN5c3RlbSA9IHZvaWQgMDtcbmNsYXNzIFN5c3RlbSB7XG59XG5leHBvcnRzLlN5c3RlbSA9IFN5c3RlbTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5nZXRNYXplID0gdm9pZCAwO1xuZnVuY3Rpb24gZ2V0VmFsaWROZWlnaGJvcnMoc2l6ZSwgcG9zLCB2aXNpdGVkKSB7XG4gICAgbGV0IG5laWdoYm9ycyA9IFtcbiAgICAgICAgW3Bvc1swXSArIDEsIHBvc1sxXV0sXG4gICAgICAgIFtwb3NbMF0gLSAxLCBwb3NbMV1dLFxuICAgICAgICBbcG9zWzBdLCBwb3NbMV0gKyAxXSxcbiAgICAgICAgW3Bvc1swXSwgcG9zWzFdIC0gMV0sXG4gICAgXTtcbiAgICBsZXQgdmFsaWROZWlnaGJvcnMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5laWdoYm9ycy5sZW5ndGg7ICsraSkge1xuICAgICAgICBjb25zdCB4ID0gbmVpZ2hib3JzW2ldWzBdO1xuICAgICAgICBjb25zdCB5ID0gbmVpZ2hib3JzW2ldWzFdO1xuICAgICAgICBpZiAoeCA8IDAgfHwgeCA+PSBzaXplIHx8IHkgPCAwIHx8IHkgPj0gc2l6ZSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZpc2l0ZWQgIT0gbnVsbCAmJiB2aXNpdGVkLmhhcyhuZWlnaGJvcnNbaV0uam9pbignLCcpKSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFsaWROZWlnaGJvcnMucHVzaChuZWlnaGJvcnNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gdmFsaWROZWlnaGJvcnM7XG59XG5mdW5jdGlvbiBnZXRNYXplKHNpemUpIHtcbiAgICAvLyBidWlsZCB0aGUgZ3JpZCBhbmQgaW5pdGlhbGl6ZSBhcyB0cnVlIHRvIHJlcHJlc2VudCB0aGF0IHRoZXJlIGV4aXN0c1xuICAgIC8vIGEgd2FsbC5cbiAgICBsZXQgZ3JpZCA9IFtdO1xuICAgIGZvciAobGV0IHggPSAwOyB4IDwgc2l6ZTsgKyt4KSB7XG4gICAgICAgIGxldCByb3cgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBzaXplOyArK3kpIHtcbiAgICAgICAgICAgIHJvdy5wdXNoKHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGdyaWQucHVzaChyb3cpO1xuICAgIH1cbiAgICAvLyB0b3AgbGVmdCBhbmQgYm90dG9tIHJpZ2h0IGFyZSBhbHdheXMgbm90IHdhbGxzLlxuICAgIGdyaWRbMF1bMF0gPSBmYWxzZTtcbiAgICBsZXQgdmlzaXRlZCA9IG5ldyBTZXQoKTtcbiAgICB2aXNpdGVkLmFkZCgnMCwwJyk7XG4gICAgbGV0IHN0YWNrID0gW1swLCAwXV07XG4gICAgd2hpbGUgKHN0YWNrLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgIGxldCBjdXJyZW50UG9zaXRpb24gPSBzdGFjay5wb3AoKTtcbiAgICAgICAgLy8gbGV0IHN0YWNrSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzdGFjay5sZW5ndGgpO1xuICAgICAgICAvLyBsZXQgY3VycmVudFBvc2l0aW9uID0gc3RhY2tbc3RhY2tJbmRleF07XG4gICAgICAgIC8vIHN0YWNrLnNwbGljZShzdGFja0luZGV4LDEpO1xuICAgICAgICAvLyBnZXQgbmVpZ2hib3JzIGFuZCB2YWxpZGF0ZSB0aGF0IHRoZXkgZml0IGluIHRoZSBib3VuZHMgYW5kIGFyZVxuICAgICAgICAvLyBub3QgdmlzaXRlZFxuICAgICAgICBsZXQgdmFsaWRhdGVkTmVpZ2hib3JzID0gZ2V0VmFsaWROZWlnaGJvcnMoc2l6ZSwgY3VycmVudFBvc2l0aW9uLCB2aXNpdGVkKTtcbiAgICAgICAgLy8gZm9yIGV2ZXJ5IHZhbGlkIG5laWdoYm9yLCB3ZSBuZWVkIHRvIGZ1cnRoZXIgdmVyaWZ5IHRoYXQgdGhlcmUgXG4gICAgICAgIC8vIGFyZSBhdCBsZWFzdCB0aHJlZSB3YWxscyBhcm91bmQuIE90aGVyd2lzZSwgaXQgY2FuIG5vdCBiZSB0dXJuZWRcbiAgICAgICAgLy8gaW50byBhbiBlbXB0eSBjZWxsXG4gICAgICAgIGxldCBtb2RpZmlhYmxlTmVpZ2hib3JzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsaWRhdGVkTmVpZ2hib3JzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBsZXQgYWNjZXNzaWJsZU5laWdoYm9ycyA9IGdldFZhbGlkTmVpZ2hib3JzKHNpemUsIHZhbGlkYXRlZE5laWdoYm9yc1tpXSwgbnVsbCk7XG4gICAgICAgICAgICBsZXQgd2FsbENvdW50ID0gNCAtIGFjY2Vzc2libGVOZWlnaGJvcnMubGVuZ3RoOyAvLyBib3JkZXJzIGNvdW50IGFzIGEgd2FsbFxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBhY2Nlc3NpYmxlTmVpZ2hib3JzLmxlbmd0aDsgKytqKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeCA9IGFjY2Vzc2libGVOZWlnaGJvcnNbal1bMF07XG4gICAgICAgICAgICAgICAgY29uc3QgeSA9IGFjY2Vzc2libGVOZWlnaGJvcnNbal1bMV07XG4gICAgICAgICAgICAgICAgaWYgKGdyaWRbeV1beF0pIHtcbiAgICAgICAgICAgICAgICAgICAgKyt3YWxsQ291bnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHdhbGxDb3VudCA+IDIpIHtcbiAgICAgICAgICAgICAgICBtb2RpZmlhYmxlTmVpZ2hib3JzLnB1c2godmFsaWRhdGVkTmVpZ2hib3JzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobW9kaWZpYWJsZU5laWdoYm9ycy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJhbmRvbU5laWdoYm9yID0gbW9kaWZpYWJsZU5laWdoYm9yc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtb2RpZmlhYmxlTmVpZ2hib3JzLmxlbmd0aCldO1xuICAgICAgICBncmlkW3JhbmRvbU5laWdoYm9yWzFdXVtyYW5kb21OZWlnaGJvclswXV0gPSBmYWxzZTtcbiAgICAgICAgc3RhY2sucHVzaChjdXJyZW50UG9zaXRpb24pO1xuICAgICAgICBzdGFjay5wdXNoKHJhbmRvbU5laWdoYm9yKTtcbiAgICAgICAgdmlzaXRlZC5hZGQocmFuZG9tTmVpZ2hib3Iuam9pbignLCcpKTtcbiAgICB9XG4gICAgLy8gaWYgdGhlIGJvdHRvbSByaWdodCBpcyBub3QgcmVhY2hhYmxlLCByZW1vdmUgd2FsbHMgdGlsbCBwYXRoIGlzIHBvc3NpYmxlXG4gICAgbGV0IHBvcyA9IFtzaXplIC0gMSwgc2l6ZSAtIDFdO1xuICAgIHdoaWxlIChncmlkW3Bvc1sxXV1bcG9zWzBdXSkge1xuICAgICAgICBncmlkW3Bvc1sxXV1bcG9zWzBdXSA9IGZhbHNlO1xuICAgICAgICAtLXBvc1swXTtcbiAgICB9XG4gICAgcmV0dXJuIGdyaWQ7XG59XG5leHBvcnRzLmdldE1hemUgPSBnZXRNYXplO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkdhbWVPdmVyU2NlbmUgPSB2b2lkIDA7XG5jb25zdCBTY2VuZV8xID0gcmVxdWlyZShcIi4uL0VuZ2luZS9TY2VuZVwiKTtcbmNsYXNzIEdhbWVPdmVyU2NlbmUgZXh0ZW5kcyBTY2VuZV8xLlNjZW5lIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5zY2VuZUluZGV4ID0gMDtcbiAgICAgICAgdGhpcy50aW1lciA9IDA7XG4gICAgfVxuICAgIG9uRW50ZXIoKSB7XG4gICAgICAgIHRoaXMudGltZXIgPSAwO1xuICAgIH1cbiAgICBvbkV4aXQoKSB7IH1cbiAgICB1cGRhdGUoZ2FtZSkge1xuICAgICAgICB0aGlzLnRpbWVyICs9IGdhbWUuZGVsdGE7XG4gICAgICAgIGlmICh0aGlzLnRpbWVyID4gMikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NlbmVJbmRleDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGdhbWUuY3R4LmZvbnQgPSAnNDBweCBBcmlhbCc7XG4gICAgICAgICAgICBnYW1lLmN0eC5maWxsU3R5bGUgPSAnZ3JlZW4nO1xuICAgICAgICAgICAgZ2FtZS5jdHguZmlsbFRleHQoJ1lvdSBXb24hIE5pY2UhJywgZ2FtZS53aWR0aCAvIDMuNSwgZ2FtZS5oZWlnaHQgLyAyKTtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMuR2FtZU92ZXJTY2VuZSA9IEdhbWVPdmVyU2NlbmU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuTWF6ZUdhbWVTY2VuZSA9IHZvaWQgMDtcbmNvbnN0IEVDU1NjZW5lXzEgPSByZXF1aXJlKFwiLi4vRW5naW5lL0VDU1NjZW5lXCIpO1xuY29uc3QgUG9zaXRpb25fMSA9IHJlcXVpcmUoXCIuLi9Db21wb25lbnRzL1Bvc2l0aW9uXCIpO1xuY29uc3QgUmVuZGVyU3lzdGVtXzEgPSByZXF1aXJlKFwiLi4vU3lzdGVtcy9SZW5kZXJTeXN0ZW1cIik7XG5jb25zdCBSZW5kZXJfMSA9IHJlcXVpcmUoXCIuLi9Db21wb25lbnRzL1JlbmRlclwiKTtcbmNvbnN0IE1hemVHZW5lcmF0b3JfMSA9IHJlcXVpcmUoXCIuLi9NYXplR2VuZXJhdG9yXCIpO1xuY29uc3QgUGxheWVyXzEgPSByZXF1aXJlKFwiLi4vQ29tcG9uZW50cy9QbGF5ZXJcIik7XG5jb25zdCBQbGF5ZXJTeXN0ZW1fMSA9IHJlcXVpcmUoXCIuLi9TeXN0ZW1zL1BsYXllclN5c3RlbVwiKTtcbmNvbnN0IENvbGxpZGVyXzEgPSByZXF1aXJlKFwiLi4vQ29tcG9uZW50cy9Db2xsaWRlclwiKTtcbmNvbnN0IFBsYXllckNvbGxpZGVyU3lzdGVtXzEgPSByZXF1aXJlKFwiLi4vU3lzdGVtcy9QbGF5ZXJDb2xsaWRlclN5c3RlbVwiKTtcbmNsYXNzIE1hemVHYW1lU2NlbmUgZXh0ZW5kcyBFQ1NTY2VuZV8xLkVDU1NjZW5lIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5zY2VuZUluZGV4ID0gMDtcbiAgICAgICAgdGhpcy5zaXplID0gMjA7XG4gICAgICAgIHRoaXMucGxheWVySUQgPSAwO1xuICAgIH1cbiAgICBvbkVudGVyKCkge1xuICAgICAgICBjb25zdCBncmlkID0gKDAsIE1hemVHZW5lcmF0b3JfMS5nZXRNYXplKSh0aGlzLnNpemUpO1xuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuc2l6ZTsgKyt5KSB7XG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMuc2l6ZTsgKyt4KSB7XG4gICAgICAgICAgICAgICAgaWYgKGdyaWRbeV1beF0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmxvY2tJRCA9IHRoaXMuYWRkRW50aXR5KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkQ29tcG9uZW50KGJsb2NrSUQsIG5ldyBQb3NpdGlvbl8xLlBvc2l0aW9uKHgsIHkpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRDb21wb25lbnQoYmxvY2tJRCwgbmV3IFJlbmRlcl8xLlJlbmRlcignd2hpdGUnLCAwLCAxKSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkQ29tcG9uZW50KGJsb2NrSUQsIG5ldyBDb2xsaWRlcl8xLkNvbGxpZGVyKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh4ID09PSB0aGlzLnNpemUgLSAxICYmIHkgPT0gdGhpcy5zaXplIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBibG9ja0lEID0gdGhpcy5hZGRFbnRpdHkoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRDb21wb25lbnQoYmxvY2tJRCwgbmV3IFBvc2l0aW9uXzEuUG9zaXRpb24oeCwgeSkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZENvbXBvbmVudChibG9ja0lELCBuZXcgUmVuZGVyXzEuUmVuZGVyKCdncmVlbicsIDAsIDEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gSSBuZWVkIHNvbWUga2luZCBvZiByZW5kZXIgb3JkZXIuIFJpZ2h0IG5vdywgdGhpcyBvbmx5IHdvcmtzIGJlY2F1c2VcbiAgICAgICAgLy8gSSBhZGQgdGhlIHBsYXllciBsYXN0LiBPdGhlcndpc2UsIHRoZSBibG9ja3Mgd291bGQgYmUgcmVuZGVyZWQgb3ZlciBcbiAgICAgICAgLy8gdGhlIHBsYXllci5cbiAgICAgICAgdGhpcy5wbGF5ZXJJRCA9IHRoaXMuYWRkRW50aXR5KCk7XG4gICAgICAgIHRoaXMuYWRkQ29tcG9uZW50KHRoaXMucGxheWVySUQsIG5ldyBQb3NpdGlvbl8xLlBvc2l0aW9uKDAsIDApKTtcbiAgICAgICAgdGhpcy5hZGRDb21wb25lbnQodGhpcy5wbGF5ZXJJRCwgbmV3IFJlbmRlcl8xLlJlbmRlcigncmVkJywgMC4yLCAwLjUpKTtcbiAgICAgICAgdGhpcy5hZGRDb21wb25lbnQodGhpcy5wbGF5ZXJJRCwgbmV3IFBsYXllcl8xLlBsYXllcigpKTtcbiAgICAgICAgdGhpcy5hZGRTeXN0ZW0obmV3IFBsYXllclN5c3RlbV8xLlBsYXllclN5c3RlbSh0aGlzLnNpemUpKTtcbiAgICAgICAgdGhpcy5hZGRTeXN0ZW0obmV3IFBsYXllckNvbGxpZGVyU3lzdGVtXzEuUGxheWVyQ29sbGlkZXJTeXN0ZW0odGhpcy5wbGF5ZXJJRCkpO1xuICAgICAgICB0aGlzLmFkZFN5c3RlbShuZXcgUmVuZGVyU3lzdGVtXzEuUmVuZGVyU3lzdGVtKCkpO1xuICAgIH1cbiAgICBvbkV4aXQoKSB7XG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICB9XG4gICAgY3VzdG9tVXBkYXRlKGdhbWUpIHtcbiAgICAgICAgY29uc3QgcGxheWVyUG9zID0gdGhpcy5nZXRDb21wb25lbnRzKHRoaXMucGxheWVySUQpLmdldChQb3NpdGlvbl8xLlBvc2l0aW9uKTtcbiAgICAgICAgaWYgKHBsYXllclBvcy54ID09IHRoaXMuc2l6ZSAtIDEgJiYgcGxheWVyUG9zLnkgPT0gdGhpcy5zaXplIC0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NlbmVJbmRleDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxufVxuZXhwb3J0cy5NYXplR2FtZVNjZW5lID0gTWF6ZUdhbWVTY2VuZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5TdGFydE1lbnVTY2VuZSA9IHZvaWQgMDtcbmNvbnN0IEtleV8xID0gcmVxdWlyZShcIi4uL0VuZ2luZS9LZXlcIik7XG5jb25zdCBTY2VuZV8xID0gcmVxdWlyZShcIi4uL0VuZ2luZS9TY2VuZVwiKTtcbmNsYXNzIFN0YXJ0TWVudVNjZW5lIGV4dGVuZHMgU2NlbmVfMS5TY2VuZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuc2NlbmVJbmRleCA9IDA7XG4gICAgfVxuICAgIG9uRW50ZXIoKSB7IH1cbiAgICBvbkV4aXQoKSB7IH1cbiAgICB1cGRhdGUoZ2FtZSkge1xuICAgICAgICBpZiAoZ2FtZS5rZXlEb3duLmhhcyhLZXlfMS5LZXkuU1BBQ0UpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zY2VuZUluZGV4O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZ2FtZS5jdHguZm9udCA9ICc0MHB4IEFyaWFsJztcbiAgICAgICAgICAgIGdhbWUuY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XG4gICAgICAgICAgICBnYW1lLmN0eC5maWxsVGV4dCgnUHJlc3MgU3BhY2UgdG8gUGxheScsIGdhbWUud2lkdGggLyAzLjUsIGdhbWUuaGVpZ2h0IC8gMik7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnRzLlN0YXJ0TWVudVNjZW5lID0gU3RhcnRNZW51U2NlbmU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUGxheWVyQ29sbGlkZXJTeXN0ZW0gPSB2b2lkIDA7XG5jb25zdCBDb2xsaWRlcl8xID0gcmVxdWlyZShcIi4uL0NvbXBvbmVudHMvQ29sbGlkZXJcIik7XG5jb25zdCBQb3NpdGlvbl8xID0gcmVxdWlyZShcIi4uL0NvbXBvbmVudHMvUG9zaXRpb25cIik7XG5jb25zdCBSZW5kZXJfMSA9IHJlcXVpcmUoXCIuLi9Db21wb25lbnRzL1JlbmRlclwiKTtcbmNvbnN0IFN5c3RlbV8xID0gcmVxdWlyZShcIi4uL0VuZ2luZS9TeXN0ZW1cIik7XG5jbGFzcyBQbGF5ZXJDb2xsaWRlclN5c3RlbSBleHRlbmRzIFN5c3RlbV8xLlN5c3RlbSB7XG4gICAgY29uc3RydWN0b3IocGxheWVySUQpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jb21wb25lbnRzUmVxdWlyZWQgPSBuZXcgU2V0KFtQb3NpdGlvbl8xLlBvc2l0aW9uLCBSZW5kZXJfMS5SZW5kZXIsIENvbGxpZGVyXzEuQ29sbGlkZXJdKTtcbiAgICAgICAgdGhpcy5wbGF5ZXJJRCA9IHBsYXllcklEO1xuICAgIH1cbiAgICB1cGRhdGUoZ2FtZSwgZW50aXRpZXMpIHtcbiAgICAgICAgY29uc3QgcGxheWVyUG9zID0gdGhpcy5lY3MuZ2V0Q29tcG9uZW50cyh0aGlzLnBsYXllcklEKS5nZXQoUG9zaXRpb25fMS5Qb3NpdGlvbik7XG4gICAgICAgIGxldCBjb2xsaXNpb25Gb3VuZCA9IGZhbHNlO1xuICAgICAgICBmb3IgKGxldCBpZCBvZiBlbnRpdGllcykge1xuICAgICAgICAgICAgY29uc3QgYmxvY2tQb3MgPSB0aGlzLmVjcy5nZXRDb21wb25lbnRzKGlkKS5nZXQoUG9zaXRpb25fMS5Qb3NpdGlvbik7XG4gICAgICAgICAgICBpZiAocGxheWVyUG9zLmVxdWFscyhibG9ja1BvcykpIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXJQb3MueCA9IHBsYXllclBvcy5vbGRYO1xuICAgICAgICAgICAgICAgIHBsYXllclBvcy55ID0gcGxheWVyUG9zLm9sZFk7XG4gICAgICAgICAgICAgICAgY29sbGlzaW9uRm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghY29sbGlzaW9uRm91bmQpIHtcbiAgICAgICAgICAgIHBsYXllclBvcy5vbGRYID0gcGxheWVyUG9zLng7XG4gICAgICAgICAgICBwbGF5ZXJQb3Mub2xkWSA9IHBsYXllclBvcy55O1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0cy5QbGF5ZXJDb2xsaWRlclN5c3RlbSA9IFBsYXllckNvbGxpZGVyU3lzdGVtO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlBsYXllclN5c3RlbSA9IHZvaWQgMDtcbmNvbnN0IFBsYXllcl8xID0gcmVxdWlyZShcIi4uL0NvbXBvbmVudHMvUGxheWVyXCIpO1xuY29uc3QgUG9zaXRpb25fMSA9IHJlcXVpcmUoXCIuLi9Db21wb25lbnRzL1Bvc2l0aW9uXCIpO1xuY29uc3QgUmVuZGVyXzEgPSByZXF1aXJlKFwiLi4vQ29tcG9uZW50cy9SZW5kZXJcIik7XG5jb25zdCBLZXlfMSA9IHJlcXVpcmUoXCIuLi9FbmdpbmUvS2V5XCIpO1xuY29uc3QgU3lzdGVtXzEgPSByZXF1aXJlKFwiLi4vRW5naW5lL1N5c3RlbVwiKTtcbmNsYXNzIFBsYXllclN5c3RlbSBleHRlbmRzIFN5c3RlbV8xLlN5c3RlbSB7XG4gICAgY29uc3RydWN0b3Ioc2l6ZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudHNSZXF1aXJlZCA9IG5ldyBTZXQoW1Bvc2l0aW9uXzEuUG9zaXRpb24sIFJlbmRlcl8xLlJlbmRlciwgUGxheWVyXzEuUGxheWVyXSk7XG4gICAgICAgIHRoaXMuc2l6ZSA9IHNpemU7XG4gICAgfVxuICAgIHVwZGF0ZShnYW1lLCBlbnRpdGllcykge1xuICAgICAgICBpZiAoZW50aXRpZXMuc2l6ZSA+IDEpIHtcbiAgICAgICAgICAgIGFsZXJ0KCdmYXRhbCBlcnJvcjogdGhlcmUgc2hvdWxkIG5vdCBiZSBtb3JlIHRoYW4gb25lIHBsYXllciEnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcGxheWVySUQgPSBlbnRpdGllcy52YWx1ZXMoKS5uZXh0KCkudmFsdWU7XG4gICAgICAgIGxldCBwb3MgPSB0aGlzLmVjcy5nZXRDb21wb25lbnRzKHBsYXllcklEKS5nZXQoUG9zaXRpb25fMS5Qb3NpdGlvbik7XG4gICAgICAgIGNvbnN0IHggPSBwb3MueDtcbiAgICAgICAgY29uc3QgeSA9IHBvcy55O1xuICAgICAgICBmb3IgKGxldCBrZXkgb2YgZ2FtZS5rZXlQcmVzcykge1xuICAgICAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgICAgICBjYXNlIEtleV8xLktleS5BOlxuICAgICAgICAgICAgICAgIGNhc2UgS2V5XzEuS2V5LkxFRlQ6XG4gICAgICAgICAgICAgICAgICAgIHBvcy54IC09IDE7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwb3MueCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcy54ID0geDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtleV8xLktleS5TOlxuICAgICAgICAgICAgICAgIGNhc2UgS2V5XzEuS2V5LkRPV046XG4gICAgICAgICAgICAgICAgICAgIHBvcy55ICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwb3MueSA+PSB0aGlzLnNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcy55ID0geTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEtleV8xLktleS5EOlxuICAgICAgICAgICAgICAgIGNhc2UgS2V5XzEuS2V5LlJJR0hUOlxuICAgICAgICAgICAgICAgICAgICBwb3MueCArPSAxO1xuICAgICAgICAgICAgICAgICAgICBpZiAocG9zLnggPj0gdGhpcy5zaXplKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3MueCA9IHg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBLZXlfMS5LZXkuVzpcbiAgICAgICAgICAgICAgICBjYXNlIEtleV8xLktleS5VUDpcbiAgICAgICAgICAgICAgICAgICAgcG9zLnkgLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvcy55IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9zLnkgPSB5O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIC8vIG5vdGhpbmcgdG8gZG8gaW4gdGhlIGRlZmF1bHQgY2FzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0cy5QbGF5ZXJTeXN0ZW0gPSBQbGF5ZXJTeXN0ZW07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUmVuZGVyU3lzdGVtID0gdm9pZCAwO1xuY29uc3QgUG9zaXRpb25fMSA9IHJlcXVpcmUoXCIuLi9Db21wb25lbnRzL1Bvc2l0aW9uXCIpO1xuY29uc3QgUmVuZGVyXzEgPSByZXF1aXJlKFwiLi4vQ29tcG9uZW50cy9SZW5kZXJcIik7XG5jb25zdCBTeXN0ZW1fMSA9IHJlcXVpcmUoXCIuLi9FbmdpbmUvU3lzdGVtXCIpO1xuY2xhc3MgUmVuZGVyU3lzdGVtIGV4dGVuZHMgU3lzdGVtXzEuU3lzdGVtIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5jb21wb25lbnRzUmVxdWlyZWQgPSBuZXcgU2V0KFtQb3NpdGlvbl8xLlBvc2l0aW9uLCBSZW5kZXJfMS5SZW5kZXJdKTtcbiAgICB9XG4gICAgdXBkYXRlKGdhbWUsIGVudGl0aWVzKSB7XG4gICAgICAgIGNvbnN0IHhNb2QgPSBnYW1lLndpZHRoIC8gMjA7XG4gICAgICAgIGNvbnN0IHlNb2QgPSBnYW1lLmhlaWdodCAvIDIwO1xuICAgICAgICBmb3IgKGxldCBlbnRpdHkgb2YgZW50aXRpZXMudmFsdWVzKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlbmRlciA9IHRoaXMuZWNzLmdldENvbXBvbmVudHMoZW50aXR5KS5nZXQoUmVuZGVyXzEuUmVuZGVyKTtcbiAgICAgICAgICAgIGNvbnN0IHBvcyA9IHRoaXMuZWNzLmdldENvbXBvbmVudHMoZW50aXR5KS5nZXQoUG9zaXRpb25fMS5Qb3NpdGlvbik7XG4gICAgICAgICAgICBnYW1lLmN0eC5maWxsU3R5bGUgPSByZW5kZXIuY29sb3I7XG4gICAgICAgICAgICBnYW1lLmN0eC5maWxsUmVjdChwb3MueCAqIHhNb2QgKyB4TW9kICogcmVuZGVyLm9mZnNldCwgcG9zLnkgKiB5TW9kICsgeU1vZCAqIHJlbmRlci5vZmZzZXQsIHhNb2QgKiByZW5kZXIuc2l6ZSwgeU1vZCAqIHJlbmRlci5zaXplKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMuUmVuZGVyU3lzdGVtID0gUmVuZGVyU3lzdGVtO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgU3RhcnRNZW51U2NlbmVfMSA9IHJlcXVpcmUoXCIuL1NjZW5lcy9TdGFydE1lbnVTY2VuZVwiKTtcbmNvbnN0IE1hemVHYW1lU2NlbmVfMSA9IHJlcXVpcmUoXCIuL1NjZW5lcy9NYXplR2FtZVNjZW5lXCIpO1xuY29uc3QgR2FtZV8xID0gcmVxdWlyZShcIi4vRW5naW5lL0dhbWVcIik7XG5jb25zdCBHYW1lT3ZlclNjZW5lXzEgPSByZXF1aXJlKFwiLi9TY2VuZXMvR2FtZU92ZXJTY2VuZVwiKTtcbmNvbnN0IGdhbWUgPSBuZXcgR2FtZV8xLkdhbWUoKTtcbmNvbnN0IG1lbnVTY2VuZSA9IG5ldyBTdGFydE1lbnVTY2VuZV8xLlN0YXJ0TWVudVNjZW5lKCk7XG5jb25zdCBnYW1lU2NlbmUgPSBuZXcgTWF6ZUdhbWVTY2VuZV8xLk1hemVHYW1lU2NlbmUoKTtcbmNvbnN0IGdhbWVPdmVyU2NlbmUgPSBuZXcgR2FtZU92ZXJTY2VuZV8xLkdhbWVPdmVyU2NlbmUoKTtcbmNvbnN0IG1haW5NZW51SW5kZXggPSBnYW1lLmFkZFNjZW5lKG1lbnVTY2VuZSk7XG5jb25zdCBnYW1lSW5kZXggPSBnYW1lLmFkZFNjZW5lKGdhbWVTY2VuZSk7XG5jb25zdCBnYW1lT3ZlckluZGV4ID0gZ2FtZS5hZGRTY2VuZShnYW1lT3ZlclNjZW5lKTtcbm1lbnVTY2VuZS5zY2VuZUluZGV4ID0gZ2FtZUluZGV4O1xuZ2FtZVNjZW5lLnNjZW5lSW5kZXggPSBnYW1lT3ZlckluZGV4O1xuZ2FtZU92ZXJTY2VuZS5zY2VuZUluZGV4ID0gbWFpbk1lbnVJbmRleDtcbmdhbWUuc3RhcnQoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==