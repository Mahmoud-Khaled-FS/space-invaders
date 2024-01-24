import { soundEffect, sounds } from './sound.js';
import { collision } from './utils.js';
export var BulletType;
(function (BulletType) {
    BulletType[BulletType["PLAYER"] = -1] = "PLAYER";
    BulletType[BulletType["ALIEN"] = 1] = "ALIEN";
})(BulletType || (BulletType = {}));
export class BulletSystem {
    constructor(height) {
        this.height = height;
        this.bullets = [];
    }
    update() {
        this.bullets.forEach((a, i) => {
            a.update();
            if (!a.isVisible(this.height)) {
                this.bullets.splice(i, 1);
            }
        });
    }
    checkAlienCollision(aliens) {
        for (const bIndex in this.bullets) {
            const b = this.bullets[bIndex];
            if (b.type === BulletType.ALIEN)
                continue;
            const index = b.collisionAliens(aliens);
            if (index != -1) {
                this.bullets.splice(+bIndex, 1);
                return index;
            }
        }
        return -1;
    }
    checkPlayerCollision(player) {
        for (const bIndex in this.bullets) {
            const b = this.bullets[bIndex];
            if (b.type === BulletType.PLAYER)
                continue;
            if (b.collisionPlayer(player)) {
                this.bullets.splice(+bIndex, 1);
                return true;
            }
        }
        return false;
    }
    playerShoot(player) {
        const x = player.x + player.width / 2;
        const y = player.y;
        this.bullets.push(new Bullet(x, y, BulletType.PLAYER, 20));
        soundEffect.play(sounds.bullet);
    }
    alienShoot(x, y, speed) {
        const b = new Bullet(x, y, BulletType.ALIEN, 2);
        b.speed += speed;
        b.width = 7;
        this.bullets.push(b);
    }
}
export class Bullet {
    constructor(x, y, type, speed) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.speed = speed;
        this.width = 3;
        this.height = 20;
        if (this.type === BulletType.PLAYER) {
            this.color = '#00BCD4';
        }
        else {
            this.color = '#FD090A';
        }
    }
    update() {
        this.y += this.speed * this.type;
    }
    collisionAliens(aliens) {
        var _a;
        for (const i in aliens) {
            if (!((_a = aliens[i]) === null || _a === void 0 ? void 0 : _a.destroyed) && collision(aliens[i], this)) {
                return +i;
            }
        }
        return -1;
    }
    collisionPlayer(player) {
        return collision(player, this);
    }
    isVisible(height) {
        return !(this.y <= 0 || this.y >= height);
    }
}
//# sourceMappingURL=bullet.js.map