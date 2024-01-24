import { AlienSystem } from './alien.js';
import { BulletSystem } from './bullet.js';
import { Game } from './game.js';
import { Images } from './images.js';
import { Player, PlayerStatus } from './player.js';
import { GameContext } from './types.js';

const heartImage = new Image();
heartImage.src = '/imgs/heart.png';

export class GameUi {
  public gameTime: number = new Date().getTime();
  public seconds: number = 0;
  public minutes: number = 0;
  public playerDrawDelay: number = 0;
  public reviveDraw: boolean = false;
  public ctx: GameContext;
  constructor(public game: Game) {
    this.ctx = game.ctx;
  }

  init() {
    this.game.canvas.width = 1100;
    this.game.canvas.height = 800;
  }

  background() {
    // this.game.ctx.fillStyle = '#00082C';
    this.game.ctx.drawImage(Images.gameBackground, 0, 0);
    // this.game.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
  }

  status() {
    const ctx = this.game.ctx;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'start';
    ctx.font = '25px Pixelify Sans';
    ctx.fillText(`SCORE: ${this.game.score}`, 20, 30);
    const now = new Date().getTime();
    const distance = now - this.gameTime;
    const secondLeft = Math.floor((distance % (1000 * 60)) / 1000);
    if (secondLeft >= 1) {
      this.gameTime = now;
      this.seconds += 1;
    }
    if (this.seconds >= 59) {
      this.seconds = 0;
      this.minutes++;
    }
    ctx.fillText(`${this.minutes.toString().padStart(2, '0')}:${this.seconds.toString().padStart(2, '0')}`, 20, 60);

    for (let i = 0; i < this.game.player.hearts; i++) {
      ctx.drawImage(heartImage, 20 + i * 40, 80, 30, 30);
    }
  }
  pause() {
    const ctx = this.game.ctx;
    ctx.font = '50px Pixelify Sans';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText('Press ESC to continue.', this.game.canvas.width / 2, this.game.canvas.height / 2);
  }

  GameOver() {
    const ctx = this.game.ctx;
    ctx.font = '50px Pixelify Sans';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', this.game.canvas.width / 2, this.game.canvas.height / 2 - 100);
    ctx.font = '40px';
    ctx.fillText(`SCORE: ${this.game.score}`, this.game.canvas.width / 2, this.game.canvas.height / 2);
    document.getElementById('reset')!.style.display = 'block';
  }

  clear() {
    this.game.ctx.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);
  }

  start() {
    const ctx = this.game.ctx;
    ctx.drawImage(Images.background, 0, 0, this.game.canvas.width, this.game.canvas.height);
    ctx.font = '100px Nabla';
    ctx.fillStyle = '#FFE84A';
    ctx.textAlign = 'center';
    ctx.fillText('SPACE INVADER', this.game.canvas.width / 2, this.game.canvas.height / 2 - 100);
    document.getElementById('reset')!.style.display = 'block';
  }

  drawPlayer(player: Player) {
    switch (player.status) {
      case PlayerStatus.REVIVED:
        if (this.reviveDraw) {
          this.ctx.drawImage(Images.player, player.x, player.y, player.width, player.height);
        }
        this.reviveDraw = !this.reviveDraw;
        break;
      case PlayerStatus.ALIVE:
        this.ctx.drawImage(Images.player, player.x, player.y, player.width, player.height);
        break;
      case PlayerStatus.DEAD:
        this.ctx.drawImage(Images.explosion2, player.x, player.y, player.width, player.height);
        break;
    }
  }

  drawAliens(aliens: AlienSystem) {
    aliens.aliens.forEach((a) => {
      if (a.destroyed) {
        this.ctx.drawImage(Images.explosion1, a.x, a.y, a.width, a.height);
      } else {
        this.ctx.drawImage(a.image, a.x, a.y, a.width, a.height);
      }
    });
  }

  drawBullets(bullets: BulletSystem) {
    bullets.bullets.forEach((b) => {
      this.ctx.fillStyle = b.color;
      this.ctx.fillRect(b.x - b.width / 2, b.y, b.width, b.height);
    });
  }
}
