/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import GameView from '@gamepark/brigands/GameView'
import { isPrinceState } from '@gamepark/brigands/PlayerState'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import { usePlayerId } from '@gamepark/react-client'
import {Letterbox} from '@gamepark/react-components'
import { useMemo } from 'react'
import City from './board/City'
import PrincePanel from './board/PrincePanel'
import WeekCardsPanel from './board/WeekCardsPanel'

type Props = {
  game: GameView
} 

export default function GameDisplay({game}: Props) {

  const playerId = usePlayerId<PlayerRole>()
  const players = useMemo(() => getPlayersStartingWith(game, playerId), [game, playerId])  

  return (
    <Letterbox css={letterBoxStyle} top={0}>
      <div css={css`position: absolute;
                    top:0;left:0;width:100%;height:100%; font-size: 3em;`}>
        
        <PrincePanel  css = {princePanelPosition}
                      player = {game.players.find(p => isPrinceState(p))!}/>

        <WeekCardsPanel css = {weekCardsPanelPosition}
                        event = {game.event} 
                        eventDeck = {game.eventDeck} />
                        

        <City css = {cityPosition}
              city = {game.city}/>

      </div>
    </Letterbox>
  )
}

const weekCardsPanelPosition = css`
  position:absolute;
  top:65%;
  left:10%;
  width:20%;
  height:30%;
`

const cityPosition = css`
  position:absolute;
  top:40%;
  left:5%;
  width:90%;
  height:20%;
`

const princePanelPosition = css`
  position:absolute;
  top:65%;
  left:30%;
  width:35%;
  height:30%;
`

export const getPlayersStartingWith = (game: GameView, playerId?: PlayerRole) => {
  if (playerId) {
    const playerIndex = game.players.findIndex(player => player.role === playerId)
    return [...game.players.slice(playerIndex, game.players.length), ...game.players.slice(0, playerIndex)]
  } else {
    return game.players
  }
}

const fadeIn = keyframes`
  from, 50% {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const letterBoxStyle = css`
  animation: ${fadeIn} 3s ease-in forwards;
`