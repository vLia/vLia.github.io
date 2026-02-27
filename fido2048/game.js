const SIZE = 4;
const START_TILES = 2;

let grid;
let score = 0;
let bestScore = 0;

let boardEl;
let scoreEl;
let bestScoreEl;
let newGameBtn;

function init() {
  bestScore = Number(localStorage.getItem("fido2048_best") || 0);
  bestScoreEl.textContent = bestScore;

  grid = Array(SIZE).fill().map(() => Array(SIZE).fill(0)); // Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  console.log(grid);
  score = 0;
  updateScore(0);
  setupBoardDom();
  spawnStartTiles();
  render();
}

function setupBoardDom() {
  boardEl.innerHTML = "";
  for (let i = 0; i < SIZE * SIZE; i++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    const inner = document.createElement("div");
    inner.className = "tile-inner";
    const value = document.createElement("span");
    value.className = "tile-value";
    tile.appendChild(inner);
    tile.appendChild(value);
    boardEl.appendChild(tile);
  }
}

function spawnStartTiles() {
  for (let i = 0; i < START_TILES; i++) {
    spawnRandomTile();
  }
}

function emptyCells() {
  const cells = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) cells.push({ r, c });
    }
  }
  return cells;
}

function spawnRandomTile() {
  const empties = emptyCells();
  if (!empties.length) return;
  const { r, c } = empties[Math.floor(Math.random() * empties.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function updateScore(delta) {
  score += delta;
  scoreEl.textContent = score;
  if (score > bestScore) {
    bestScore = score;
    bestScoreEl.textContent = bestScore;
    localStorage.setItem("fido2048_best", String(bestScore));
  }
}

function slideAndMerge(row) {
  const filtered = row.filter((v) => v !== 0);
  const merged = [];
  let gained = 0;

  for (let i = 0; i < filtered.length; i++) {
    if (filtered[i] === filtered[i + 1]) {
      const value = filtered[i] * 2;
      merged.push(value);
      gained += value;
      i++;
    } else {
      merged.push(filtered[i]);
    }
  }

  while (merged.length < SIZE) {
    merged.push(0);
  }

  return { row: merged, gained };
}

function move(direction) {
  let moved = false;
  let totalGained = 0;

  if (direction === "left" || direction === "right") {
    for (let r = 0; r < SIZE; r++) {
      let row = grid[r].slice();
      if (direction === "right") row.reverse();

      const { row: merged, gained } = slideAndMerge(row);

      let finalRow = direction === "right" ? merged.slice().reverse() : merged;

      if (!arraysEqual(grid[r], finalRow)) {
        grid[r] = finalRow;
        moved = true;
      }
      totalGained += gained;
    }
  } else {
    for (let c = 0; c < SIZE; c++) {
      let col = [];
      for (let r = 0; r < SIZE; r++) col.push(grid[r][c]);
      if (direction === "down") col.reverse();

      const { row: merged, gained } = slideAndMerge(col);
      let finalCol = direction === "down" ? merged.slice().reverse() : merged;

      for (let r = 0; r < SIZE; r++) {
        if (grid[r][c] !== finalCol[r]) {
          grid[r][c] = finalCol[r];
          moved = true;
        }
      }
      totalGained += gained;
    }
  }

  if (moved) {
    updateScore(totalGained);
    spawnRandomTile();
    render();
    if (isGameOver()) {
      setTimeout(() => {
        alert("No more moves left. Game over!");
      }, 10);
    }
  }
}

function arraysEqual(a, b) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

function tileImageForValue(value) {
  if (!value) return "";
  return `images/${value}.png`;
}

function render() {
  const tiles = boardEl.querySelectorAll(".tile");

  let index = 0;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const value = grid[r][c];
      const tile = tiles[index];
      const inner = tile.querySelector(".tile-inner");
      const valueEl = tile.querySelector(".tile-value");

      tile.classList.remove("spawn", "merge");

      if (value === 0) {
        inner.style.backgroundImage = "";
        inner.style.backgroundColor = "rgba(15,23,42,0.8)";
        valueEl.textContent = "";
      } else {
        const img = tileImageForValue(value);
        inner.style.backgroundImage = `url('${img}')`;
        inner.style.backgroundColor = "#ffffff";
        valueEl.textContent = value;
      }

      index++;
    }
  }
}

function isGameOver() {
  if (emptyCells().length > 0) return false;

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const value = grid[r][c];
      if (r < SIZE - 1 && grid[r + 1][c] === value) return false;
      if (c < SIZE - 1 && grid[r][c + 1] === value) return false;
    }
  }
  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  boardEl = document.getElementById("board");
  scoreEl = document.getElementById("score");
  bestScoreEl = document.getElementById("bestScore");
  newGameBtn = document.getElementById("newGameBtn");

  if (!boardEl || !scoreEl || !bestScoreEl || !newGameBtn) {
    return;
  }

  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        move("up");
        break;
      case "ArrowDown":
        e.preventDefault();
        move("down");
        break;
      case "ArrowLeft":
        e.preventDefault();
        move("left");
        break;
      case "ArrowRight":
        e.preventDefault();
        move("right");
        break;
      default:
        break;
    }
  });

  // Basic swipe support
  let touchStartX = 0;
  let touchStartY = 0;

  boardEl.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  });

  boardEl.addEventListener("touchend", (e) => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const threshold = 30;

    if (Math.max(absDx, absDy) < threshold) return;

    if (absDx > absDy) {
      move(dx > 0 ? "right" : "left");
    } else {
      move(dy > 0 ? "down" : "up");
    }
  });

  newGameBtn.addEventListener("click", () => {
    init();
  });

  init();
});

