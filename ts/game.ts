import { AlienSystem } from './alien.js';
import { BulletSystem } from './bullet.js';
import { InputHandler, Keys } from './input.js';
import { Player } from './player.js';
import { SoundEffect, sound } from './sound.js';
import { GameScreen } from './types.js';
import { GameUi } from './ui.js';

enum GameState {
  START,
  PLAYING,
  PAUSE,
  OVER,
}

export class Game {
  public ctx: CanvasRenderingContext2D;
  public player: Player;
  public aliens: AlienSystem;
  public bullets: BulletSystem;
  public input: InputHandler = new InputHandler();
  public ui: GameUi;

  public state: GameState = GameState.START;

  public score: number = 0;

  constructor(public canvas: GameScreen) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('ERROR: can not get game context');
    }

    this.ui = new GameUi(this);
    this.ui.init();

    this.ctx = ctx;
    document.getElementById('reset')!.style.display = 'none';
  }

  start() {
    sound.play(SoundEffect.music);
    this.state = GameState.PLAYING;
    this.player = new Player(this.canvas.width, this.canvas.height);
    this.aliens = new AlienSystem(this.canvas.width, this.canvas.height);
    this.bullets = new BulletSystem(this.canvas.height);
    this.score = 0;
    this.ui = new GameUi(this);
  }

  update(deltaTime: number) {
    switch (this.state) {
      case GameState.START:
        break;
      case GameState.PAUSE:
        if (this.input.pressed(Keys.ESCAPE)) {
          this.state = GameState.PLAYING;
        }
        break;
      case GameState.OVER:
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
        this.ui.background();
        this.ui.drawPlayer(this.player);
        this.ui.drawAliens(this.aliens);
        this.ui.drawBullets(this.bullets);
        this.ui.status();
        break;
      case GameState.PAUSE:
        this.ui.pause();
        break;
      case GameState.OVER:
        this.ui.GameOver();
    }
  }
  playing(deltaTime: number) {
    if (!this.player.alive) {
      this.state = GameState.OVER;
    }
    if (this.input.pressed(Keys.ESCAPE)) {
      this.state = GameState.PAUSE;
    }
    if (this.input.has(Keys.SPACE)) {
      if (this.player.shoot(deltaTime)) {
        this.bullets.playerShoot(this.player);
      }
    } else {
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
      !this.player.kill();
    }
  }
}
