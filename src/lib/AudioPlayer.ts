import { Howl, HowlOptions } from 'howler';

let sound : any = undefined;

export const PlayAudio = (options : HowlOptions) => {
    if (sound) {
        sound.stop();
    }

    sound = new Howl(options);

    sound.play();
};
