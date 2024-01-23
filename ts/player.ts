import { AlienSystem } from './alien.js';
import { Entity } from './entity.js';
import { InputHandler, Keys } from './input.js';
import { collision } from './utils.js';

const explosionImage = new Image();
explosionImage.src = '/imgs/explosion2.png';

export class Player implements Entity {
  public x: number = 0;
  public y: number = 0;
  public readonly width: number = 70;
  public readonly height: number = 70;
  public vx: number = 0;
  public vy: number = 0;
  public xs: number = 10;
  public ys: number = 5;
  public readonly image: CanvasImageSource;

  public playerBulletTimeDelay = 250;
  public lastFrameTime = 0;
  public hearts = 3;
  public alive = true;

  constructor(public gameWidth: number, public gameHeight: number) {
    this.x = gameWidth / 2 - this.width / 2;
    this.y = gameHeight - gameHeight / 6;
    this.image = new Image();
    this.image.src = '/imgs/ship.png';
  }

  update(): void {
    if (this.x >= this.gameWidth - this.width) {
      this.x = this.gameWidth - this.width;
    }

    this.x += this.vx;
    this.y += this.vy;
  }

  shoot(deltaTime: number): boolean {
    let shooting = false;
    if (this.lastFrameTime === 0) {
      shooting = true;
    }
    this.lastFrameTime += deltaTime;
    if (this.lastFrameTime > this.playerBulletTimeDelay) {
      this.lastFrameTime = 0;
    }
    return shooting;
  }

  checkAliensCollision(aliens: AlienSystem) {
    aliens.aliens.forEach((a, i) => {
      if (collision(a, this) && !a.destroyed) {
        this.kill();
        aliens.destroy(i);
      }
    });
  }

  kill(): boolean {
    this.hearts--;
    if (this.hearts === 0) {
      this.alive = false;
    }
    return this.alive;
  }

  handleInput(input: InputHandler) {
    if (input.has(Keys.LEFT)) {
      this.moveLeft();
    } else if (input.has(Keys.RIGHT)) {
      this.moveRight(this.gameWidth);
    } else {
      this.vx = 0;
    }

    if (input.has(Keys.UP)) {
      this.moveTop();
    } else if (input.has(Keys.DOWN)) {
      this.moveDown(this.gameHeight);
    } else {
      this.vy = 0;
    }
  }

  moveLeft() {
    if (this.x >= 0) {
      this.vx = -this.xs;
      return;
    }
    this.vx = 0;
  }

  moveRight(width: number) {
    if (this.x <= width - this.width) {
      this.vx = this.xs;
      return;
    }
    this.vx = 0;
  }

  moveTop() {
    if (this.y >= 0) {
      this.vy = -this.ys;
      return;
    }
    this.vy = 0;
  }

  moveDown(heigh: number) {
    if (this.y <= heigh - this.width) {
      this.vy = this.ys;
      return;
    }
    this.vy = 0;
  }
}
