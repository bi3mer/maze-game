export enum Key {
    LEFT = 0,
    RIGHT,
    DOWN,
    UP,
    A,
    S,
    D,
    F,
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

        default:
            console.warn(`Unhandled key: ${key}.`); 
            return Key.INVALID;
    }
}