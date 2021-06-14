/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import GameView from '@gamepark/brigands/GameView'
import ThrowDice from '@gamepark/brigands/moves/ThrowDice'
import { isPrinceState, isThiefState, ThiefState } from '@gamepark/brigands/PlayerState'
import DistrictName from '@gamepark/brigands/types/DistrictName'
import Phase from '@gamepark/brigands/types/Phase'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import { isNotThiefView, ThiefView } from '@gamepark/brigands/types/Thief'
import { useAnimation, usePlayerId } from '@gamepark/react-client'
import {Letterbox} from '@gamepark/react-components'
import { useMemo } from 'react'
import City from './board/City'
import DicePopUp from './board/DicePopUp'
import PanelPlayer from './board/PanelPlayer'
import PrincePanel from './board/PrincePanel'
import TavernPopUp from './board/TavernPopUp'
import ThiefTokensInBank from './board/ThiefTokensInBank'
import WeekCardsPanel from './board/WeekCardsPanel'
import {isThrowDice} from '@gamepark/brigands/moves/ThrowDice'

type Props = {
  game: GameView
} 

export default function GameDisplay({game}: Props) {

  const diceAnimation = useAnimation<ThrowDice>(animation => isThrowDice(animation.move))

  const playerId = usePlayerId<PlayerRole>()
  const players = useMemo(() => getPlayersStartingWith(game, playerId), [game, playerId])  

  function isTavernPopUpDisplay(playerList:(ThiefState|ThiefView)[], role:PlayerRole | undefined, phase:Phase | undefined, districtResolved:DistrictName | undefined){
    return phase === Phase.Solving && districtResolved === DistrictName.Tavern && role === playerId  && (playerList.find(p => p.role === role) as ThiefState).partner.some(p => p.district === DistrictName.Tavern)
  }

  return (
    <Letterbox css={letterBoxStyle} top={0}>
      <div css={css`position: absolute;
                    top:0;left:0;width:100%;height:100%;`}>
        
        <PrincePanel css = {[princePanelPosition, playerId === undefined || playerId === PlayerRole.Prince ? displayBottomPrince : displayTopPrince]}
                     player = {players.find(isPrinceState)!}
                     city={game.city}
                     phase={game.phase}
                     />


        <WeekCardsPanel css = {[weekCardsPanelPosition, playerId === undefined || playerId === PlayerRole.Prince ? displayBottomWeekCard : displayTopWeekCard]}
                        event = {game.event} 
                        eventDeck = {game.eventDeck} />

        <ThiefTokensInBank css={[thiefTokensInBankPosition, playerId === undefined || playerId === PlayerRole.Prince ? displayBottomBank : displayTopBank ]}
                           players = {players.filter(isThiefState)}  
                           phase={game.phase}
                           resolvedDistrict={game.districtResolved && game.city[game.districtResolved].name}
        />
                        

        <City css = {cityPosition}
              city = {game.city}
              phase = {game.phase}
              prince = {players.find(isPrinceState)!}
              districtResolved = {game.districtResolved}
        />

        <TavernPopUp position={game.city.findIndex(d => d.name === DistrictName.Tavern)}
                     css={isTavernPopUpDisplay(game.players.filter(isThiefState), playerId, game.phase, game.districtResolved && game.city[game.districtResolved].name) ? displayTavernPopUp : hideTavernPopUp}
                     player = {players.filter(isThiefState).find(isNotThiefView)!}
        />

        {game.districtResolved !== undefined && diceAnimation !== undefined &&
          <DicePopUp dice={diceAnimation.move.dice} 
          />}

        <div css={[panelPlayerPosition, playerId === undefined || playerId === PlayerRole.Prince ? displayTopThieves : displayBottomThieves]}>

          {players.filter(isThiefState).map((p, index) => 
            
            <PanelPlayer key = {index}
            positionForPartners = {index}
            css = {panelPlayerSize} 
            player = {p} 
            phase = {game.phase}
            city={game.city}
            numberOfThieves = {players.filter(isThiefState).length}
            />

          )}

        </div>

      </div>
    </Letterbox>
  )
}


const hideTavernPopUp = css`
display:none;
`

const displayTavernPopUp = css`
display:flex;
`

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