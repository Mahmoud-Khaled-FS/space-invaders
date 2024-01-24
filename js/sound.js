let lastId = 0;
function newSound(path) {
    lastId++;
    return {
        source: new Audio(path),
        id: lastId,
        isPlaying: false,
    };
}
export const sounds = {
    explosion: newSound('/sounds/explosion.mp3'),
    bullet: newSound('/sounds/shooting.mp3'),
    music: newSound('/sounds/music.mp3'),
};
class SoundEffect {
    play(sound, options) {
        if (sound.isPlaying) {
            return;
        }
        if (options === null || options === void 0 ? void 0 : options.volume) {
            sound.source.volume = options.volume / 100;
        }
        if (options === null || options === void 0 ? void 0 : options.repeat) {
            sound.source.loop = true;
        }
        sound.isPlaying = true;
        sound.source.play();
        sound.source.onended = () => (sound.isPlaying = false);
    }
    stop(sound) {
        this.pause(sound);
        sound.source.currentTime = 0;
    }
    pause(sound) {
        sound.isPlaying = false;
        sound.source.pause();
    }
}
export const soundEffect = new SoundEffect();
//# sourceMappingURL=sound.js.map