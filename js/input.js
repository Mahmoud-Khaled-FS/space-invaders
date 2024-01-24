export var Keys;
(function (Keys) {
    Keys["RIGHT"] = "ArrowRight";
    Keys["LEFT"] = "ArrowLeft";
    Keys["UP"] = "ArrowUp";
    Keys["DOWN"] = "ArrowDown";
    Keys["ESCAPE"] = "Escape";
    Keys["SPACE"] = " ";
})(Keys || (Keys = {}));
export class InputHandler {
    constructor() {
        this.keys = new Set();
        this.keysPressed = new Set();
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
    has(k) {
        return this.keys.has(k);
    }
    pressed(k) {
        if (this.keys.has(k)) {
            this.keys.delete(k);
            this.keysPressed.add(k);
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=input.js.map