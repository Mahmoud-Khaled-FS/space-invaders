import { Game } from './game.js';
function main() {
    const canvas = document.getElementById('game');
    if (!canvas) {
        throw new Error('ERROR: game canvas not found');
    }
    const game = new Game(canvas);
    let lastTimeStamp = 0;
    function renderFrame(timeStamp) {
        let deltaTime = timeStamp - lastTimeStamp;
        lastTimeStamp = timeStamp;
        game.update(deltaTime);
        game.draw();
        requestAnimationFrame(renderFrame);
    }
    renderFrame(0);
    const restartButton = document.getElementById('reset');
    restartButton === null || restartButton === void 0 ? void 0 : restartButton.addEventListener('click', () => {
        game.start();
        restartButton.style.display = 'none';
    });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            game.pause();
        }
    });
}
window.onload = main;
//# sourceMappingURL=index.js.map