import { Game } from './game.js';

const explosionImage = new Image();
explosionImage.src = '/imgs/explosion.png';

function main() {
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  if (!canvas) {
    throw new Error('ERROR: game canvas not found');
  }

  const game = new Game(canvas);

  let lastTimeStamp = 0;
  function renderFrame(timeStamp: number) {
    let deltaTime = timeStamp - lastTimeStamp;
    lastTimeStamp = timeStamp;
    game.update(deltaTime);
    game.draw();
    requestAnimationFrame(renderFrame);
  }
  renderFrame(0);
  const restartButton = document.getElementById('reset')!;
  restartButton?.addEventListener('click', () => {
    game.start();
    restartButton.style.display = 'none';
  });
}

window.onload = main;
