boardSize = 4;

function initializeBoard() {
    board = Array(boardSize).fill().map(() => Array(boardSize).fill(0));
    score = 0;
    addNewTile();
    addNewTile();
}

function addNewTile() {
    let emptyTiles = [];

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j] === 0) {
                emptyTiles.push({ x: i, y: j });
            }
        }
    }

    if (emptyTiles.length > 0) {
        let { x, y } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
}

function drawBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const tileValue = board[i][j];

            if (tileValue > 0) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.textContent = tileValue;
                tile.classList.add(`tile-${tileValue}`);
                tile.style.transform = `translate(${j * 100}px, ${i * 100}px)`;
                gameBoard.appendChild(tile);
            }
        }
    }

    document.getElementById('score').textContent = `Score: ${score}`;
}

function handleInput(event) {
    if (isGameOver()) return;

    switch (event.key) {
        case 'ArrowUp':
            moveUp();
            break;
        case 'ArrowDown':
            moveDown();
            break;
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
        default:
            return;
    }

    addNewTile();
    drawBoard();
}

function slide(row) {
    let arr = row.filter(val => val);
    let missing = boardSize - arr.length;
    let zeros = Array(missing).fill(0);
    return arr.concat(zeros);
}

function combine(row) {
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] !== 0 && row[i] === row[i + 1]) {
            row[i] *= 2;
            score += row[i];
            row[i + 1] = 0;
        }
    }
    return row;
}


function isGameOver() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j] === 0) return false;
            if (j < boardSize - 1 && board[i][j] === board[i][j + 1]) return false;
            if (i < boardSize - 1 && board[i][j] === board[i + 1][j]) return false;
        }
    }
    return true;
}
