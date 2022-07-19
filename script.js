const canvas = document.getElementById("snakeBoard");
const context = canvas.getContext("2d");
const divForReferance = document.getElementById("main-div");
let divWidth = divForReferance.clientWidth;
const scoreBoard = document.getElementById("point-board");

if (divWidth > 1000) {
  canvas.width = 1000;
} else {
  canvas.width = divWidth;
}
canvas.height = 500;
let keydownEvents = [];
const SPACE_KEY = 32;
document.addEventListener("keydown", (event) => {
  if (event.keyCode == SPACE_KEY && HasDied()) {
    RestartGame();
  } else {
    keydownEvents.push(event);
  }
});
goshoColor = "#55d284";
goshoBoarderColor = "#f2cf07";
let gosho = [
  { x: 200, y: 200 },
  { x: 190, y: 200 },
  { x: 180, y: 200 },
  { x: 170, y: 200 },
  { x: 160, y: 200 },
];
let dx = 10;
let dy = 0;

let meats = [];
let vodkaBottles = [];
let vodkaEatenCount = 0;
let meatEaten = 0;
var points = 0;

var speed = 100;
for (let i = 0; i < 3; i++) {
  GenerateNewVodka();
  GenerateNewMeat();
}

Main();

function Main() {
  let lastTime = Date.now();
  const interval = setInterval(function onTick() {
    UpdateScore();
    ClearCanvas();
    if (Date.now() - lastTime > speed) {
      if (keydownEvents.length) {
        //const len = keydownEvents.length;
        const len = 1;
        for (let i = 0; i < len; i++) ChangeDirection(keydownEvents[i]);
        for (let i = 0; i < len; i++) keydownEvents.shift();
      }
      MoveSnake();
      lastTime = Date.now();
    }
    DrawSnake();
    if (HasDied()) {
      clearInterval(interval);
      points = 0;
      DeathMessage();
    }
  }, 0);
}
function DrawSnakePart(snakePart) {
  context.fillStyle = goshoColor;
  context.strokeStyle = goshoBoarderColor;
  context.fillRect(snakePart.x, snakePart.y, 10, 10);
  context.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function DrawSnake() {
  gosho.forEach(DrawSnakePart);
}
function ClearCanvas() {
  context.fillStyle = "gray";
  context.strokeStyle = "lime";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "#d46679";
  meats.forEach((meat) => context.fillRect(meat.x, meat.y, 10, 10));
  context.fillStyle = "#00ffff";
  vodkaBottles.forEach((vodka) => context.fillRect(vodka.x, vodka.y, 10, 10));
}
function MoveSnake() {
  const headNow = gosho[0];
  const head = { x: headNow.x + dx, y: headNow.y + dy };
  if (ElementsCollide(headNow, meats)) {
    gosho.unshift(head);
    meatEaten++;
    RemoveAllMeat();
    GenerateNewMeat();
  } else if (ElementsCollide(headNow, vodkaBottles)) {
    speed -= 5;
    vodkaEatenCount++;
    gosho.unshift(head);
    gosho.pop();
    RemoveAllVodka();
    GenerateNewVodka();
  } else {
    gosho.unshift(head);
    gosho.pop();
  }
}
function ChangeDirection(event) {
  const LEFT_KEY = 65;
  const LEFT_ARROW = 37;
  const RIGHT_KEY = 68;
  const RIGHT_ARROW = 39;
  const UP_KEY = 87;
  const UP_ARROW = 38;
  const DOWN_KEY = 83;
  const DOWN_ARROW = 40;
  const SPACE_KEY = 32;
  console.log(event);

  var keyPressed = event.keyCode;
  var goingUp = dy === -10;
  var goingDown = dy === 10;
  var goingRight = dx === 10;
  var goingLeft = dx === -10;

  if (
    (!goingRight && keyPressed === LEFT_KEY) ||
    (keyPressed === LEFT_ARROW && !goingRight)
  ) {
    dx = -10;
    dy = 0;
  }

  if (
    (!goingDown && keyPressed === UP_KEY) ||
    (keyPressed === UP_ARROW && !goingDown)
  ) {
    dx = 0;
    dy = -10;
  }

  if (
    (!goingLeft && keyPressed === RIGHT_KEY) ||
    (keyPressed === RIGHT_ARROW && !goingLeft)
  ) {
    dx = 10;
    dy = 0;
  }

  if (
    (!goingUp && keyPressed === DOWN_KEY) ||
    (keyPressed === DOWN_ARROW && !goingUp)
  ) {
    dx = 0;
    dy = 10;
  }
}
function UpdateScore() {
  scoreBoard.textContent = "0";
  points = meatEaten * (vodkaEatenCount + 1);
  scoreBoard.textContent = points;
}
function HasDied() {
  head = gosho[0];

  for (let i = 1; i < gosho.length; i++) {
    const hasColided = head.x === gosho[i].x && head.y === gosho[i].y;

    if (hasColided) {
      return true;
    }
  }
  let hitLeftWall = head.x < 0;
  let hitRightWall = head.x > canvas.width - 10;
  let hitTopWall = head.y < 0;
  let hitDownWall = head.y > canvas.height - 10;
  if (hitLeftWall || hitRightWall || hitTopWall || hitDownWall) {
    return true;
  }
}
function DeathMessage() {
  context.textAlign = "center";
  context.font = "30px Arial";
  context.fillStyle = "red";
  context.fillText(
    "Гошо умря от цироза",
    canvas.width / 2,
    canvas.height / 2 - 50
  );
  context.fillStyle = "white";
  context.fillText('Натисни "space"', canvas.width / 2, canvas.height / 2);
}

function RestartGame() {
  gosho = [
    { x: 200, y: 200 },
    { x: 190, y: 200 },
    { x: 180, y: 200 },
    { x: 170, y: 200 },
    { x: 160, y: 200 },
  ];

  dx = 10;
  dy = 0;
  speed = 100;
  vodkaEatenCount = 0;
  meatEaten = 0;
  RemoveAllMeat();
  GenerateNewMeat();
  RemoveAllVodka();
  GenerateNewVodka();
  Main();
}
function GenerateNewMeat() {
  var randomX = Math.floor(Math.random() * canvas.width);
  var randomY = Math.floor(Math.random() * canvas.height);
  var meat = { x: randomX, y: randomY };
  if (
    ElementsCollide(meat, vodkaBottles) ||
    meat.x % 10 !== 0 ||
    meat.y % 10 !== 0
  ) {
    GenerateNewMeat();
  } else {
    meats.unshift(meat);
  }
}
function RemoveAllMeat() {
  for (let i = 0; i < meats.length; i++) {
    meats.pop();
  }
}
function GenerateNewVodka() {
  var randomX = Math.floor(Math.random() * canvas.width);
  var randomY = Math.floor(Math.random() * canvas.height);
  var vodka = { x: randomX, y: randomY };
  if (
    ElementsCollide(vodka, meats) ||
    vodka.x % 10 !== 0 ||
    vodka.y % 10 !== 0
  ) {
    GenerateNewVodka();
  } else {
    vodkaBottles.unshift(vodka);
  }
}
function RemoveAllVodka() {
  for (let i = 0; i < vodkaBottles.length; i++) {
    vodkaBottles.pop();
  }
}
function ElementsCollide(object, collection) {
  for (let i = 0; i < collection.length; i++) {
    if (JSON.stringify(collection[i]) === JSON.stringify(object)) {
      return true;
    }
  }
  return false;
}
function FindCollision(collection1, collection2) {
  for (let i = 0; i < collection1.length; i++) {
    for (let j = 0; j < collection2.length; j++) {
      if (JSON.stringify(collection1[i]) === JSON.stringify(collection2[j])) {
        return (collision = { x: collection1[i].x, y: collection1[i].x });
      }
    }
  }
  return 0;
}
