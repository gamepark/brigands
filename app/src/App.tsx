/** @jsxImportSource @emotion/react */
import GameView from '@gamepark/brigands/GameView'
import {FailuresDialog, FullscreenDialog, Menu, useGame} from '@gamepark/react-client'
import {Header, LoadingScreen} from '@gamepark/react-components'
import {useEffect, useState} from 'react'
import {DndProvider} from 'react-dnd-multi-backend'
import HTML5ToTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch'
import GameDisplay from './GameDisplay'
import HeaderText from './HeaderText'
import Images from './utils/Images'

export default function App() {
  const game = useGame<GameView>()
  const [isJustDisplayed, setJustDisplayed] = useState(true)
  useEffect(() => {
    setTimeout(() => setJustDisplayed(false), 2000)
  }, [])
  const loading = !game || isJustDisplayed
  return (
    <DndProvider options={HTML5ToTouch}>
      {game && <GameDisplay game={game}/>}
      <LoadingScreen display={loading} gameBox={Images.box} author="Florian Boué & Laurène Brosseau" artist="Sylvain Aublin" publisher="Aspic Games" developer="Théo Grégorio"/>
      <Header><HeaderText loading={loading} game={game}/></Header>
      <Menu/>
      <FailuresDialog/>
      <FullscreenDialog/>
    </DndProvider>
  )
}