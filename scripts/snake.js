let GAME_OVER = false;
const GRID_SIZE = 100;
const PLAYER = [{ x: 10, y: 10 }];
const SEEDS = [
  { x: 40, y: 50 },
  { x: 32, y: 10 },
];

const board = document.getElementById("board");

const start = () => {
  drawPlayer();
  drawSeeds();
};

const drawPlayer = () => {
  const player = document.createElement("div");
  player.setAttribute("id", "player");
  player.style.gridColumn = PLAYER.at(-1).x;
  player.style.gridRow = PLAYER.at(-1).y;
  board.appendChild(player);
};

const drawSeeds = () => {
  const seed = document.createElement("div");
  seed.setAttribute("id", "seed");
  seed.style.gridColumn = SEEDS.at(-1).x;
  seed.style.gridRow = SEEDS.at(-1).y;
  board.appendChild(seed);
};

const isVictory = () => {
  const lastPlayerItem = PLAYER.at(-1);
  const isSeedRevived = SEEDS.some(
    (seed) => seed.x === lastPlayerItem.x && seed.y === lastPlayerItem.y
  );

  if (isSeedRevived) {
    victoryAnimation();
  }
};

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

const getItemCondition = (item, i, fertilizedTiles) => {
  const isBelowMaxTiles = i < fertilizedTiles;
  const isInGrid = item.x + i < GRID_SIZE;
  return isInGrid && isBelowMaxTiles;
};
const animateItem = async (item, delay) => {
  const fertilizedTiles = 5;

  for (let i = 0; getItemCondition(item, i, fertilizedTiles); i++) {
    const plantBottom = document.createElement("div");
    plantBottom.setAttribute("id", "plant");
    plantBottom.style.gridColumn = item.x;
    plantBottom.style.gridRow = item.y + i;
    board.appendChild(plantBottom);

    const plantTop = document.createElement("div");
    plantTop.setAttribute("id", "plant");
    plantTop.style.gridColumn = item.x;
    plantTop.style.gridRow = item.y - i;
    board.appendChild(plantTop);
    await timer(delay);
  }
};

const victoryAnimation = async () => {
  const delay = 50; // durée du délai entre chaque animation
  const overlap = 10; // durée de chevauchement entre les animations
  for (let i = 0; i < PLAYER.length; i++) {
    const item = PLAYER[i];
    // delay - overlap * items.length sera toujours supérieur au delay entre chaque item
    animateItem(item, delay - overlap);
    await timer(delay);
  }
};

const handlePlayer = (x, y) => {
  PLAYER.push({ x, y });
  isVictory();
  drawPlayer();
};

const handleKeyDown = (event) => {
  if (GAME_OVER) return;

  switch (event.key) {
    case "ArrowUp":
      handlePlayer(PLAYER.at(-1).x, PLAYER.at(-1).y - 1);
      break;
    case "ArrowDown":
      handlePlayer(PLAYER.at(-1).x, PLAYER.at(-1).y + 1);
      break;
    case "ArrowRight":
      handlePlayer(PLAYER.at(-1).x + 1, PLAYER.at(-1).y);
      break;
    case "ArrowLeft":
      handlePlayer(PLAYER.at(-1).x - 1, PLAYER.at(-1).y);
      break;
  }
};

document.addEventListener("keydown", handleKeyDown);

start();
