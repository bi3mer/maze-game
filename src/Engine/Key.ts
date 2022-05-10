export enum Key {
    LEFT = 0,
    RIGHT,
    DOWN,
    UP,
    W,
    A,
    S,
    D,
    SPACE,
    ESCAPE,
    INVALID
}

export function keyCodeToKey(key: string): Key {
    switch(key) {
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