/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import {getPlayerName} from '@gamepark/brigands/BrigandsOptions'
import District from '@gamepark/brigands/districts/District'
import ArrestPartners, {isArrestPartners} from '@gamepark/brigands/moves/ArrestPartners'
import JudgePrisoners, {isJudgePrisoners} from '@gamepark/brigands/moves/JudgePrisoners'
import Move from '@gamepark/brigands/moves/Move'
import MoveType from '@gamepark/brigands/moves/MoveType'
import Phase from '@gamepark/brigands/phases/Phase'
import {PrinceState} from '@gamepark/brigands/PlayerState'
import PatrolInHand from '@gamepark/brigands/types/PatrolInHand'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import {PlayerTimer, useAnimation, usePlay, usePlayer, usePlayerId} from '@gamepark/react-client'
import {Picture} from '@gamepark/react-components'
import {FC} from 'react'
import {useTranslation} from 'react-i18next'
import SetSelectedPatrol, {setSelectedPatrolMove} from '../localMoves/SetSelectedPatrol'
import Button from '../utils/Button'
import Images from '../images/Images'
import {
  getPrinceMeepleDistrictLeft, getPrinceMeepleDistrictTop, meepleSize, playerPanelHeight, playerPanelWidth, playerPanelX, playerPanelY
} from '../utils/styles'
import AvatarPanel from './AvatarPanel'
import PatrolToken from './PatrolToken'
import {getPlayerColor} from './ThiefPanel'

type Props = {
  player: PrinceState
  city: District[]
  phase: Phase | undefined
  partnersArrestedCount?: number
  selectedPatrol?: PatrolInHand
}

const PrincePanel: FC<Props> = ({player, city, phase, partnersArrestedCount, selectedPatrol}) => {

  const playerId = usePlayerId<PlayerRole>()
  const playerInfo = usePlayer(player.role)
  const {t} = useTranslation()
  const play = usePlay<Move>()
  const playSelectPatrol = usePlay<SetSelectedPatrol>()

  const arrestPartnersAnimation = useAnimation<ArrestPartners>(animation => isArrestPartners(animation.move))
  const judgePartnersAnimation = useAnimation<JudgePrisoners>(animation => isJudgePrisoners(animation.move))

  function isPatrolDraggable(phase: Phase | undefined, role: PlayerRole, district: number | null): boolean {
    if (player.isReady) {
      return false
    }
    return phase === Phase.Planning && role === playerId && !district
  }

  return (
    <>
      <div css={playerInfosPosition}>
        <AvatarPanel playerInfo={playerInfo} role={player.role}/>
        <h1 css={[nameStyle]}>{playerInfo?.name === undefined ? getPlayerName(player.role, t) : playerInfo?.name}</h1>
        <PlayerTimer playerId={player.role} css={[timerStyle]}/>
      </div>
      <div css={princePanelStyle}>
        <div css={[victoryPointStyle, victoryPointPosition(player.victoryPoints)]}/>
        {arrestPartnersAnimation && <p css={arrestPartnersHintPosition(arrestPartnersAnimation.duration)}> + {partnersArrestedCount} </p>}
        {judgePartnersAnimation && partnersArrestedCount &&
        <p css={arrestPartnersHintPosition(judgePartnersAnimation.duration)}> + {partnersArrestedCount * 2} </p>}
        {[...Array(Math.floor(player.victoryPoints / 10))].map((_, i) =>
          <Picture key={i} alt={t('victory Token')} src={Images.victoryToken} css={[victoryTokenPosition(i), shadow]}/>
        )}
      </div>
      {player.meeples.map((district, index) =>
        <PatrolToken key={index}
                     css={[patrolTokenSize, isPatrolDraggable(phase, player.role, district) && glowingPrince,
                       selectedPatrol?.index === index && patrolIsSelectedStyle,
                       district ? patrolInDistrict(index, city.findIndex(d => d.name === district)) : patrolInHand(index)
                     ]}
                     draggable={isPatrolDraggable(phase, player.role, district)}
                     type={'PatrolInHand'}
                     draggableItem={{patrolNumber: index}}
                     onClick={() => isPatrolDraggable(phase, player.role, district) && playSelectPatrol(setSelectedPatrolMove(district ?? -1, index), {local: true})}
        />
      )}
      {player.role === playerId && phase === Phase.Planning && player.patrols.every(pat => pat !== -1) && !player.isReady
      && <Button css={[validationButtonPosition, glowingButton(getPlayerColor(player.role))]}
                 onClick={() => play({type: MoveType.TellYouAreReady, playerId: player.role})} pRole={player.role}>{t('Validate')}</Button>
      }
    </>
  )
}

export const glowingButtonKeyframes = (color: string) => keyframes`
  0%, 40% {
    filter: drop-shadow(0 0 0.1em ${color});
  }
  100% {
    filter: drop-shadow(0 0 0.3em ${color});
  }
`

export const glowingButton = (color: string) => css`
  animation: ${glowingButtonKeyframes(color)} 1s infinite alternate;
`

const glowingWhiteKeyframes = keyframes`
  0% {
    filter: drop-shadow(0 0 1.1em white);
  }
  80%, 100% {
    filter: drop-shadow(0 0 0.2em white);
  }
`

const arrestPartnersKeyFrames = keyframes`
  from {
    opacity: 0;
  }
  10% {
    opacity: 1
  }
  90% {
    top: -10%;
    opacity: 1;
  }
  to {
    top: -10%;
    opacity: 0
  }

`

const arrestPartnersHintPosition = (duration: number) => css`
  height: 30%;
  width: 30%;
  position: absolute;
  top: 5%;
  left: 60%;
  font-size: 7em;
  margin: 0 0;
  color: green;
  -webkit-text-stroke: 0.02em white;

  animation: ${arrestPartnersKeyFrames} ${duration}s ease-in`

const glowingPrince = css`
  animation: ${glowingWhiteKeyframes} 1s infinite alternate;
`

const validationButtonPosition = css`
  position: absolute;
  z-index: 10;
  width: 12%;
  height: 6%;
  top: 90.4%;
  right: 21.5%;
  font-size: 3.5em;
`

const victoryTokenPosition = (points: number) => css`
  position: absolute;
  bottom: ${20 + 7.5 * (Math.floor(points / 2) + points % 2)}%;
  right: ${10 + 5 * (points % 2)}%;
  width: 8.25%;
  height: 15%;
  border-radius: 100%;
`

const shadow = css`
  border-radius: 100%;
  box-shadow: 0 0 0.5em 0.2em black;
`

const victoryPointStyle = css`
  border-radius: 100%;
  border: gold 0.4em ridge;
`

const victoryPointPosition = (points: number) => css`
  position: absolute;
  top: 32%;
  ${points % 10 !== 9 && `left:${15 + 6.5 * (points % 10)}%;`};
  ${points % 10 === 9 && `left:75%;`};
  width: 5.5%;
  height: 10%;

  transition: left 1s ease-in-out;
`

const nameStyle = css`
  font-size: 2.5em;
  font-family: 'Mulish', sans-serif;
  margin: 0.2em 1em;
`

const timerStyle = css`
  display: block;
  position: relative;
  font-size: 2.5em;
  padding-top: 0.2em;
`

const playerInfosPosition = css`
  position: absolute;
  width: ${playerPanelWidth}em;
  height: ${playerPanelHeight}em;
  left: ${playerPanelX(PlayerRole.Prince)}em;
  top: ${playerPanelY(PlayerRole.Prince)}em;
  border: 0.5em solid white;
  border-radius: 2em;
`

const patrolInHand = (index: number) => css`
  left: ${playerPanelX(PlayerRole.Prince) + 1 + index * 4.5}em;
  top: ${playerPanelY(PlayerRole.Prince) + 9}em;
  transition: top 1s ease-in-out, left 1s ease-in-out, transform 0.2s linear;
`

const patrolInDistrict = (meepleIndex: number, district: number) => css`
  top: ${getPrinceMeepleDistrictTop(meepleIndex, district)}em;
  left: ${getPrinceMeepleDistrictLeft(meepleIndex, district)}em;
  transition: top 1s ease-in-out, left 1s ease-in-out, transform 0.2s linear;
`

const patrolIsSelectedStyle = css`
  transform: translateZ(4em);
  transition: transform 0.2s linear;
`

const patrolTokenSize = css`
  position: absolute;
  z-index: 1;
  height: ${meepleSize}em;
  width: ${meepleSize}em;

`

const princePanelWidth = 84
const princePanelRatio = 579 / 1160

const princePanelStyle = css`
  position: absolute;
  left: 94em;
  bottom: 0;
  width: ${princePanelWidth}em;
  height: ${princePanelWidth * princePanelRatio}em;
  background-image: url(${Images.princePanel});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom;
`

export function decomposeGold(gold: number): number[] {
  let quotient: number
  let rest: number
  const result = []
  quotient = Math.floor(gold / 5)
  rest = gold % 5
  result.push(quotient)
  if (rest === 0) {
    result.push(0)
    result.push(0)
    return result
  } else {
    let gold2 = rest
    quotient = Math.floor(gold2 / 2)
    rest = gold2 % 2

    result.push(quotient)
    if (rest === 0) {
      result.push(0)
      return result
    } else {
      result.push(1)
      return result
    }
  }

}

export function getCoin(type: number): string {
  switch (type) {
    case 0:
      return Images.coin5
    case 1:
      return Images.coin2
    case 2:
      return Images.coin1
    default:
      return 'error : no coin detected'
  }
}

export default PrincePanel