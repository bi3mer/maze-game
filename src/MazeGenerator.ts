function getValidNeighbors(
    size: number,
    pos: [number, number],
    visited: Set<string>|null): Array<[number, number]> {

    let neighbors: Array<[number, number]> = [
        [pos[0]+1, pos[1]],
        [pos[0]-1, pos[1]],
        [pos[0], pos[1]+1],
        [pos[0], pos[1]-1],
    ]

    let validNeighbors: Array<[number, number]> = []
    for(let i = 0; i < neighbors.length; ++i) {
        const x = neighbors[i][0];
        const y = neighbors[i][1];
        if(x < 0 || x > size || y < 0 || y >= size) {
            continue;
        }

        if(visited != null && visited.has(neighbors[i].join(','))) {
            continue;
        }

        validNeighbors.push(neighbors[i])
    }

    return validNeighbors;
}

export function getMaze(size: number): boolean[][] {
    // build the grid and initialize as true to represent that there exists
        // a wall.
        let grid: boolean[][] = [];
        for(let x = 0; x < size; ++x) {
            let row = []
            for (let y = 0; y < size; ++y) {
                row.push(true);
            }
            grid.push(row);
        }

        // top left and bottom right are always not walls.
        grid[0][0] = false;
        let visited: Set<string> = new Set();

        visited.add('0,0');
        // visited.add(`${size-1},${size-1}`);
        let stack: Array<[number, number]> = [[0,0]];
        let temp = 0;
        while (stack.length != 0) {
            // let currentPosition = stack.pop()!;
            let stackIndex = Math.floor(Math.random() * stack.length);
            let currentPosition = stack[stackIndex];
            stack.splice(stackIndex,1);

            // get neighbors and validate that they fit in the bounds and are
            // not visited
            let validatedNeighbors = getValidNeighbors(size, currentPosition, visited);

            // for every valid neighbor, we need to further verify that there 
            // are at least three walls around. Otherwise, it can not be turned
            // into an empty cell
            let modifiableNeighbors: Array<[number, number]> = []
            console.log('=============================================')
            for(let i = 0; i < validatedNeighbors.length; ++i) {
                console.log('---------------------')
                let accessibleNeighbors = getValidNeighbors(size, validatedNeighbors[i], null);
                console.log(validatedNeighbors[i],accessibleNeighbors.length);

                let wallCount = 4-accessibleNeighbors.length; // borders count as a wall
                for(let j = 0; j < accessibleNeighbors.length; ++j) {
                    const x = accessibleNeighbors[j][0];
                    const y = accessibleNeighbors[j][1];
                    console.log(x,y,grid[y][x])
                    if (grid[y][x]) {
                        ++wallCount;
                    }
                }
                
                console.log(wallCount);
                console.log('---------------------')
                if (wallCount > 2) {
                    modifiableNeighbors.push(validatedNeighbors[i]);
                }
            }

            if(modifiableNeighbors.length == 0) {
                continue;
            }

            let randomNeighbor = modifiableNeighbors[Math.floor(Math.random() * modifiableNeighbors.length)];
            grid[randomNeighbor[1]][randomNeighbor[0]] = false;
            stack.push(currentPosition);
            stack.push(randomNeighbor);
            visited.add(randomNeighbor.join(','))

            console.log(stack.join('||'));
            temp += 1;

            // if (temp > 20) {
            //     break;
            // }
        }

    return grid;
}