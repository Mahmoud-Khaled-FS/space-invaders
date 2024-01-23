import { AlienSystem } from './alien.js';
import { BulletSystem } from './bullet.js';
import { InputHandler, Keys } from './input.js';
import { Player } from './player.js';
import { GameScreen } from './types.js';
import { GameUi } from './ui.js';

export class Game {
  public ctx: CanvasRenderingContext2D;
  public player: Player;
  public aliens: AlienSystem;
  public bullets: BulletSystem;
  public input: InputHandler = new InputHandler();
  public ui: GameUi;

  public score: number = 0;
  public pause: boolean = false;
  public isGameOver: boolean = false;

  constructor(public canvas: GameScreen) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('ERROR: can not get game context');
    }

    this.ui = new GameUi(this);
    this.ui.init();

    this.ctx = ctx;
    this.player = new Player(this.canvas.width / 2 - 20, this.canvas.height - this.canvas.height / 6);
    this.aliens = new AlienSystem(this);
    this.bullets = new BulletSystem(this);
    document.getElementById('reset')!.style.display = 'none';
  }

  start() {}

  update(deltaTime: number) {
    if (this.input.pressed(Keys.ESCAPE) && this.player.alive) {
      this.pause = !this.pause;
    }
    if (this.pause) {
      return;
    }
    if (!this.player.alive) {
      this.gameOver();
    }
    this.player.update(deltaTime, this);
    this.aliens.update(deltaTime, this);
    this.bullets.update();
    const i = this.bullets.checkAlienCollision();
    if (i !== -1) {
      this.score += this.aliens.destroy(i);
    }
    if (this.bullets.checkPlayerCollision()) {
      this.player.destroy();
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ui.background();
    this.bullets.draw(this.ctx);
    this.player.draw(this.ctx);
    this.aliens.draw(this.ctx);
    this.ui.status();
    if (this.pause) {
      if (this.player.alive) {
        this.ui.pause();
      } else {
        this.ui.GameOver();
      }
    }
  }

  gameOver() {
    this.player.destroy();
    this.pause = true;
    this.isGameOver = true;
  }

  reset() {
    this.player = new Player(this.canvas.width / 2 - 20, this.canvas.height - this.canvas.height / 6);
    this.aliens = new AlienSystem(this);
    this.bullets = new BulletSystem(this);
    this.score = 0;
    this.pause = false;
    this.isGameOver = false;
    this.ui = new GameUi(this);
  }
}
