const gameConfig = {
  gameWidth: 500,
  gameHeight: 500,
  boardBackground: "lightgreen",
  paddle1Color: "lightblue",
  paddle2Color: "red",
  paddleBorder: "black",
  ballColor: "white",
  ballBorderColor: "black",
  ballRadius: 12.5,
  initialPaddleSpeed: 5,
  initialBallSpeed: 2.5,
  scoreText: document.querySelector("#scoreText"),
  resetBtn: document.querySelector("#resetBtn"),
  gameBoard: document.querySelector("#gameBoard"),
  ctx: document.querySelector("#gameBoard").getContext("2d"),
  gameMode: "ai", // Default game mode
};

const keys = {
  paddle1Up: false,
  paddle1Down: false,
  paddle2Up: false,
  paddle2Down: false,
};

const paddle1 = {
  width: 25,
  height: 100,
  x: 0,
  y: 0,
};

const paddle2 = {
  width: 25,
  height: 100,
  x: gameConfig.gameWidth - 25,
  y: gameConfig.gameHeight - 100,
};

let ball = {
  x: gameConfig.gameWidth / 2,
  y: gameConfig.gameHeight / 2,
  speed: gameConfig.initialBallSpeed,
  xDirection: 0,
  yDirection: 0,
};

let player1Score = 0;
let player2Score = 0;
let intervalID;

document.addEventListener("DOMContentLoaded", () => {
  gameConfig.resetBtn.addEventListener("click", resetGame);
  document
    .querySelector("#aiModeBtn")
    .addEventListener("click", () => setGameMode("ai"));
  document
    .querySelector("#playerModeBtn")
    .addEventListener("click", () => setGameMode("player"));
  window.addEventListener("keydown", (event) => changeDirection(event, true));
  window.addEventListener("keyup", (event) => changeDirection(event, false));
  gameStart();
});

function setGameMode(mode) {
  gameConfig.gameMode = mode;
  resetGame();
}

function gameStart() {
  createBall();
  nextTick();
}

function nextTick() {
  intervalID = setTimeout(() => {
    clearBoard();
    drawPaddles();
    moveBall();
    drawBall(ball.x, ball.y);
    checkCollision();
    movePaddles();
    if (gameConfig.gameMode === "ai") {
      moveAIPaddle(); // Move the AI paddle
    }
    requestAnimationFrame(nextTick);
  }, 10);
}

function clearBoard() {
  gameConfig.ctx.fillStyle = gameConfig.boardBackground;
  gameConfig.ctx.fillRect(0, 0, gameConfig.gameWidth, gameConfig.gameHeight);
}

function drawPaddles() {
  gameConfig.ctx.strokeStyle = gameConfig.paddleBorder;

  gameConfig.ctx.fillStyle = gameConfig.paddle1Color;
  gameConfig.ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
  gameConfig.ctx.strokeRect(
    paddle1.x,
    paddle1.y,
    paddle1.width,
    paddle1.height
  );

  gameConfig.ctx.fillStyle = gameConfig.paddle2Color;
  gameConfig.ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
  gameConfig.ctx.strokeRect(
    paddle2.x,
    paddle2.y,
    paddle2.width,
    paddle2.height
  );
}

function createBall() {
  ball.speed = gameConfig.initialBallSpeed;
  ball.xDirection = Math.round(Math.random()) === 1 ? 1 : -1;
  ball.yDirection = Math.random() * (Math.round(Math.random()) === 1 ? 1 : -1);
  ball.x = gameConfig.gameWidth / 2;
  ball.y = gameConfig.gameHeight / 2;
  drawBall(ball.x, ball.y);
}

function moveBall() {
  ball.x += ball.speed * ball.xDirection;
  ball.y += ball.speed * ball.yDirection;
}

function drawBall(ballX, ballY) {
  gameConfig.ctx.fillStyle = gameConfig.ballColor;
  gameConfig.ctx.strokeStyle = gameConfig.ballBorderColor;
  gameConfig.ctx.lineWidth = 2;
  gameConfig.ctx.beginPath();
  gameConfig.ctx.arc(ballX, ballY, gameConfig.ballRadius, 0, 2 * Math.PI);
  gameConfig.ctx.stroke();
  gameConfig.ctx.fill();
}

function checkCollision() {
  if (
    ball.y <= 0 + gameConfig.ballRadius ||
    ball.y >= gameConfig.gameHeight - gameConfig.ballRadius
  ) {
    ball.yDirection *= -1;
  }
  if (ball.x <= 0) {
    player2Score += 1;
    updateScore();
    createBall();
    return;
  }
  if (ball.x >= gameConfig.gameWidth) {
    player1Score += 1;
    updateScore();
    createBall();
    return;
  }
  if (
    ball.x <= paddle1.x + paddle1.width + gameConfig.ballRadius &&
    ball.y > paddle1.y &&
    ball.y < paddle1.y + paddle1.height
  ) {
    ball.x = paddle1.x + paddle1.width + gameConfig.ballRadius;
    ball.xDirection *= -1;
    ball.speed += 0.35;
  }
  if (
    ball.x >= paddle2.x - gameConfig.ballRadius &&
    ball.y > paddle2.y &&
    ball.y < paddle2.y + paddle2.height
  ) {
    ball.x = paddle2.x - gameConfig.ballRadius;
    ball.xDirection *= -1;
    ball.speed += 0.35;
  }
}

function changeDirection(event, isKeyDown) {
  const keyPressed = event.keyCode;
  const paddle1Up = 87; // 'W' key
  const paddle1Down = 83; // 'S' key
  const paddle2Up = 38; // Up arrow key
  const paddle2Down = 40; // Down arrow key

  // Prevent default behavior for arrow keys
  if (keyPressed === paddle2Up || keyPressed === paddle2Down) {
    event.preventDefault();
  }

  switch (keyPressed) {
    case paddle1Up:
      keys.paddle1Up = isKeyDown;
      break;
    case paddle1Down:
      keys.paddle1Down = isKeyDown;
      break;
    case paddle2Up:
      keys.paddle2Up = isKeyDown;
      break;
    case paddle2Down:
      keys.paddle2Down = isKeyDown;
      break;
  }
}

function movePaddles() {
  const paddleSpeed = Math.max(
    gameConfig.initialPaddleSpeed,
    ball.speed * 0.75
  );

  if (keys.paddle1Up && paddle1.y > 0) {
    paddle1.y -= paddleSpeed;
  }
  if (keys.paddle1Down && paddle1.y < gameConfig.gameHeight - paddle1.height) {
    paddle1.y += paddleSpeed;
  }
  if (gameConfig.gameMode === "player") {
    if (keys.paddle2Up && paddle2.y > 0) {
      paddle2.y -= paddleSpeed;
    }
    if (
      keys.paddle2Down &&
      paddle2.y < gameConfig.gameHeight - paddle2.height
    ) {
      paddle2.y += paddleSpeed;
    }
  }
}

function moveAIPaddle() {
  const aiSpeed = Math.max(gameConfig.initialPaddleSpeed, ball.speed * 0.75); // AI paddle speed
  const targetY = ball.y - paddle2.height / 2;
  const distance = targetY - paddle2.y;
  paddle2.y += Math.sign(distance) * Math.min(aiSpeed, Math.abs(distance));
  // Ensure the AI paddle stays within the game boundaries
  if (paddle2.y < 0) {
    paddle2.y = 0;
  }
  if (paddle2.y > gameConfig.gameHeight - paddle2.height) {
    paddle2.y = gameConfig.gameHeight - paddle2.height;
  }
}

function updateScore() {
  gameConfig.scoreText.textContent = `${player1Score} : ${player2Score}`;
}

function resetGame() {
  player1Score = 0;
  player2Score = 0;
  paddle1.y = 0;
  paddle2.y = gameConfig.gameHeight - paddle2.height;
  ball.speed = gameConfig.initialBallSpeed;
  ball.x = gameConfig.gameWidth / 2;
  ball.y = gameConfig.gameHeight / 2;
  ball.xDirection = 0;
  ball.yDirection = 0;
  updateScore();
  clearInterval(intervalID);
  gameStart();
}
