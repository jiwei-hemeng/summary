export interface PuzzleCaptchaResult {
  targetX: number;
  targetY: number;
  pieceSize: number;
  bgImage: string;
  blockImage: string;
}

const WIDTH = 310;
const HEIGHT = 155;
const PIECE_SIZE = 52;
const TOLERANCE = 10;

const STAR_OUTER = 26;
const STAR_INNER = 11;

export const PUZZLE_WIDTH = WIDTH;
export const PUZZLE_HEIGHT = HEIGHT;
export const PUZZLE_TOLERANCE = TOLERANCE;

const createStarPath = (cx: number, cy: number, outerR: number, innerR: number): Path2D => {
  const path = new Path2D();
  const step = Math.PI / 5;
  let angle = -Math.PI / 2;
  path.moveTo(cx + outerR * Math.cos(angle), cy + outerR * Math.sin(angle));
  for (let i = 0; i < 5; i++) {
    angle += step;
    path.lineTo(cx + innerR * Math.cos(angle), cy + innerR * Math.sin(angle));
    angle += step;
    path.lineTo(cx + outerR * Math.cos(angle), cy + outerR * Math.sin(angle));
  }
  path.closePath();
  return path;
};

const drawBackgroundScene = (ctx: CanvasRenderingContext2D, seed: number) => {
  const rand = (n: number) => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280 * n;
  };

  const bgGrad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  bgGrad.addColorStop(0, "#050a14");
  bgGrad.addColorStop(0.45, "#0a1628");
  bgGrad.addColorStop(1, "#06101f");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.strokeStyle = "rgba(0, 212, 255, 0.06)";
  ctx.lineWidth = 1;
  const gridSize = 18;
  for (let x = 0; x <= WIDTH; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, HEIGHT);
    ctx.stroke();
  }
  for (let y = 0; y <= HEIGHT; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(0, 212, 255, 0.12)";
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 8; i++) {
    const x1 = rand(WIDTH);
    const y1 = rand(HEIGHT);
    const x2 = x1 + 20 + rand(60);
    const y2 = y1 + (rand(1) > 0.5 ? 0 : 20 + rand(40));
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.fillStyle = "rgba(0, 212, 255, 0.55)";
    ctx.beginPath();
    ctx.arc(x2, y2, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 28; i++) {
    const px = rand(WIDTH);
    const py = rand(HEIGHT);
    const alpha = 0.15 + rand(0.45);
    ctx.fillStyle = `rgba(0, 212, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(px, py, 0.6 + rand(1.4), 0, Math.PI * 2);
    ctx.fill();
  }

  const glowGrad = ctx.createRadialGradient(WIDTH * 0.72, HEIGHT * 0.28, 0, WIDTH * 0.72, HEIGHT * 0.28, 70);
  glowGrad.addColorStop(0, "rgba(0, 180, 255, 0.18)");
  glowGrad.addColorStop(1, "rgba(0, 180, 255, 0)");
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.strokeStyle = "rgba(23, 127, 254, 0.25)";
  ctx.lineWidth = 1;
  ctx.strokeRect(8, 8, WIDTH - 16, HEIGHT - 16);

  ctx.fillStyle = "rgba(0, 212, 255, 0.85)";
  const corner = 10;
  [
    [8, 8, 1, 0],
    [WIDTH - 8, 8, -1, 0],
    [8, HEIGHT - 8, 1, 0],
    [WIDTH - 8, HEIGHT - 8, -1, 0]
  ].forEach(([x, y, dx]) => {
    ctx.fillRect(x, y, dx * corner, 2);
    ctx.fillRect(x, y, 2, dx === 1 ? corner : -corner);
  });
};

export const getBlockOffsetX = (sliderOffset: number, maxSliderOffset: number, maxBlockOffset: number): number => {
  if (maxSliderOffset <= 0) {
    return 0;
  }
  return (sliderOffset * maxBlockOffset) / maxSliderOffset;
};

export const createPuzzleCaptcha = async (): Promise<PuzzleCaptchaResult> => {
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = WIDTH;
  sourceCanvas.height = HEIGHT;
  const sourceCtx = sourceCanvas.getContext("2d");
  if (!sourceCtx) {
    throw new Error("Canvas not supported");
  }

  drawBackgroundScene(sourceCtx, Date.now() % 100000);

  const targetX = Math.floor(80 + Math.random() * (WIDTH - 160));
  const targetY = Math.floor(28 + Math.random() * (HEIGHT - PIECE_SIZE - 36));
  const starPath = createStarPath(targetX, targetY, STAR_OUTER, STAR_INNER);

  const bgCanvas = document.createElement("canvas");
  bgCanvas.width = WIDTH;
  bgCanvas.height = HEIGHT;
  const bgCtx = bgCanvas.getContext("2d");
  if (!bgCtx) {
    throw new Error("Canvas not supported");
  }

  bgCtx.drawImage(sourceCanvas, 0, 0);
  bgCtx.save();
  bgCtx.globalCompositeOperation = "destination-out";
  bgCtx.fillStyle = "#000";
  bgCtx.fill(starPath);
  bgCtx.restore();

  bgCtx.save();
  bgCtx.strokeStyle = "rgba(0, 212, 255, 0.95)";
  bgCtx.lineWidth = 2;
  bgCtx.shadowColor = "rgba(0, 212, 255, 0.8)";
  bgCtx.shadowBlur = 12;
  bgCtx.stroke(starPath);
  bgCtx.restore();

  bgCtx.save();
  bgCtx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  bgCtx.lineWidth = 1;
  bgCtx.stroke(starPath);
  bgCtx.restore();

  const blockCanvas = document.createElement("canvas");
  blockCanvas.width = PIECE_SIZE;
  blockCanvas.height = PIECE_SIZE;
  const blockCtx = blockCanvas.getContext("2d");
  if (!blockCtx) {
    throw new Error("Canvas not supported");
  }

  const blockStarPath = createStarPath(PIECE_SIZE / 2, PIECE_SIZE / 2, STAR_OUTER, STAR_INNER);

  blockCtx.save();
  blockCtx.translate(-targetX + PIECE_SIZE / 2, -targetY + PIECE_SIZE / 2);
  blockCtx.drawImage(sourceCanvas, 0, 0);
  blockCtx.restore();

  blockCtx.globalCompositeOperation = "destination-in";
  blockCtx.fill(blockStarPath);
  blockCtx.globalCompositeOperation = "source-over";

  blockCtx.save();
  blockCtx.strokeStyle = "rgba(0, 212, 255, 0.95)";
  blockCtx.lineWidth = 2;
  blockCtx.shadowColor = "rgba(0, 212, 255, 0.75)";
  blockCtx.shadowBlur = 10;
  blockCtx.stroke(blockStarPath);
  blockCtx.restore();

  blockCtx.shadowColor = "rgba(0, 212, 255, 0.45)";
  blockCtx.shadowBlur = 14;
  blockCtx.shadowOffsetX = 0;
  blockCtx.shadowOffsetY = 0;

  return {
    targetX,
    targetY,
    pieceSize: PIECE_SIZE,
    bgImage: bgCanvas.toDataURL("image/png"),
    blockImage: blockCanvas.toDataURL("image/png")
  };
};

export const verifyPuzzleOffset = (blockOffsetX: number, targetX: number, pieceSize: number, displayWidth = PUZZLE_WIDTH): boolean => {
  const scale = displayWidth / PUZZLE_WIDTH;
  const scaledPieceSize = pieceSize * scale;
  const scaledTargetX = targetX * scale;
  const blockCenterX = blockOffsetX + scaledPieceSize / 2;
  return Math.abs(blockCenterX - scaledTargetX) <= TOLERANCE * scale;
};
