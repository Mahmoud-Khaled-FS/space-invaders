import { GameScreen } from './types.js';

export function randomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randomWithPercentage(prt: number[]): number {
  const randNum = Math.floor(randomNumber(0, 100));
  for (const i in prt) {
    if (randNum > 100 - prt[i]!) {
      return +i;
    }
  }
  return 0;
}

export function resizeScreen(canvas: GameScreen) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

interface CollisionEntity {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function collision(e1: CollisionEntity, e2: CollisionEntity) {
  const e1_xs = e1.x;
  const e1_xe = e1.x + e1.width;
  const e2_xs = e2.x;
  const e2_xe = e2.x + e2.width;

  const e1_ys = e1.y;
  const e1_ye = e1.y + e1.height;
  const e2_ys = e2.y;
  const e2_ye = e2.y + e2.height;

  if (e1_xs <= e2_xe && e2_xs <= e1_xe && e1_ys <= e2_ye && e2_ys <= e1_ye) {
    return true;
  }
  return false;
}
