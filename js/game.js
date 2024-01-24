import { Background } from './Background.js';
import { AlienSystem } from './alien.js';
import { BulletSystem } from './bullet.js';
import { InputHandler, Keys } from './input.js';
import { Player } from './player.js';
import { soundEffect, sounds } from './sound.js';
import { GameUi } from './ui.js';
var GameState;
(function (GameState) {
    GameState[GameState["START"] = 0] = "START";
    GameState[GameState["PLAYING"] = 1] = "PLAYING";
    GameState[GameState["PAUSE"] = 2] = "PAUSE";
    GameState[GameState["OVER"] = 3] = "OVER";
})(GameState || (GameState = {}));
export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.input = new InputHandler();
        this.state = GameState.START;
        this.score = 0;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('ERROR: can not get game context');
        }
        this.ui = new GameUi(this);
        this.ui.init();
        this.ctx = ctx;
        document.getElementById('reset').style.display = 'none';
    }
    start() {
        soundEffect.play(sounds.music, { repeat: true });
        this.state = GameState.PLAYING;
        this.player = new Player(this.canvas.width, this.canvas.height);
        this.aliens = new AlienSystem(this.canvas.width, this.canvas.height);
        this.bullets = new BulletSystem(this.canvas.height);
        this.score = 0;
        this.ui = new GameUi(this);
        this.background = new Background(this.canvas.width, this.canvas.height);
    }
    update(deltaTime) {
        switch (this.state) {
            case GameState.START:
                break;
            case GameState.PAUSE:
                if (this.input.pressed(Keys.ESCAPE)) {
                    soundEffect.play(sounds.music);
                    this.state = GameState.PLAYING;
                }
                break;
            case GameState.OVER:
                soundEffect.stop(sounds.music);
                break;
            case GameState.PLAYING:
                this.playing(deltaTime);
                break;
        }
    }
    draw() {
        this.ui.clear();
        switch (this.state) {
            case GameState.START:
                this.ui.start();
                break;
            case GameState.PLAYING:
                this.background.draw(this.ctx);
                this.ui.drawPlayer(this.player);
                this.ui.drawAliens(this.aliens);
                this.ui.drawBullets(this.bullets);
                this.ui.status();
                break;
            case GameState.PAUSE:
                this.background.draw(this.ctx);
                this.ui.drawPlayer(this.player);
                this.ui.drawAliens(this.aliens);
                this.ui.drawBullets(this.bullets);
                this.ui.pause();
                break;
            case GameState.OVER:
                this.background.draw(this.ctx);
                this.ui.drawPlayer(this.player);
                this.ui.drawAliens(this.aliens);
                this.ui.GameOver();
        }
    }
    playing(deltaTime) {
        this.background.update();
        if (this.player.isDead()) {
            this.state = GameState.OVER;
        }
        if (this.input.pressed(Keys.ESCAPE)) {
            this.pause();
        }
        if (this.input.has(Keys.SPACE)) {
            if (this.player.shoot(deltaTime)) {
                this.bullets.playerShoot(this.player);
            }
        }
        else {
            this.player.lastFrameTime = 0;
        }
        this.player.update();
        this.player.checkAliensCollision(this.aliens);
        this.player.handleInput(this.input);
        this.aliens.update(deltaTime, this);
        this.bullets.update();
        const i = this.bullets.checkAlienCollision(this.aliens.aliens);
        if (i !== -1) {
            this.score += this.aliens.destroy(i);
        }
        if (this.bullets.checkPlayerCollision(this.player)) {
            this.player.kill();
        }
    }
    pause() {
        soundEffect.pause(sounds.music);
        this.state = GameState.PAUSE;
    }
}
//# sourceMappingURL=game.js.map