import { Alien } from './alien.js';
import { Entity } from './entity.js';
import { Game } from './game.js';
import { Player } from './player.js';
import { GameContext } from './types';
import { collision } from './utils.js';

export enum BulletType {
  PLAYER = -1,
  ALIEN = 1,
}

const shootingSound = new Audio('/sounds/shooting.mp3');

export class BulletSystem {
  public bullets: Bullet[] = [];

  constructor(public game: Game) {}

  update() {
    this.bullets.forEach((a, i) => {
      a.update();
      if (!a.isVisible(this.game.canvas.height)) {
        this.bullets.splice(i, 1);
      }
    });
  }
  draw(ctx: GameContext) {
    this.bullets.forEach((b) => b.draw(ctx));
  }

  checkAlienCollision(): number {
    for (const bIndex in this.bullets) {
      const b = this.bullets[bIndex]!;
      if (b.type === BulletType.ALIEN) continue;
      const index = b.collisionAliens(this.game.aliens.aliens);
      if (index != -1) {
        this.bullets.splice(+bIndex, 1);
        return index;
      }
    }
    return -1;
  }

  checkPlayerCollision(): boolean {
    for (const bIndex in this.bullets) {
      const b = this.bullets[bIndex]!;
      if (b.type === BulletType.PLAYER) continue;
      if (b.collisionPlayer(this.game.player)) {
        this.bullets.splice(+bIndex, 1);
        return true;
      }
    }
    return false;
  }

  playerShoot(x: number, y: number) {
    this.bullets.push(new Bullet(x, y, BulletType.PLAYER));
    shootingSound.play();
  }

  alienShoot(x: number, y: number, speed: number) {
    const b = new Bullet(x, y, BulletType.ALIEN);
    b.speed += speed;
    b.width = 7;
    this.bullets.push(b);
  }
}

export class Bullet implements Entity {
  public color: string;
  public speed: number = 5;
  public width: number = 3;
  public height: number = 20;
  constructor(public x: number, public y: number, public type: BulletType) {
    if (this.type === BulletType.PLAYER) {
      this.color = '#00BCD4';
    } else {
      this.color = '#FD090A';
    }
  }

  update(): void {
    this.y += this.speed * this.type;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
  }

  collisionAliens(aliens: Alien[]): number {
    for (const i in aliens) {
      if (!aliens[i]?.destroyed && collision(aliens[i]!, this)) {
        return +i;
      }
    }
    return -1;
  }

  collisionPlayer(player: Player): boolean {
    return collision(player, this);
  }

  isVisible(height: number): boolean {
    return !(this.y <= 0 || this.y >= height);
  }
}
