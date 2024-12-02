let GAME_OVER = false;
const GRID_SIZE = 100;
const PLAYER = [{ x: 10, y: 10 }];
const SEEDS = [{ x: 40, y: 14 }];

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
const EMOJI_ITERATIONS = 4;
const randomNumberUpToN = (n) => Math.floor(Math.random() * n);
const randomNumberUpToNWeighted = (n, favoredNumber) => {
  // Créez une liste pondérée
  let weightedList = [];

  // Ajoutez les autres nombres
  for (let i = 0; i < n; i++) {
    weightedList.push(i);
  }

  // Ajoutez le nombre favorisé plusieurs fois
  const weight = 5; // Vous pouvez ajuster ce poids selon vos besoins
  for (let i = 0; i < weight; i++) {
    weightedList.push(favoredNumber);
  }

  // Sélectionnez un nombre aléatoire de la liste pondérée
  const randomIndex = Math.floor(Math.random() * weightedList.length);
  return weightedList[randomIndex];
};

const endCondition = (item, i, fertilizedTiles) => {
  const isBelowMaxTiles = i < fertilizedTiles;
  const isInGrid = item.x + i < GRID_SIZE;
  return isInGrid && isBelowMaxTiles;
};
const animateItem = async (item, delay) => {
  const fertilizedTiles = 5;

  for (let i = 0; endCondition(item, i, fertilizedTiles); i++) {
    // Below player's path
    const plantBottom = document.createElement("div");
    plantBottom.setAttribute(
      "id",
      `emoji-${randomNumberUpToNWeighted(EMOJI_ITERATIONS, 0)}`
    );
    plantBottom.style.gridColumn = item.x;
    plantBottom.style.gridRow = item.y + i;
    board.appendChild(plantBottom);

    // Above player's path
    const plantTop = document.createElement("div");
    plantTop.setAttribute(
      "id",
      `emoji-${randomNumberUpToNWeighted(EMOJI_ITERATIONS, 0)}`
    );
    plantTop.style.gridColumn = item.x;
    plantTop.style.gridRow = item.y - i;
    board.appendChild(plantTop);
    await timer(delay);

    // TODO: make it work no matter the player's direction
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
