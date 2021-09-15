/** @jsxImportSource @emotion/react */
import GameView from '@gamepark/brigands/GameView'
import {FailuresDialog, FullscreenDialog, Menu, useGame} from '@gamepark/react-client'
import {Header, ImagesLoader, LoadingScreen} from '@gamepark/react-components'
import {useEffect, useState} from 'react'
import {DndProvider} from 'react-dnd-multi-backend'
import HTML5ToTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch'
import GameDisplay from './GameDisplay'
import HeaderText from './HeaderText'
import { AudioLoader } from './utils/AudioLoader'
import Images from './utils/Images'
import {SoundLoader} from './utils/SoundLoader'

import GoldCoinSound from './sounds/gold1.mp3'
import GoldBagSound from './sounds/goldBag.mp3'
import MoveToken from './sounds/moveToken.mp3'
import CardFlip from './sounds/cardFlip.mp3'
import DiceRoll from './sounds/diceRoll.mp3'
import DiceShake from './sounds/diceShake.mp3'
import PrisonDoor from './sounds/prisonDoor.mp3'
import EndSound from './sounds/trumpet.mp3'

export default function App() {
  const game = useGame<GameView>()

  const [audioLoader, setAudioLoader] = useState<AudioLoader>()
  const [imagesLoading, setImagesLoading] = useState(true)
  const [isSoundsLoading, setSoundLoading] = useState(true)

  const [isJustDisplayed, setJustDisplayed] = useState(true)
  useEffect(() => {
    setTimeout(() => setJustDisplayed(false), 2000)
  }, [])
  const loading = !game || imagesLoading || isJustDisplayed || isSoundsLoading
  return (
    <DndProvider options={HTML5ToTouch}>
      {!loading && audioLoader && game && <GameDisplay game={game} audioLoader={audioLoader} />}
      <LoadingScreen display={loading} 
                     author="Florian Boué & Laurène Brosseau"
                     artist="Sylvain Aublin" 
                     publisher="Aspic Games" 
                     developer="Théo Grégorio"/>
      <Header><HeaderText loading={loading} game={game}/></Header>
      <ImagesLoader images={Object.values(Images)} onImagesLoad={() => setImagesLoading(false)}/>
      <SoundLoader sounds={[GoldCoinSound, GoldBagSound, MoveToken, CardFlip, DiceRoll, DiceShake, PrisonDoor, EndSound]} onSoundLoad={() => setSoundLoading(false)} onSoundsPrepared={ (audioLoader) => setAudioLoader(audioLoader) }/>
      <Menu/>
      <FailuresDialog/>
      <FullscreenDialog/>
    </DndProvider>
  )
}