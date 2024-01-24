import { Entity } from './entity.js';
import { Game } from './game.js';
import { Images } from './images.js';
import { soundEffect, sounds } from './sound.js';
import { randomNumber, randomWithPercentage } from './utils.js';

enum AlienType {
  NORMAL = 'normal',
  ANGLE = 'angle',
  FAST = 'fast',
}

export class AlienSystem {
  public aliens: Alien[] = [];
  public spawnTimeDelay = 650;
  public lastFrameTime = 0;
  public destroyDelay = 1000;

  constructor(public gameWidth: number, public gameHeight: number) {}

  spawn() {
    const aliensType: string[] = [AlienType.NORMAL, AlienType.ANGLE, AlienType.FAST];
    const prtAliensType: number[] = [10, 40, 60];
    const alienType: string = aliensType[randomWithPercentage(prtAliensType)]!;
    const x: number = randomNumber(20, this.gameWidth - 70);
    switch (alienType) {
      case AlienType.NORMAL:
        this.aliens.push(new Alien(x));
        break;
      case AlienType.ANGLE:
        this.aliens.push(new AngleAlien(x));
        break;
      case AlienType.FAST:
        this.aliens.push(new FastAlien(x));
        break;
    }
  }

  update(deltaTime: number, game: Game): void {
    if (this.lastFrameTime > this.spawnTimeDelay) {
      this.spawn();
      this.lastFrameTime = 0;
    } else {
      this.lastFrameTime += deltaTime;
    }
    this.aliens.forEach((a, i) => {
      a.update(deltaTime, game);
      if (!a.isVisible(this.gameHeight) || a.destroyTimeLeft > this.destroyDelay) {
        this.aliens.splice(i, 1);
      }
    });
  }

  destroy(index: number): number {
    const a = this.aliens[index]!;
    soundEffect.play(sounds.explosion);
    this.aliens[index]!.destroyed = true;
    switch (a.type) {
      case AlienType.NORMAL:
        return 1;
      case AlienType.ANGLE:
        return 2;
      case AlienType.FAST:
        return 3;
    }
  }
}

export class Alien implements Entity {
  public y: number = 0;
  public speed: number = randomNumber(1, 6);
  public width: number = 50;
  public height: number = 50;
  public type: AlienType = AlienType.NORMAL;
  public image: CanvasImageSource = Images.alien1;
  public lastFrameTime = 0;

  public alienBulletTimeDelay: number = 0;
  public destroyed: boolean = false;
  public destroyTimeLeft: number = 0;

  constructor(public x: number) {
    this.resetBulletDelay();
  }

  update(deltaTime: number, game: Game): void {
    if (this.destroyed) {
      this.destroyTimeLeft += deltaTime;
      return;
    }
    this.y += this.speed;
    this.shoot(deltaTime, game);
    return;
  }

  isVisible(height: number): boolean {
    return this.y <= height;
  }

  shoot(deltaTime: number, game: Game) {
    if (this.lastFrameTime > this.alienBulletTimeDelay) {
      game.bullets.alienShoot(this.x + this.width / 2, this.y + this.height, this.speed);
      this.resetBulletDelay();
      this.lastFrameTime = 0;
    } else {
      this.lastFrameTime += deltaTime;
    }
  }
  resetBulletDelay() {
    this.alienBulletTimeDelay = randomNumber(1000, 2000);
  }
}

export class AngleAlien extends Alien {
  public angle = 0;
  public va = 0.1;
  public type: AlienType = AlienType.ANGLE;
  public image: HTMLImageElement = Images.alien3;

  constructor(x: number) {
    super(x);
  }
  update(d: number, g: Game): void {
    super.update(d, g);
    if (this.destroyed) {
      return;
    }
    this.angle += this.va;
    this.x += Math.sin(this.angle) * 4;
  }
}

export class FastAlien extends Alien {
  public type: AlienType = AlienType.FAST;
  public speed: number = 20;
  public image: HTMLImageElement = Images.alien2;
  constructor(x: number) {
    super(x);
  }
  update(d: number, g: Game): void {
    super.update(d, g);
  }
}
