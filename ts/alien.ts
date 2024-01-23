import { Entity } from './entity.js';
import { Game } from './game.js';
import { newImage, randomNumber, randomWithPercentage } from './utils.js';

const explosionImage = new Image();
explosionImage.src = '/imgs/explosion1.png';

const explosionSound = new Audio('/sounds/explosion.mp3');

enum AlienType {
  NORMAL = 'normal',
  ANGLE = 'angle',
  FAST = 'fast',
}

// const imagesSrc = ['/imgs/alien2.png', '/imgs/alien3.png', '/imgs/alien4.png'];

const normalImage = newImage('/imgs/alien1.png');
const angleImage = newImage('/imgs/alien4.png');
const fastImage = newImage('/imgs/alien2.png');

export class AlienSystem {
  public aliens: Alien[] = [];
  public spawnTimeDelay = 500;
  public lastFrameTime = 0;

  public destroyDelay = 1000;

  constructor(public game: Game) {}

  spawn() {
    const aliensType: string[] = [AlienType.NORMAL, AlienType.ANGLE, AlienType.FAST];
    const prtAliensType: number[] = [10, 40, 60];
    const alienType: string = aliensType[randomWithPercentage(prtAliensType)]!;
    const x: number = randomNumber(20, this.game.canvas.width - 70);
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

  draw(ctx: CanvasRenderingContext2D): void {
    this.aliens.forEach((a) => a.draw(ctx));
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
      if (!a.isVisible(this.game.canvas.height) || a.destroyTimeLeft > this.destroyDelay) {
        this.aliens.splice(i, 1);
      }
    });
  }

  destroy(index: number): number {
    const a = this.aliens[index]!;
    explosionSound.play();
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
  public image: CanvasImageSource = normalImage;
  public playerBulletTimeDelay = randomNumber(500, 2000);
  public lastFrameTime = 0;

  public destroyed: boolean = false;
  public destroyTimeLeft: number = 0;

  constructor(public x: number) {}

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.destroyed) {
      ctx.drawImage(explosionImage, this.x, this.y, this.width, this.height);
    } else {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
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
    if (this.lastFrameTime > this.playerBulletTimeDelay) {
      game.bullets.alienShoot(this.x + this.width / 2, this.y + this.height, this.speed);
      this.playerBulletTimeDelay = randomNumber(400, 1000);
      this.lastFrameTime = 0;
    } else {
      this.lastFrameTime += deltaTime;
    }
  }
}

export class AngleAlien extends Alien {
  public angle = 0;
  public va = 0.1;
  public type: AlienType = AlienType.ANGLE;
  public image: HTMLImageElement = angleImage;

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
  public image: HTMLImageElement = fastImage;
  constructor(x: number) {
    super(x);
  }
  update(d: number, g: Game): void {
    super.update(d, g);
  }
}
