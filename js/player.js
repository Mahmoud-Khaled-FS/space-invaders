import { Keys } from './input.js';
import { soundEffect, sounds } from './sound.js';
import { collision } from './utils.js';
export var PlayerStatus;
(function (PlayerStatus) {
    PlayerStatus[PlayerStatus["ALIVE"] = 0] = "ALIVE";
    PlayerStatus[PlayerStatus["DEAD"] = 1] = "DEAD";
    PlayerStatus[PlayerStatus["REVIVED"] = 2] = "REVIVED";
})(PlayerStatus || (PlayerStatus = {}));
export class Player {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.x = 0;
        this.y = 0;
        this.width = 70;
        this.height = 70;
        this.vx = 0;
        this.vy = 0;
        this.xs = 10;
        this.ys = 5;
        this.playerBulletTimeDelay = 250;
        this.lastFrameTime = 0;
        this.hearts = 3;
        this.status = PlayerStatus.ALIVE;
        this.x = gameWidth / 2 - this.width / 2;
        this.y = gameHeight - gameHeight / 6;
    }
    update() {
        if (this.x >= this.gameWidth - this.width) {
            this.x = this.gameWidth - this.width;
        }
        this.x += this.vx;
        this.y += this.vy;
    }
    shoot(deltaTime) {
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
    checkAliensCollision(aliens) {
        aliens.aliens.forEach((a, i) => {
            if (collision(a, this) && !a.destroyed) {
                this.kill();
                aliens.destroy(i);
            }
        });
    }
    kill() {
        if (this.status === PlayerStatus.REVIVED) {
            return;
        }
        soundEffect.play(sounds.explosion);
        this.hearts--;
        if (this.hearts === 0) {
            this.status = PlayerStatus.DEAD;
        }
        else {
            this.status = PlayerStatus.REVIVED;
            setTimeout(() => (this.status = PlayerStatus.ALIVE), 2000);
        }
    }
    handleInput(input) {
        if (input.has(Keys.LEFT)) {
            this.moveLeft();
        }
        else if (input.has(Keys.RIGHT)) {
            this.moveRight(this.gameWidth);
        }
        else {
            this.vx = 0;
        }
        if (input.has(Keys.UP)) {
            this.moveTop();
        }
        else if (input.has(Keys.DOWN)) {
            this.moveDown(this.gameHeight);
        }
        else {
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
    moveRight(width) {
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
    moveDown(heigh) {
        if (this.y <= heigh - this.width) {
            this.vy = this.ys;
            return;
        }
        this.vy = 0;
    }
    isDead() {
        return this.status === PlayerStatus.DEAD;
    }
}
//# sourceMappingURL=player.js.map