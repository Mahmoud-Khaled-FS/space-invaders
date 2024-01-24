import { Images } from './images.js';
import { GameContext } from './types.js';
import { randomNumber } from './utils.js';

class Layer {
  public height: number = 1600;
  public x: number = 0;
  public x2: number = 0;
  public y: number = 0;
  public y2: number = -this.height;
  constructor(public image: HTMLImageElement, public speed: number) {}
  update() {
    this.y += this.speed;
    this.y2 += this.speed;
    if (this.y >= this.height) {
      this.y = this.y2 - this.height;
    }
    if (this.y2 >= this.height) {
      this.y2 = this.y - this.height;
    }
  }
  draw(ctx: GameContext) {
    ctx.drawImage(this.image, this.x, this.y);
    ctx.drawImage(this.image, this.x2, this.y2);
  }
  setX(x: number): Layer {
    this.x = x;
    this.x2 = -x;
    return this;
  }
}

export class Background {
  public background = Images.gameBackground;
  public x = 0;
  public y = 0;
  public speed = 1;
  public layers: Layer[] = [];
  constructor(public width: number, public height: number) {
    this.layers.push(new Layer(Images.gameBackground, 10));
    this.layers.push(new Layer(Images.layer1, 10).setX(500));
    this.layers.push(new Layer(Images.layer2, 10).setX(-30));
    this.layers.push(new Layer(Images.layer3, 20).setX(1000));
    this.layers.push(new Layer(Images.layer5, randomNumber(5, 10)).setX(randomNumber(0, 1000)));
    this.layers.push(new Layer(Images.layer6, randomNumber(5, 10)).setX(randomNumber(0, 1000)));
    this.layers.push(new Layer(Images.layer7, randomNumber(5, 10)).setX(randomNumber(0, 1000)));
  }
  update() {
    this.layers.forEach((l) => l.update());
  }
  draw(ctx: GameContext) {
    this.layers.forEach((l) => l.draw(ctx));
  }
}
