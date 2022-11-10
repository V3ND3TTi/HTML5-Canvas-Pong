let canvas;
let ctx;
let ballX = 50;
let ballY = 50;
let ballSpeedX = 10;
let ballSpeedY = 4;

let playerScore = 0;
let computerScore = 0;
const WINNING_SCORE = 3;

let gameOver = false;
let winner = false;

let lPaddleY = 250;
let rPaddleY = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;

const mousePos = (evt) => {
  let rect = canvas.getBoundingClientRect();
  let root = document.documentElement;
  let mouseX = evt.clientX - rect.left - root.scrollLeft;
  let mouseY = (evt.clientY = rect.top - root.scrollTop);
  return {
    x: mouseX,
    y: mouseY,
  };
};

const handleMouseClick = (evt) => {
  if (gameOver) {
    playerScore = 0;
    computerScore = 0;
    gameOver = false;
  }
};

window.onload = () => {
  canvas = document.getElementById('pongCanvas');
  ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth - 20;
  canvas.height = window.innerHeight - 20;

  var framesPerSecond = 30;
  setInterval(() => {
    move();
    draw();
  }, 1000 / framesPerSecond);

  canvas.addEventListener('mousedown', handleMouseClick);

  window.addEventListener('keydown', (evt) => {
    if (evt.key === 'ArrowUp') {
      lPaddleY -= 20;
    }
    if (evt.key === 'ArrowDown') {
      lPaddleY += 20;
    }
  });
};

const resetBall = () => {
  if (playerScore >= WINNING_SCORE) {
    gameOver = true;
    winner = true;
  }

  if (computerScore >= WINNING_SCORE) {
    gameOver = true;
    winner = false;
  }

  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedY = 4;
  ballSpeedX = -ballSpeedX;
};

const computerMove = () => {
  let rPaddleCenter = rPaddleY + PADDLE_HEIGHT / 2;
  if (rPaddleCenter < ballY - 35) {
    rPaddleY += 6;
  } else if (rPaddleCenter > ballY + 35) {
    rPaddleY -= 6;
  }
};

const move = () => {
  if (gameOver) return;

  computerMove();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX < 5) {
    if (ballY > lPaddleY && ballY < lPaddleY + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      let deltaY = ballY - (lPaddleY + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      computerScore++;
      resetBall();
    }
  }

  if (ballX > canvas.width - 5) {
    if (ballY > rPaddleY && ballY < rPaddleY + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      let deltaY = ballY - (rPaddleY + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      playerScore++;
      resetBall();
    }
  }

  if (ballY < 0) ballSpeedY = -ballSpeedY;
  if (ballY > canvas.height) ballSpeedY = -ballSpeedY;
};

const drawNet = () => {
  for (let i = 0; i < canvas.height; i += 40) {
    gameRects(canvas.width / 2 - 1, i, 2, 20, 'white');
  }
};

const draw = () => {
  // blacks out the playing board
  gameRects(0, 0, canvas.width, canvas.height, 'black');

  if (gameOver) {
    ctx.fillStyle = 'white';
    if (winner) {
      ctx.fillText(
        'You WIN! Click anywhere to play again.',
        canvas.width / 2 - 20,
        100
      );
    } else {
      ctx.fillText(
        'You LOST. Click anywhere to play again',
        canvas.width / 2 - 20,
        100
      );
    }
    return;
  }

  drawNet();

  // left player paddle
  gameRects(5, lPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

  // right player paddle
  gameRects(
    canvas.width - (PADDLE_WIDTH + 5),
    rPaddleY,
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
    'white'
  );
  // draws the ball
  drawBall(ballX, ballY, 10, 'white');

  ctx.fillText(playerScore, 200, 100, 16);
  ctx.fillText(computerScore, canvas.width - 200, 100, 16);
};

const drawBall = (centerX, centerY, radius, color) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  ctx.fill();
};

const gameRects = (leftX, topY, width, height, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(leftX, topY, width, height);
};
