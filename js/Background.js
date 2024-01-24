import { Images } from './images.js';
import { randomNumber } from './utils.js';
class Layer {
    constructor(image, speed) {
        this.image = image;
        this.speed = speed;
        this.height = 1600;
        this.x = 0;
        this.x2 = 0;
        this.y = 0;
        this.y2 = -this.height;
    }
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
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y);
        ctx.drawImage(this.image, this.x2, this.y2);
    }
    setX(x) {
        this.x = x;
        this.x2 = -x;
        return this;
    }
}
export class Background {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.layers = [];
        this.layers.push(new Layer(Images.gameBackground, 1));
        this.layers.push(new Layer(Images.layer1, 2).setX(500));
        this.layers.push(new Layer(Images.layer2, 3).setX(-30));
        this.layers.push(new Layer(Images.layer3, 4).setX(1000));
        this.layers.push(new Layer(Images.layer5, randomNumber(1, 5)).setX(randomNumber(0, 1000)));
        this.layers.push(new Layer(Images.layer6, randomNumber(1, 5)).setX(randomNumber(0, 1000)));
        this.layers.push(new Layer(Images.layer7, randomNumber(1, 5)).setX(randomNumber(0, 1000)));
    }
    update() {
        this.layers.forEach((l) => l.update());
    }
    draw(ctx) {
        this.layers.forEach((l) => l.draw(ctx));
    }
}
//# sourceMappingURL=Background.js.map