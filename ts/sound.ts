type SoundOptions = {
  volume: number;
  repeat: boolean;
};

type Sound = {
  id: number;
  source: HTMLAudioElement;
  isPlaying: boolean;
};

let lastId = 0;

function newSound(path: string): Sound {
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
} as const;

class SoundEffect {
  play(sound: Sound, options?: Partial<SoundOptions>) {
    if (sound.isPlaying) {
      return;
    }

    if (options?.volume) {
      sound.source.volume = options.volume / 100;
    }
    if (options?.repeat) {
      sound.source.loop = true;
    }

    sound.isPlaying = true;
    sound.source.play();
    sound.source.onended = () => (sound.isPlaying = false);
  }
  stop(sound: Sound) {
    this.pause(sound);
    sound.source.currentTime = 0;
  }
  pause(sound: Sound) {
    sound.isPlaying = false;
    sound.source.pause();
  }
}

export const soundEffect = new SoundEffect();
