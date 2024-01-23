import { Game } from './game';

const heartImage = new Image();
heartImage.src = '/imgs/heart.png';

export class GameUi {
  public gameTime: number = new Date().getTime();
  public seconds: number = 0;
  public minutes: number = 0;
  constructor(public game: Game) {}

  init() {
    this.game.canvas.width = 1100;
    this.game.canvas.height = 800;
  }

  background() {
    this.game.ctx.fillStyle = '#000000';
    this.game.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
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
}
