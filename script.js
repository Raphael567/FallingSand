const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let grid;
const w = 5;
let cols, rows;
let hueValue = 200;

function make2DArray(cols, rows) {
    const arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows).fill(0);
    }
    return arr;
}

function withinCols(i) {
    return i >= 0 && i < cols;
}

function withinRows(j) {
    return j >= 0 && j < rows;
}

function setup() {
    cols = Math.floor(canvas.width / w);
    rows = Math.floor(canvas.height / w);
    grid = make2DArray(cols, rows);
    draw();
}

function addsand(mouseX, mouseY) {
    const mouseCol = Math.floor(mouseX / w);
    const mouseRow = Math.floor(mouseY / w);
    const matrix = 5;
    const extent = Math.floor(matrix / 2);
    for (let i = -extent; i <= extent; i++) {
        for (let j = -extent; j <= extent; j++) {
            if (Math.random() < 0.75) {
                const col = mouseCol + i;
                const row = mouseRow + j;
                if (withinCols(col) && withinRows(row)) {
                    grid[col][row] = hueValue;
                }
            }
        }
    }
    hueValue = (hueValue + 1) % 360;
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const state = grid[i][j];
            if (state > 0) {
                ctx.fillStyle = `hsl(${state}, 100%, 50%)`;
                ctx.fillRect(i * w, j * w, w, w);
            }
        }
    }

    const nextGrid = make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
        for ( let j = 0; j < rows; j++) {
            const state = grid[i][j];
            if (state > 0) {
                const below = grid[i][j + 1];
                const dir = Math.random() < 0.5 ? -1 : 1;
                let belowA = withinCols(i + dir) ? grid[i + dir][j + 1] : -1;
                let belowB = withinCols(i - dir) ? grid[i - dir][j + 1] : -1;

                if (below == 0) {
                    nextGrid[i][j + 1] = state;
                } else if (belowA === 0 ) {
                    nextGrid[i + dir][j + 1] = state;
                } else if (belowB === 0) {
                    nextGrid[i - dir][j + 1] = state;
                } else {
                    nextGrid[i][j] = state;
                }
            }
        }
    }
    grid = nextGrid;

    requestAnimationFrame(draw);
}

canvas.addEventListener('mousemove', function(event) {
    if (event.buttons > 0) {
        addsand(event.offsetX, event.offsetY)
    }
});

setup();