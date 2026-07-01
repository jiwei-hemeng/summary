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
    return (seed / 233280) * n;
  };

  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, `hsl(${200 + rand(30)}, 55%, ${55 + rand(15)}%)`);
  gradient.addColorStop(1, `hsl(${210 + rand(20)}, 45%, ${25 + rand(10)}%)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  for (let i = 0; i < 8; i++) {
    const x = rand(WIDTH);
    const y = HEIGHT * 0.35 + rand(HEIGHT * 0.45);
    const w = 18 + rand(40);
    const h = 20 + rand(80);
    ctx.fillRect(x, y, w, h);
  }

  ctx.fillStyle = 'rgba(15, 35, 70, 0.35)';
  ctx.fillRect(0, HEIGHT * 0.72, WIDTH, HEIGHT * 0.28);

  ctx.fillStyle = 'rgba(255, 210, 120, 0.25)';
  ctx.beginPath();
  ctx.arc(WIDTH * 0.78, HEIGHT * 0.22, 18 + rand(8), 0, Math.PI * 2);
  ctx.fill();
};

export const getBlockOffsetX = (sliderOffset: number, maxSliderOffset: number, maxBlockOffset: number): number => {
  if (maxSliderOffset <= 0) {
    return 0;
  }
  return (sliderOffset * maxBlockOffset) / maxSliderOffset;
};

export const createPuzzleCaptcha = async (): Promise<PuzzleCaptchaResult> => {
  const sourceCanvas = document.createElement('canvas');
  sourceCanvas.width = WIDTH;
  sourceCanvas.height = HEIGHT;
  const sourceCtx = sourceCanvas.getContext('2d');
  if (!sourceCtx) {
    throw new Error('Canvas not supported');
  }

  drawBackgroundScene(sourceCtx, Date.now() % 100000);

  const targetX = Math.floor(80 + Math.random() * (WIDTH - 160));
  const targetY = Math.floor(28 + Math.random() * (HEIGHT - PIECE_SIZE - 36));

  const bgCanvas = document.createElement('canvas');
  bgCanvas.width = WIDTH;
  bgCanvas.height = HEIGHT;
  const bgCtx = bgCanvas.getContext('2d');
  if (!bgCtx) {
    throw new Error('Canvas not supported');
  }

  bgCtx.drawImage(sourceCanvas, 0, 0);
  bgCtx.save();
  bgCtx.globalCompositeOperation = 'destination-out';
  bgCtx.fillStyle = '#000';
  bgCtx.fill(createStarPath(targetX, targetY, STAR_OUTER, STAR_INNER));
  bgCtx.restore();

  bgCtx.save();
  bgCtx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  bgCtx.lineWidth = 2;
  bgCtx.stroke(createStarPath(targetX, targetY, STAR_OUTER, STAR_INNER));
  bgCtx.restore();

  const blockCanvas = document.createElement('canvas');
  blockCanvas.width = PIECE_SIZE;
  blockCanvas.height = PIECE_SIZE;
  const blockCtx = blockCanvas.getContext('2d');
  if (!blockCtx) {
    throw new Error('Canvas not supported');
  }

  blockCtx.save();
  blockCtx.translate(-targetX + PIECE_SIZE / 2, -targetY + PIECE_SIZE / 2);
  blockCtx.drawImage(sourceCanvas, 0, 0);
  blockCtx.restore();

  blockCtx.globalCompositeOperation = 'destination-in';
  blockCtx.fill(createStarPath(PIECE_SIZE / 2, PIECE_SIZE / 2, STAR_OUTER, STAR_INNER));
  blockCtx.globalCompositeOperation = 'source-over';

  blockCtx.save();
  blockCtx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  blockCtx.lineWidth = 2;
  blockCtx.stroke(createStarPath(PIECE_SIZE / 2, PIECE_SIZE / 2, STAR_OUTER, STAR_INNER));
  blockCtx.restore();

  blockCtx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  blockCtx.shadowBlur = 8;
  blockCtx.shadowOffsetX = 2;
  blockCtx.shadowOffsetY = 2;

  return {
    targetX,
    targetY,
    pieceSize: PIECE_SIZE,
    bgImage: bgCanvas.toDataURL('image/png'),
    blockImage: blockCanvas.toDataURL('image/png')
  };
};

export const verifyPuzzleOffset = (blockOffsetX: number, targetX: number, pieceSize: number, displayWidth = PUZZLE_WIDTH): boolean => {
  const scale = displayWidth / PUZZLE_WIDTH;
  const scaledPieceSize = pieceSize * scale;
  const scaledTargetX = targetX * scale;
  const blockCenterX = blockOffsetX + scaledPieceSize / 2;
  return Math.abs(blockCenterX - scaledTargetX) <= TOLERANCE * scale;
};
