import { Images } from './images.js';
import { soundEffect, sounds } from './sound.js';
import { randomNumber, randomWithPercentage } from './utils.js';
var AlienType;
(function (AlienType) {
    AlienType["NORMAL"] = "normal";
    AlienType["ANGLE"] = "angle";
    AlienType["FAST"] = "fast";
})(AlienType || (AlienType = {}));
export class AlienSystem {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.aliens = [];
        this.spawnTimeDelay = 650;
        this.lastFrameTime = 0;
        this.destroyDelay = 1000;
    }
    spawn() {
        const aliensType = [AlienType.NORMAL, AlienType.ANGLE, AlienType.FAST];
        const prtAliensType = [10, 40, 60];
        const alienType = aliensType[randomWithPercentage(prtAliensType)];
        const x = randomNumber(20, this.gameWidth - 70);
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
    update(deltaTime, game) {
        if (this.lastFrameTime > this.spawnTimeDelay) {
            this.spawn();
            this.lastFrameTime = 0;
        }
        else {
            this.lastFrameTime += deltaTime;
        }
        this.aliens.forEach((a, i) => {
            a.update(deltaTime, game);
            if (!a.isVisible(this.gameHeight) || a.destroyTimeLeft > this.destroyDelay) {
                this.aliens.splice(i, 1);
            }
        });
    }
    destroy(index) {
        const a = this.aliens[index];
        soundEffect.play(sounds.explosion);
        this.aliens[index].destroyed = true;
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
export class Alien {
    constructor(x) {
        this.x = x;
        this.y = 0;
        this.speed = randomNumber(1, 6);
        this.width = 50;
        this.height = 50;
        this.type = AlienType.NORMAL;
        this.image = Images.alien1;
        this.lastFrameTime = 0;
        this.alienBulletTimeDelay = 0;
        this.destroyed = false;
        this.destroyTimeLeft = 0;
        this.resetBulletDelay();
    }
    update(deltaTime, game) {
        if (this.destroyed) {
            this.destroyTimeLeft += deltaTime;
            return;
        }
        this.y += this.speed;
        this.shoot(deltaTime, game);
        return;
    }
    isVisible(height) {
        return this.y <= height;
    }
    shoot(deltaTime, game) {
        if (this.lastFrameTime > this.alienBulletTimeDelay) {
            game.bullets.alienShoot(this.x + this.width / 2, this.y + this.height, this.speed);
            this.resetBulletDelay();
            this.lastFrameTime = 0;
        }
        else {
            this.lastFrameTime += deltaTime;
        }
    }
    resetBulletDelay() {
        this.alienBulletTimeDelay = randomNumber(1000, 2000);
    }
}
export class AngleAlien extends Alien {
    constructor(x) {
        super(x);
        this.angle = 0;
        this.va = 0.1;
        this.type = AlienType.ANGLE;
        this.image = Images.alien3;
    }
    update(d, g) {
        super.update(d, g);
        if (this.destroyed) {
            return;
        }
        this.angle += this.va;
        this.x += Math.sin(this.angle) * 4;
    }
}
export class FastAlien extends Alien {
    constructor(x) {
        super(x);
        this.type = AlienType.FAST;
        this.speed = 20;
        this.image = Images.alien2;
    }
    update(d, g) {
        super.update(d, g);
    }
}
//# sourceMappingURL=alien.js.map