import { Alien } from './alien.js';
import { Entity } from './entity.js';
import { Player } from './player.js';
import { soundEffect, sounds } from './sound.js';
import { collision } from './utils.js';

export enum BulletType {
  PLAYER = -1,
  ALIEN = 1,
}

export class BulletSystem {
  public bullets: Bullet[] = [];

  constructor(public height: number) {}

  update() {
    this.bullets.forEach((a, i) => {
      a.update();
      if (!a.isVisible(this.height)) {
        this.bullets.splice(i, 1);
      }
    });
  }

  checkAlienCollision(aliens: Alien[]): number {
    for (const bIndex in this.bullets) {
      const b = this.bullets[bIndex]!;
      if (b.type === BulletType.ALIEN) continue;
      const index = b.collisionAliens(aliens);
      if (index != -1) {
        this.bullets.splice(+bIndex, 1);
        return index;
      }
    }
    return -1;
  }

  checkPlayerCollision(player: Player): boolean {
    for (const bIndex in this.bullets) {
      const b = this.bullets[bIndex]!;
      if (b.type === BulletType.PLAYER) continue;
      if (b.collisionPlayer(player)) {
        this.bullets.splice(+bIndex, 1);
        return true;
      }
    }
    return false;
  }

  playerShoot(player: Player) {
    const x = player.x + player.width / 2;
    const y = player.y;
    this.bullets.push(new Bullet(x, y, BulletType.PLAYER, 20));
    soundEffect.play(sounds.bullet);
  }

  alienShoot(x: number, y: number, speed: number) {
    const b = new Bullet(x, y, BulletType.ALIEN, 2);
    b.speed += speed;
    b.width = 7;
    this.bullets.push(b);
  }
}

export class Bullet implements Entity {
  public color: string;
  public width: number = 3;
  public height: number = 20;
  constructor(public x: number, public y: number, public type: BulletType, public speed: number) {
    if (this.type === BulletType.PLAYER) {
      this.color = '#00BCD4';
    } else {
      this.color = '#FD090A';
    }
  }

  update(): void {
    this.y += this.speed * this.type;
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
