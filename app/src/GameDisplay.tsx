/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import GameView from '@gamepark/brigands/GameView'
import { isPrinceState, isThiefState } from '@gamepark/brigands/PlayerState'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import { usePlayerId } from '@gamepark/react-client'
import {Letterbox} from '@gamepark/react-components'
import { useMemo } from 'react'
import City from './board/City'
import PanelPlayer from './board/PanelPlayer'
import PrincePanel from './board/PrincePanel'
import ThiefTokensInBank from './board/ThiefTokensInBank'
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
                    top:0;left:0;width:100%;height:100%;`}>
        
        <PrincePanel css = {[princePanelPosition, playerId === undefined || playerId === PlayerRole.Prince ? displayBottomPrince : displayTopPrince]}
                     player = {players.find(isPrinceState)!}/>


        <WeekCardsPanel css = {[weekCardsPanelPosition, playerId === undefined || playerId === PlayerRole.Prince ? displayBottomWeekCard : displayTopWeekCard]}
                        event = {game.event} 
                        eventDeck = {game.eventDeck} />

        <ThiefTokensInBank css={[thiefTokensInBankPosition, playerId === undefined || playerId === PlayerRole.Prince ? displayBottomBank : displayTopBank ]}
                           players = {players.filter(isThiefState)}  
        />
                        

        <City css = {cityPosition}
              city = {game.city}
              phase = {game.phase}
              prince = {players.find(isPrinceState)!}
              thieves = {players.filter(isThiefState)}
              />

        <div css={[panelPlayerPosition, playerId === undefined || playerId === PlayerRole.Prince ? displayTopThieves : displayBottomThieves]}>

          {players.filter(isThiefState).map((p, index) => 
            
            <PanelPlayer key = {index}
            css = {panelPlayerSize} 
            player = {p} 
            phase = {game.phase} />

          )}

        </div>

      </div>
    </Letterbox>
  )
}

const thiefTokensInBankPosition = css`
position:absolute;
width:25%;
height:30%;
`

const panelPlayerPosition = css`
position:absolute;
left:5%;
display:flex;
flex-direction:row;
justify-content:space-around;
width:90%;
height:25%;
`

const displayBottomBank = css`
left:70%;
top:62%;
`

const displayTopBank = css`
left:65%;
top:10%;
`

const displayBottomWeekCard = css`
top:72%;
left:5%;
`

const displayTopWeekCard = css`
top:16%;
left:6.5%;
transform:scale(0.9,0.9);
`

const displayBottomThieves = css`
top:65%;
`

const displayTopThieves = css`
top:8%;
`

const displayBottomPrince = css`
top:62%;
`

const displayTopPrince = css`
top:7%;
transform:scale(0.95,0.95);
`

const panelPlayerSize = css`
width:18%;
height:100%;
`

const weekCardsPanelPosition = css`
  position:absolute;
  width:25%;
  height:25%;
`

const cityPosition = css`
  position:absolute;
  top:41.5%;
  left:5%;
  width:90%;
  height:20%;
`

const princePanelPosition = css`
  position:absolute;
  left:30%;
  width:35%;
  height:35%;
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