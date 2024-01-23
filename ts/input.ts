export enum Keys {
  RIGHT = 'ArrowRight',
  LEFT = 'ArrowLeft',
  UP = 'ArrowUp',
  DOWN = 'ArrowDown',
  ESCAPE = 'Escape',
  SPACE = ' ',
}

export class InputHandler {
  private keys: Set<string> = new Set();
  private keysPressed: Set<string> = new Set();

  constructor() {
    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case Keys.LEFT:
        case Keys.RIGHT:
        case Keys.UP:
        case Keys.DOWN:
        case Keys.SPACE:
        case Keys.ESCAPE:
          if (!this.keysPressed.has(e.key)) {
            this.keys.add(e.key);
          }
          break;
        default:
          return;
      }
    });
    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.key);
      this.keysPressed.delete(e.key);
    });
  }

  public has(k: Keys): boolean {
    return this.keys.has(k);
  }
  public pressed(k: Keys): boolean {
    if (this.keys.has(k)) {
      this.keys.delete(k);
      this.keysPressed.add(k);
      return true;
    }
    return false;
  }
}
