const board = document.getElementById("game-board");
let score = 0;
const scoreDisplay = document.getElementById("score");
let currentRotation = 0;


const cols = 10;
const rows = 20;
const cells = [];
const tetrominoes = {
  I: [
    [0, 1, 2, 3],
    [1, cols + 1, cols * 2 + 1, cols * 3 + 1],
    [cols * 3, cols * 3 + 1, cols * 3 + 2, cols * 3 + 3],
    [2, cols + 2, cols * 2 + 2, cols * 3 + 2],
  ],
  L: [
    [0, 1, 2, cols + 2],
    [1, cols + 1, cols * 2 + 1, cols * 2],
    [0, cols, cols + 1, cols + 2],
    [1, 0, cols, cols * 2],
  ],
  J: [
    [0, 1, 2, cols], // 0度
    [1, cols + 1, cols * 2 + 1, cols * 2], // 90度
    [cols, cols + 1, cols + 2, 2], // 180度
    [0, 1, cols, cols * 2] // = [0, 1, 10, 20]
  ],
  O: [
    [0, 1, cols, cols + 1],
  ],
  T: [
    [1, cols, cols + 1, cols + 2],
    [1, cols + 1, cols + 2, cols * 2 + 1],
    [cols, cols + 1, cols + 2, cols * 2 + 1],
    [1, cols, cols + 1, cols * 2 + 1],
  ],
  S: [
    [1, 2, cols, cols + 1],
    [0, cols, cols + 1, cols * 2 + 1],
    [1, 2, cols, cols + 1],
    [0, cols, cols + 1, cols * 2 + 1],
  ],
  Z: [
    [0, 1, cols + 1, cols + 2],
    [2, cols + 1, cols + 2, cols * 2 + 1],
    [0, 1, cols + 1, cols + 2],
    [2, cols + 1, cols + 2, cols * 2 + 1],
  ],
};

const tetrominoColors = {
    I: "skyblue",
    L: "orange",
    O: "yellow",
    T: "purple",
    S: "green",
    Z: "red",
    J: "blue",
 };
  
  let currentShape = tetrominoes.J[currentRotation];
  let currentShapeName = "J"; // 初期ブロック名
  let currentPosition = Math.floor(cols / 2) - 2; // 中央から開始するために調整

  
// マス目を作る
for (let i = 0; i < rows * cols; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  board.appendChild(cell);
  cells.push(cell);
}


function draw() {
  const color = tetrominoColors[currentShapeName]; // 現在のテトリミノの色を取得
  currentShape.forEach(i => {
    cells[currentPosition + i].style.backgroundColor = color;
  });
}
  
  function undraw() {
    currentShape.forEach(i => {
      cells[currentPosition + i].style.backgroundColor = "#000000";
    });
  }
  

// ブロックを1行下へ移動
let timerId = setInterval(moveDown, 200); // ← タイマーを変数にする

function moveDown() {
    undraw();
  
    const isAtBottom = currentShape.some(i => {
      return currentPosition + i + cols >= cols * rows ||
             cells[currentPosition + i + cols].classList.contains("taken");
    });
  
    if (isAtBottom) {
      currentShape.forEach(i => {
        cells[currentPosition + i].classList.add("taken");
      });
      draw(); // 固定状態を表示
      clearInterval(timerId); // 落下を一旦止める
      checkLineClear(); // 一列消す
      spawnNewBlock(); // 次のブロックを出す
      return;
    }
  
    currentPosition += cols;
    draw();
  }
  


// 初期描画
draw();


// テトリミノを動かすよー
document.addEventListener("keydown", control);

function control(e) {
    if (e.key === "ArrowLeft") {
    moveLeft();
    } else if (e.key === "ArrowRight") {
    moveRight();
    } else if (e.key === "ArrowUp") {
    rotate();
  }
}


function moveLeft() {
    undraw();
    const isAtLeftEdge = currentShape.some(i => (currentPosition + i) % cols === 0);
    if (!isAtLeftEdge) currentPosition -= 1;
    draw();
  }
  
  function moveRight() {
    undraw();
    const isAtRightEdge = currentShape.some(i => (currentPosition + i) % cols === cols - 1);
    if (!isAtRightEdge) currentPosition += 1;
    draw();
  }

  
  

  function spawnNewBlock() {
    const keys = Object.keys(tetrominoes);
    const randKey = keys[Math.floor(Math.random() * keys.length)];
    currentShapeName = randKey;
    currentRotation = 0;
    currentShape = tetrominoes[currentShapeName][currentRotation];
    currentPosition = Math.floor(cols / 2) - 2;
  
    const isGameOver = currentShape.some(i => cells[currentPosition + i].classList.contains("taken"));
    if (isGameOver) {
      alert("ゲームオーバー！");
      clearInterval(timerId);
      return;
    }
  
    draw();
    timerId = setInterval(moveDown, 200);
  }
  
  function rotate() {
    undraw();
    currentRotation = (currentRotation + 1) % tetrominoes[currentShapeName].length;
    currentShape = tetrominoes[currentShapeName][currentRotation];
  
    // 壁にめり込むのを防ぐ簡易調整（必要なら改良可能）
    const rightEdge = currentShape.some(i => (currentPosition + i) % cols === cols - 1);
    const leftEdge = currentShape.some(i => (currentPosition + i) % cols === 0);
    if (rightEdge) currentPosition -= 1;
    if (leftEdge) currentPosition += 1;
  
    draw();
  }
  
  
  
//一列消す
function checkLineClear() {
    for (let row = 0; row < rows; row++) {
      const start = row * cols;
      const line = cells.slice(start, start + cols);
  
      const isFull = line.every(cell => cell.classList.contains("taken"));
  
      if (isFull) {
        // スコアを加算（例：1行100点）
        score += 100;
        scoreDisplay.textContent = score;
  
        // 行をクリア
        line.forEach(cell => {
          cell.classList.remove("taken");
          cell.style.backgroundColor = "#000000";
        });
  
        const removed = cells.splice(start, cols);
        cells.unshift(...removed);
  
        cells.forEach(cell => board.appendChild(cell));
      }
    }
}
  