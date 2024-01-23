type SoundOptions = {
  volume: number;
};

export class SoundEffect {
  static explosionSound: HTMLAudioElement = new Audio('/sounds/explosion.mp3');
  static music: HTMLAudioElement = new Audio('/sounds/music.mp3');
  play(sound: HTMLAudioElement, options?: Partial<SoundOptions>) {
    if (options?.volume) {
      sound.volume = options.volume / 100;
    }
    sound.play();
  }
}

export const sound = new SoundEffect();
