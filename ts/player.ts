import { Entity } from './entity.js';
import { Game } from './game.js';
import { Keys } from './input.js';
import { collision } from './utils.js';

const explosionImage = new Image();
explosionImage.src = '/imgs/explosion2.png';

export class Player implements Entity {
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

  constructor(public x: number = 0, public y: number = 0) {
    this.image = new Image();
    this.image.src = '/imgs/ship.png';
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.alive) {
      ctx.drawImage(explosionImage, this.x, this.y, this.width, this.height);
    } else {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }

  update(deltaTime: number, game: Game): void {
    if (this.x >= game.canvas.width - this.width) {
      this.x = game.canvas.width - this.width;
    }

    this.handleInput(game);

    this.x += this.vx;
    this.y += this.vy;
    game.aliens.aliens.forEach((a, i) => {
      if (collision(a, this) && !a.destroyed) {
        this.destroy();
        game.aliens.destroy(i);
      }
    });

    this.shoot(deltaTime, game);
  }

  shoot(deltaTime: number, game: Game) {
    if (this.lastFrameTime > this.playerBulletTimeDelay) {
      if (game.input.has(Keys.SPACE)) {
        game.bullets.playerShoot(this.x + this.width / 2, this.y);
        this.lastFrameTime = 0;
      }
    } else {
      this.lastFrameTime += deltaTime;
    }
  }

  destroy() {
    this.hearts--;
    if (this.hearts === 0) {
      this.alive = false;
    }
  }

  handleInput(game: Game) {
    if (game.input.has(Keys.LEFT)) {
      this.moveLeft();
    } else if (game.input.has(Keys.RIGHT)) {
      this.moveRight(game.canvas.width);
    } else {
      this.vx = 0;
    }

    if (game.input.has(Keys.UP)) {
      this.moveTop();
    } else if (game.input.has(Keys.DOWN)) {
      this.moveDown(game.canvas.height);
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
