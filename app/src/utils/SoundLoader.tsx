import {FC, useEffect} from 'react'
import { AudioLoader } from './AudioLoader';

type Props = {
    sounds: string[]
    onSoundLoad?: () => void
    onSoundsPrepared?: (audioLoader:AudioLoader) => void
  }

const SoundLoader : FC<Props> = ({sounds, onSoundLoad, onSoundsPrepared}) => {



    useEffect(() => {

        const audioLoader = new AudioLoader(sounds.map(sound => ({id:sound, url:sound})));
        audioLoader.load(() => {
            if(onSoundsPrepared){
                onSoundsPrepared(audioLoader);
            }
            if (onSoundLoad){
                onSoundLoad();
            }
        })

    }, [])

    return null

}

export default SoundLoader
