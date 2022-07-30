/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import {getPlayerName} from '@gamepark/brigands/BrigandsOptions'
import District from '@gamepark/brigands/districts/District'
import DistrictName from '@gamepark/brigands/districts/DistrictName'
import BetGold, {isBetGold} from '@gamepark/brigands/moves/BetGold'
import GainGold, {isGainGold} from '@gamepark/brigands/moves/GainGold'
import Move from '@gamepark/brigands/moves/Move'
import MoveType from '@gamepark/brigands/moves/MoveType'
import ResolveStealToken, {isResolveStealToken} from '@gamepark/brigands/moves/ResolveStealToken'
import {takeTokenMove} from '@gamepark/brigands/moves/TakeToken'
import Phase from '@gamepark/brigands/phases/Phase'
import {isThiefState, PrinceState, ThiefState} from '@gamepark/brigands/PlayerState'
import Partner, {isPartner, isPartnerView} from '@gamepark/brigands/types/Partner'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import {ThiefView} from '@gamepark/brigands/types/Thief'
import ThiefTokenInBank from '@gamepark/brigands/types/ThiefTokenInBank'
import ThiefTokenInHand from '@gamepark/brigands/types/ThiefTokenInHand'
import {PlayerTimer, useAnimation, usePlay, usePlayer, usePlayerId} from '@gamepark/react-client'
import {Picture} from '@gamepark/react-components'
import {FC, HTMLAttributes} from 'react'
import {useDrop} from 'react-dnd'
import {useTranslation} from 'react-i18next'
import {resolveStealDurationUnit} from '../BrigandsAnimations'
import SetSelectedPartner, {ResetSelectedPartner, resetSelectedPartnerMove, setSelectedPartnerMove} from '../localMoves/SetSelectedPartner'
import {ResetSelectedTokenInHand, resetSelectedTokenInHandMove} from '../localMoves/SetSelectedTokenInHand'
import {ResetSelectedTokensInBank, resetSelectedTokensInBankMove} from '../localMoves/SetSelectedTokensInBank'
import Button from '../utils/Button'
import Images from '../images/Images'
import {
  getThiefMeepleDistrictLeft, getThiefMeepleDistrictTop, meepleSize, playerPanelHeight, playerPanelWidth, playerPanelX, playerPanelY
} from '../utils/styles'
import AvatarPanel from './AvatarPanel'
import PartnerComponent from './PartnerComponent'
import {decomposeGold, getCoin} from './PrincePanel'

type Props = {
  player: ThiefState | ThiefView
  thieves: (ThiefState | ThiefView)[]
  displayedThievesOrder: PlayerRole[]
  prince: PrinceState
  phase: Phase | undefined
  positionForPartners: number
  city: District[]
  numberOfThieves: number
  districtResolved?: District
  partnersForCards?: Partner[]
  partnerSelected?: number
  tokensInBankSelected?: ThiefTokenInBank[]
  deckSize: number
  tokenInHandSelected?: ThiefTokenInHand
  tutorial?: boolean

} & HTMLAttributes<HTMLDivElement>

const ThiefPanel: FC<Props> = ({
                                 player, prince, phase, positionForPartners, city, numberOfThieves, districtResolved, thieves, partnersForCards,
                                 displayedThievesOrder, partnerSelected, tokensInBankSelected, deckSize, tokenInHandSelected, tutorial, ...props
                               }) => {

  const playerId = usePlayerId<PlayerRole>()
  const playerInfo = usePlayer(player.role)
  const {t} = useTranslation()

  const animationBetGold = useAnimation<BetGold>(animation => isBetGold(animation.move))
  const animationGainGold = useAnimation<GainGold>(animation => isGainGold(animation.move))
  const animationResolveSteal = useAnimation<ResolveStealToken>(animation => isResolveStealToken(animation.move))

  function isPartnerDraggable(phase: Phase | undefined, role: PlayerRole): boolean {
    return phase === Phase.Planning && role === playerId && !player.isReady
  }

  const play = usePlay<Move>()
  const playSelectPartner = usePlay<SetSelectedPartner>()
  const playResetTokensInBank = usePlay<ResetSelectedTokensInBank>()

  const playResetSelectedTokenInHand = usePlay<ResetSelectedTokenInHand>()
  const playResetSelectedPartner = usePlay<ResetSelectedPartner>()

  const [{canDrop, isOver}, dropRef] = useDrop({
    accept: ['ThiefTokenInBank'],
    canDrop: () => {
      return playerId === player.role
    },
    collect: monitor => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver()
    }),
    drop: () => {
      playResetTokensInBank(resetSelectedTokensInBankMove(), {local: true})
      return takeTokenMove(playerId!)
    }
  })

  function playTellYouAreReady() {
    playResetSelectedTokenInHand(resetSelectedTokenInHandMove(), {local: true})
    playResetSelectedPartner(resetSelectedPartnerMove(), {local: true})
    play({type: MoveType.TellYouAreReady, playerId: player.role})
  }

  return (

    <>
      <div ref={dropRef} css={[preserve, panelPlayerStyle(getPlayerColor(player.role)), canDrop && canDropStyle, canDrop && isOver && isOverStyle]} {...props}>

        <div>
          <AvatarPanel playerInfo={playerInfo} role={player.role}/>
          <h1 css={[nameStyle]}>{playerInfo?.name === undefined ? getPlayerName(player.role, t) : playerInfo?.name}</h1>
          <PlayerTimer playerId={player.role} css={[timerStyle]}/>
        </div>

        {isThiefState(player) && <div css={goldPanel}><p> {t('Ducats')} : {player.gold}</p></div>}

        {isThiefState(player) && phase === undefined &&
        <div><p css={scoreDivStyle}> {t('Score')} : {player.gold}</p>
        </div>}

        {animationGainGold && (animationGainGold.move.thief === player.role)
        && <div css={flexStyle}> {decomposeGold(animationGainGold.move.gold).map((coin, index) =>
          [...Array(coin)].map((_, index2) => <Picture key={index2 + '_' + index} alt={t('Coin')} src={getCoin(index)}
                                                       css={[coinPosition(index), gainGoldAnimation(animationGainGold.duration, city.findIndex(d => d.name === districtResolved!.name)!, numberOfThieves, positionForPartners, (playerId === PlayerRole.Prince || playerId === undefined))]}/>))}
        </div>
        }

        {animationResolveSteal && (animationResolveSteal.move.steals.find(s => s.victim === player.role))
        && <div css={flexStyle}>{
          animationResolveSteal.move.steals.filter(s => s.victim === player.role && s.thief !== player.role).map((steal, stealIndex) =>
            decomposeGold(steal.gold).map((coin, coinIndex) =>
              [...Array(coin)].map((_, index) => <Picture key={stealIndex + '_' + coinIndex + '_' + index} alt={t('Coin')} src={getCoin(coinIndex)}
                                                          css={[coinPosition(coinIndex), translateAnimation(stealIndex, displayedThievesOrder.findIndex(t => t === steal.thief), displayedThievesOrder.findIndex(t => t === steal.victim), numberOfThieves)]}/>
              )
            )
          )}
        </div>
        }

      </div>

      {player.meeples.map((district, index) =>
        <PartnerComponent key={index}
                          css={[partnerSize,
                            (partnerSelected === index && player.role === playerId && isSelectedStyle),
                            !district && isPartnerDraggable(phase, player.role) && glowingBrigand(getGlowingPlayerColor(player.role)),
                            district ?
                              onCity(player.role, index, city.findIndex(d => d.name === district), isEmphazing(player.role, index, thieves, phase, districtResolved)) :
                              partnerHandPosition(player.role, index)
                          ]}
                          role={player.role}
                          partners={player.partners}
                          partnerNumber={index}
                          phase={phase}

                          draggable={!district && isPartnerDraggable(phase, player.role)}
                          type={'PartnerInHand'}
                          draggableItem={{partnerNumber: index}}

                          onClick={() => phase === Phase.Planning && player.role === playerId && !district && playSelectPartner(setSelectedPartnerMove(index), {local: true})}

        />
      )}

      {player.role === playerId && phase === Phase.Planning && !player.isReady && player.partners.every(part => !isPartnerView(part) && part.district !== undefined)
      && <Button css={[validationButtonPosition, glowingButton(getPlayerColor(player.role))]} onClick={() => playTellYouAreReady()}
                 pRole={player.role}>{t('Validate')}</Button>
      }

      {animationBetGold && (animationBetGold.move.role === player.role &&
        <div css={[betStyle(animationBetGold.move.gold), betSize, betPositionPlayer(positionForPartners, numberOfThieves),
          betGoldAnimation(animationBetGold.duration, city.findIndex(d => d.name === districtResolved!.name), (playerId === PlayerRole.Prince || playerId === undefined))]}/>)
      }
    </>
  )
}

function isEmphazing(role: PlayerRole, partnerIndex: number, thieves: (ThiefState | ThiefView)[], phase: Phase | undefined, districtResolved: District | undefined): boolean {
  if (districtResolved === undefined || (districtResolved.name !== DistrictName.Jail && districtResolved.name !== DistrictName.Tavern)) return false
  else {
    return districtResolved.name === DistrictName.Jail ? isEscaping(role, partnerIndex, thieves, phase, districtResolved) : isBetting(role, partnerIndex, thieves, phase, districtResolved)
  }
}

function isEscaping(role: PlayerRole, partnerIndex: number, thieves: (ThiefState | ThiefView)[], phase: Phase | undefined, districtResolved: District | undefined): boolean {
  const colorOfPartnerEscaping: PlayerRole | undefined = thieves.find(t => t.partners.find(part => isPartner(part) && part.district === DistrictName.Jail && part.solvingDone !== true)) !== undefined
    ? thieves.find(t => t.partners.find(part => isPartner(part) && part.district === DistrictName.Jail && part.solvingDone !== true)!)!.role
    : undefined

  if (colorOfPartnerEscaping === undefined || phase !== Phase.Solving || districtResolved === undefined || districtResolved.name !== DistrictName.Jail) return false
  else {
    const indexOfPartnerEscaping: number = thieves.find(t => t.role === colorOfPartnerEscaping)!.partners.findIndex(part => isPartner(part) && part.district === DistrictName.Jail && part.solvingDone !== true)
    return role === colorOfPartnerEscaping && partnerIndex === indexOfPartnerEscaping
  }
}

function isBetting(role: PlayerRole, partnerIndex: number, thieves: (ThiefState | ThiefView)[], phase: Phase | undefined, districtResolved: District | undefined): boolean {
  const colorOfPartnerEscaping: PlayerRole | undefined = thieves.find(t => t.partners.find(part => isPartner(part) && part.district === DistrictName.Tavern && part.goldForTavern !== undefined)) !== undefined
    ? thieves.find(t => t.partners.find(part => isPartner(part) && part.district === DistrictName.Tavern && part.goldForTavern !== undefined)!)!.role
    : undefined

  if (colorOfPartnerEscaping === undefined || phase !== Phase.Solving || districtResolved === undefined || districtResolved.name !== DistrictName.Tavern) return false
  else {
    const indexOfPartnerEscaping: number = thieves.find(t => t.role === colorOfPartnerEscaping)!.partners.findIndex(part => isPartner(part) && part.district === DistrictName.Tavern && part.goldForTavern !== undefined)
    return role === colorOfPartnerEscaping && partnerIndex === indexOfPartnerEscaping
  }
}

function getStealTranslationLength(numberOfThieves: number): number {
  switch (numberOfThieves) {
    case 2:
      return 74
    case 3:
      return 57
    case 4:
      return 42
    case 5:
      return 32
    default:
      return 0
  }
}

const translateXKeyFrames = (deltaPositions: number, numberOfThieves: number) => keyframes`
  from {
  }
  10% {
  }
  90% {
    transform: translateX(${deltaPositions * getStealTranslationLength(numberOfThieves)}em);
  }
  to {
    transform: translateX(${deltaPositions * getStealTranslationLength(numberOfThieves)}em);
  }
`

const translateAnimation = (startIndex: number, positionOfThief: number, positionOfVictim: number, numberOfThieves: number) => css`
  opacity: 0;
  animation: ${fadeKeyframes} ${resolveStealDurationUnit}s linear ${startIndex * resolveStealDurationUnit}s,
  ${translateXKeyFrames(positionOfThief - positionOfVictim, numberOfThieves)} ${resolveStealDurationUnit}s ease-in-out ${startIndex * resolveStealDurationUnit}s
`
//${translateZKeyFrames} ${resolveStealDurationUnit}s cubic-bezier(.17,.31,.79,.92) ${startIndex*resolveStealDurationUnit}s

const fadeKeyframes = keyframes`
  from {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`

export const glowingColoredKeyframes = (color: string) => keyframes`
  0% {
    filter: drop-shadow(0 0 0.8em ${color});
  }
  80%, 100% {
    filter: drop-shadow(0 0 0.2em ${color});
  }
`

export const glowingBrigand = (color: string) => css`

  animation: ${glowingColoredKeyframes(color)} 1s infinite alternate;
`

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

const gainGoldKeyFrames = (numberOfThieves: number, playerPos: number, districtPos: number, isPrinceView: boolean) => keyframes`
  from {
    opacity: 0;
    ${getTranslation(numberOfThieves, playerPos, districtPos, isPrinceView, 0)}
  }
  30%, 50% {
    opacity: 1;
    ${getTranslation(numberOfThieves, playerPos, districtPos, isPrinceView, 1.1)}
  }
  80% {
    opacity: 1;
    transform: translateX(0em) translateY(0em) scale(1, 1);
  }
  to {
    opacity: 0;
    transform: translateX(0em) translateY(0em) scale(1, 1);
  }
`

const gainGoldAnimation = (duration: number, districtPos: number, numberOfThieves: number, playerPos: number, isPrinceView: boolean) => css`
  animation: ${gainGoldKeyFrames(numberOfThieves, playerPos, districtPos, isPrinceView)} ${duration}s infinite;
`

const getTranslation = (numberOfThieves: number, playerPos: number, districtPos: number, isPrinceView: boolean, scaling: number) => {
  switch (numberOfThieves) {
    case 2 : {
      return css`transform: translate(${-30.5 + districtPos * 20.6 - playerPos * 80}em, ${isPrinceView ? 30 : -28}em) scale(${scaling}, ${scaling});
        transform-origin: bottom left;`
    }
    case 3 : {
      return css`transform: translate(${-16.2 + districtPos * 20.6 - playerPos * 53.5}em, ${isPrinceView ? 30 : -28}em) scale(${scaling}, ${scaling});
        transform-origin: bottom left;`
    }
    case 4 : {
      return css`transform: translate(${-10 + districtPos * 20.6 - playerPos * 40}em, ${isPrinceView ? 30 : -28}em) scale(${scaling}, ${scaling});
        transform-origin: bottom left;`
    }
    case 5 : {
      return css`transform: translate(${-6 + districtPos * 20.6 - playerPos * 32}em, ${isPrinceView ? 30 : -28}em) scale(${scaling}, ${scaling});
        transform-origin: bottom left;`
    }
    default : {
      return css``
    }
  }
}

const flexStyle = css`
  display: flex;
  position: absolute;
  top: 50%;
  width: 17.5%;
  height: 40%;
`

const coinPosition = (index1: number) => css`
  position: relative;
  top: ${index1 * 0.8}em;
  left: 4em;
  margin: 0 ${-2 + index1 * 0.5}em;
  border-radius: 100%;
  box-shadow: 0 0 1em 0.2em black;
  width: ${6 + (2 - index1 * 0.8)}em;
  height: ${6 + (2 - index1 * 0.8)}em;

`

const betGoldKeyFrames = (tavernPosition: number, isPrinceView: boolean) => keyframes`
  from {
    opacity: 1;
  }
  80% {
    top: ${isPrinceView ? 140 : -90}%;
    left: ${2 + tavernPosition * 12.9}%;
    opacity: 1;
  }
  to {
    top: ${isPrinceView ? 140 : -90}%;
    left: ${2 + tavernPosition * 12.9}%;
    opacity: 0;
  }
`

const betGoldAnimation = (duration: number, tavernPosition: number, isPrinceView: boolean) => css`
  animation: ${betGoldKeyFrames(tavernPosition, isPrinceView)} ${duration}s ease-in;
`

const betStyle = (gold: number) => css`
  ${gold === 1 && `
background: center center / 70% no-repeat url(${Images.coin1})`}
  ${gold === 2 && `
background: center bottom / 70% no-repeat url(${Images.coin1}), center top / 70% no-repeat url(${Images.coin1})`}
  ${gold === 3 && `
background: center bottom / 70% no-repeat url(${Images.coin1}), center top / 85% no-repeat url(${Images.coin2})`}
  ${gold === 4 && `
background: center bottom / 85% no-repeat url(${Images.coin2}), center top / 85% no-repeat url(${Images.coin2})`}
  ${gold === 5 && `
background: center center / 100% no-repeat url(${Images.coin5})`}
`

const betPositionPlayer = (position: number, numberOfThieves: number) => css`
  position: absolute;
  top: 50%;
  ${numberOfThieves === 2 && `left:${22.5 + position * 50}%;`}
  ${numberOfThieves === 3 && `left:${14 + position * 33.5}%;`}
  ${numberOfThieves === 4 && `left:${10 + position * 25.2}%;`}
  ${numberOfThieves === 5 && `left:${7.8 + position * 20}%;`}
`

const betSize = css`
  width: 5%;
  height: 40%;
`

const transitionPartner = css`
  transition: top 1s ease-in-out, left 1s ease-in-out, transform 0.2s linear;
`

const canDropStyle = css`
  background-color: rgba(0, 0, 0, 0.5);
  transition: background-color 0.5s linear;
`

const isOverStyle = css`
  background-color: rgba(0, 0, 0, 0.8);
  transition: background-color 0.5s linear;
`

const validationButtonPosition = css`
  position: absolute;
  width: 13%;
  height: 23%;
  top: -136%;
  right: 19.5%;
  font-size: 3.5em;
`

const onCity = (role: PlayerRole, index: number, district: number, isEscaping: boolean) => css`
  top: ${getThiefMeepleDistrictTop(role, index, district)}em;
  left: ${getThiefMeepleDistrictLeft(role, index, district)}em;
  ${isEscaping && `transform:translateZ(4em) scale(1.4,1.4);`};
  ${transitionPartner};
`

const partnerHandPosition = (color: PlayerRole, meepleIndex: number) => css`
  left: ${playerPanelX(color) + 1 + meepleIndex * 4.5}em;
  top: ${playerPanelY(color) + 9}em;

  ${transitionPartner};
`

const goldPanel = css`
  position: absolute;
  bottom: 1em;

  p {
    font-size: 2.5em;
    margin: 0.2em 0.5em;
    text-align: center;
  }
`

const scoreDivStyle = css`
  font-size: 2.8em;
  margin: 0.2em 0.5em;
  text-align: center;
`

const partnerSize = css`
  position: absolute;
  width: ${meepleSize}em;
  height: ${meepleSize}em;
  z-index: 7;
`

const isSelectedStyle = css`
  transform: translateZ(4em);
`

const nameStyle = css`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 2.5em;
  font-family: 'Mulish', sans-serif;
  margin: 0.2em 1em;
`

const timerStyle = css`
  display: block;
  position: relative;
  left: 5em;
  font-size: 2.5em;
  padding-top: 0.2em;
`

const panelPlayerStyle = (color: string) => css`
  border: 0.5em solid ${color};
  border-radius: 2em;
  width: ${playerPanelWidth}em;
  height: ${playerPanelHeight}em;
`

const preserve = css`
  transform-style: preserve-3d;
`

export function getPlayerColor(role: PlayerRole): string {
  switch (role) {
    case PlayerRole.BlueThief :
      return '#0090ff'
    case PlayerRole.GreenThief :
      return '#49cf00'
    case PlayerRole.PurpleThief :
      return '#a100fe'
    case PlayerRole.RedThief :
      return '#fe0000'
    case PlayerRole.YellowThief :
      return '#fea500'
    default :
      return '#FFFFFF'
  }
}

export function getGlowingPlayerColor(role: PlayerRole): string {
  switch (role) {
    case PlayerRole.BlueThief :
      return '#00c5e3'
    case PlayerRole.GreenThief :
      return '#5dff05'
    case PlayerRole.PurpleThief :
      return '#ff00ff'
    case PlayerRole.RedThief :
      return '#ff2626'
    case PlayerRole.YellowThief :
      return '#fef100'
    default :
      return '#FFFFFF'
  }
}

export default ThiefPanel