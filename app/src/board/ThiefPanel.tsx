/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import {getTokensInBank, isThisPartnerHasKickToken, isThisPartnerHasMoveToken} from '@gamepark/brigands/Brigands'
import {getPlayerName} from '@gamepark/brigands/BrigandsOptions'
import District from '@gamepark/brigands/districts/District'
import DistrictName from '@gamepark/brigands/districts/DistrictName'
import {EventArray} from '@gamepark/brigands/material/Events'
import BetGold, {isBetGold} from '@gamepark/brigands/moves/BetGold'
import GainGold, {isGainGold} from '@gamepark/brigands/moves/GainGold'
import Move from '@gamepark/brigands/moves/Move'
import MoveType from '@gamepark/brigands/moves/MoveType'
import ResolveStealToken, {isResolveStealToken} from '@gamepark/brigands/moves/ResolveStealToken'
import Phase from '@gamepark/brigands/phases/Phase'
import {isThief, isThiefState, PrinceState, ThiefState} from '@gamepark/brigands/PlayerState'
import Partner, {getPartnersView, isPartner, isPartnerView} from '@gamepark/brigands/types/Partner'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import {ThiefView} from '@gamepark/brigands/types/Thief'
import ThiefTokenInBank from '@gamepark/brigands/types/ThiefTokenInBank'
import ThiefTokenInHand from '@gamepark/brigands/types/ThiefTokenInHand'
import TokenAction from '@gamepark/brigands/types/TokenAction'
import {PlayerTimer, useAnimation, usePlay, usePlayer, usePlayerId} from '@gamepark/react-client'
import {Picture} from '@gamepark/react-components'
import {FC, HTMLAttributes} from 'react'
import {useDrop} from 'react-dnd'
import {useTranslation} from 'react-i18next'
import {resolveStealDurationUnit} from '../BrigandsAnimations'
import SetSelectedPartner, {ResetSelectedPartner, resetSelectedPartnerMove, setSelectedPartnerMove} from '../localMoves/SetSelectedPartner'
import SetSelectedTokenInHand, {ResetSelectedTokenInHand, resetSelectedTokenInHandMove, setSelectedTokenInHandMove} from '../localMoves/SetSelectedTokenInHand'
import {ResetSelectedTokensInBank, resetSelectedTokensInBankMove} from '../localMoves/SetSelectedTokensInBank'
import Button from '../utils/Button'
import Images from '../utils/Images'
import {
  getThiefMeepleDistrictLeft, getThiefMeepleDistrictTop, meepleSize, playerPanelHeight, playerPanelWidth, playerPanelX, playerPanelY
} from '../utils/styles'
import AvatarPanel from './AvatarPanel'
import DistrictCard from './DistrictCard'
import PartnerComponent from './PartnerComponent'
import {decomposeGold, getCoin} from './PrincePanel'
import ThiefToken from './ThiefToken'

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
  eventCard: number
  deckSize: number
  tokenInHandSelected?: ThiefTokenInHand
  tutorial?: boolean

} & HTMLAttributes<HTMLDivElement>

const ThiefPanel: FC<Props> = ({
                                 player, prince, phase, positionForPartners, city, numberOfThieves, districtResolved, thieves, partnersForCards,
                                 displayedThievesOrder, partnerSelected, tokensInBankSelected, eventCard, deckSize, tokenInHandSelected, tutorial, ...props
                               }) => {

  const playerId = usePlayerId<PlayerRole>()
  const thiefId = (playerId === PlayerRole.Prince || playerId === undefined) ? false : (thieves.find(p => p.role === playerId)! as (ThiefState | ThiefView))
  const playerInfo = usePlayer(player.role)
  const {t} = useTranslation()

  const animationBetGold = useAnimation<BetGold>(animation => isBetGold(animation.move))
  const animationGainGold = useAnimation<GainGold>(animation => isGainGold(animation.move))
  const animationResolveSteal = useAnimation<ResolveStealToken>(animation => isResolveStealToken(animation.move))

  const partnersView = isThiefState(player) ? phase !== Phase.Solving ? getPartnersView(player.partners) : player.partners : player.partners
  const cardsPlayed = partnersView.filter(isPartnerView).length === 0 ? 0 : Math.max(...partnersView.filter(isPartnerView).map(partner => partner.card)) + 1

  function isPartnerDraggable(phase: Phase | undefined, role: PlayerRole): boolean {
    return phase === Phase.Planning && role === playerId && !player.isReady
  }

  function isTokenDraggable(phase: Phase | undefined, role: PlayerRole, token: number): boolean {
    return phase === Phase.Planning && role === playerId && !player.isReady && token === -1
  }

  function isEnoughTokensSelected(player: ThiefState | ThiefView, districtResolved: DistrictName | undefined, tokensInBankSelected: ThiefTokenInBank[] | undefined, eventCard: number): boolean {
    if (districtResolved === undefined || (districtResolved !== DistrictName.Jail && districtResolved !== DistrictName.Harbor)) return false
    else {
      if (districtResolved === DistrictName.Harbor) {
        if (tutorial === true && deckSize === 5) {
          return tokensInBankSelected?.length === 1
        }
        const firstPartner = player.partners.find(part => isPartner(part) && part.district === DistrictName.Harbor)
        const maxToTake = EventArray[eventCard].district === DistrictName.Harbor ? 3 : 2
        if (firstPartner === undefined) return false
        else {
          const tokensAlreadyTaken = firstPartner.tokensTaken === undefined ? 0 : firstPartner.tokensTaken
          return tokensInBankSelected !== undefined && tokensInBankSelected.length === Math.min(maxToTake - tokensAlreadyTaken, getTokensInBank(player).length)
        }
      } else {
        const partnersJailed = player.partners.filter(part => isPartner(part) && part.district === DistrictName.Jail)
        if (partnersJailed.length === 0 || partnersJailed.every(part => part.tokensTaken === 1)) return false
        else return tokensInBankSelected !== undefined && tokensInBankSelected.length === Math.min(partnersJailed.length - partnersJailed.filter(part => part.tokensTaken === 1).length, getTokensInBank(player).length)
      }
    }
  }

  const play = usePlay<Move>()
  const playSelectPartner = usePlay<SetSelectedPartner>()
  const playResetTokensInBank = usePlay<ResetSelectedTokensInBank>()
  const playSetTokenInHand = usePlay<SetSelectedTokenInHand>()

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
    drop: (item: ThiefTokenInBank) => {
      playResetTokensInBank(resetSelectedTokensInBankMove(), {local: true})
      return {type: MoveType.TakeToken, role: playerId, token: item.tokenAction}
    }
  })

  function playTakeTokens(tokensInBankSelected: ThiefTokenInBank[]) {
    tokensInBankSelected.forEach(tok => {
      play({
        type: MoveType.TakeToken,
        role: player.role,
        token: tok.tokenAction
      })
    })
    playResetTokensInBank(resetSelectedTokensInBankMove(), {local: true})
  }

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

        <div css={goldZonePosition}>

          {isThiefState(player) && <div css={goldPanel}><p> {t('Ducats')} : {player.gold}</p></div>}

        </div>

        <div css={tokenDivPosition}>
          {player.tokens.kick.map((token, index) =>
              token === -1 && <div key={index}
                                   css={[tokenSize, tokenInHandSelected?.tokenAction === TokenAction.Kicking && tokenInHandSelected.index === index && player.role === playerId && tokenIsSelectedStyle]}>
                <ThiefToken action={TokenAction.Kicking}
                            css={[preserve, isTokenDraggable(phase, player.role, token) && glowingToken(getGlowingPlayerColor(player.role))]}
                            role={player.role}
                            draggable={isTokenDraggable(phase, player.role, token)}
                            type={'ThiefTokenInHand'}
                            draggableItem={{tokenAction: TokenAction.Kicking}}
                            onClick={() => phase === Phase.Planning && player.role === playerId && !player.isReady && token === -1 && playSetTokenInHand(setSelectedTokenInHandMove(TokenAction.Kicking, index), {local: true})}

                />
              </div>
          )}
          {player.tokens.move.map((token, index) =>
              token === -1 && <div key={index}
                                   css={[tokenSize, tokenInHandSelected?.tokenAction === TokenAction.Fleeing && tokenInHandSelected.index === index && player.role === playerId && tokenIsSelectedStyle]}>
                <ThiefToken action={TokenAction.Fleeing}
                            css={[preserve, isTokenDraggable(phase, player.role, token) && glowingToken(getGlowingPlayerColor(player.role))]}
                            role={player.role}
                            draggable={isTokenDraggable(phase, player.role, token)}
                            type={'ThiefTokenInHand'}
                            draggableItem={{tokenAction: TokenAction.Fleeing}}
                            onClick={() => phase === Phase.Planning && player.role === playerId && !player.isReady && token === -1 && playSetTokenInHand(setSelectedTokenInHandMove(TokenAction.Fleeing, index), {local: true})}

                />
              </div>
          )}
          {player.tokens.steal.map((token, index) =>
              token === -1 && <div key={index}
                                   css={[tokenSize, tokenInHandSelected?.tokenAction === TokenAction.Stealing && tokenInHandSelected.index === index && player.role === playerId && tokenIsSelectedStyle]}>
                <ThiefToken action={TokenAction.Stealing}
                            css={[preserve, isTokenDraggable(phase, player.role, token) && glowingToken(getGlowingPlayerColor(player.role))]}
                            role={player.role}
                            draggable={isTokenDraggable(phase, player.role, token)}
                            type={'ThiefTokenInHand'}
                            draggableItem={{tokenAction: TokenAction.Stealing}}
                            onClick={() => phase === Phase.Planning && player.role === playerId && !player.isReady && token === -1 && playSetTokenInHand(setSelectedTokenInHandMove(TokenAction.Stealing, index), {local: true})}

                />
              </div>
          )}
        </div>

        {isThiefState(player) && phase === undefined &&
        <div><p css={scoreDivStyle}> {t('Score')} : {player.gold + player.tokens.steal.length + player.tokens.kick.length + player.tokens.move.length}</p>
        </div>}

        {phase === Phase.Solving && thiefId !== false && isThiefState(thiefId) && thiefId.partners.some((part, index) => part.district === districtResolved!.name && isThisPartnerHasKickToken(thiefId, index) && part.kickOrNot === undefined)
        && (player.partners as Partner[]).some(part => part.district === districtResolved!.name && player.role !== playerId)
        && prince.abilities[1] !== districtResolved!.name
        && <Button css={[kickThisPlayerButtonPosition, glowingButton(getPlayerColor(player.role))]}
                   onClick={() => play({type: MoveType.KickOrNot, kickerRole: thiefId.role, playerToKick: player.role})}
                   pRole={player.role}>{t('Kick')}</Button>
        }

        {phase === Phase.Planning && <div css={cardsPanelPosition}>

          {[...Array(cardsPlayed)].map((_, index) => <DistrictCard key={index}
                                                                   color={player.role}
                                                                   thief={player}
                                                                   district={partnersForCards && getUniquePartnersDistrict(partnersForCards)[index]}
                                                                   partners={partnersForCards}
                                                                   selectedTokenInHand={tokenInHandSelected}
                                                                   phase={phase}
          />)}

        </div>

        }

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
                              onCity(positionForPartners, index, city.findIndex(d => d.name === district), isEmphazing(player.role, index, thieves, phase, districtResolved)) :
                              partnerHandPosition(player.role, index)
                          ]}
                          role={player.role}
                          partners={player.partners}
                          partnerNumber={index}
                          tokens={player.tokens}
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

      {player.role === playerId && phase === Phase.Solving && isThiefState(player) && player.partners.some((part, index) => part.district === districtResolved!.name && isThisPartnerHasMoveToken(player, index))
      && thieves.every(p => isThief(p) && p.partners.every((part, index) => !isPartnerView(part) && (part.district !== districtResolved!.name || !isThisPartnerHasKickToken(p, index))))
      && prince.abilities[1] !== districtResolved!.name
      && <Button css={[moveButtonPosition, glowingButton(getPlayerColor(player.role))]}
                 onClick={() => play({type: MoveType.MovePartner, role: player.role, runner: player.role})} pRole={player.role}>{t('Move')}</Button>
      }

      {player.role === playerId && phase === Phase.Solving && isThiefState(player) && player.partners.some((part, index) => part.district === districtResolved!.name && isThisPartnerHasMoveToken(player, index))
      && thieves.every(p => isThief(p) && p.partners.every((part, index) => !isPartnerView(part) && (part.district !== districtResolved!.name || !isThisPartnerHasKickToken(p, index))))
      && prince.abilities[1] !== districtResolved!.name
      && <Button css={[dontMoveButtonPosition, glowingButton(getPlayerColor(player.role))]}
                 onClick={() => play({type: MoveType.MovePartner, role: false, runner: player.role})} pRole={player.role}>{t('Don\'t Move')}</Button>
      }


      {player.role === playerId && thiefId !== false && phase === Phase.Solving && isThiefState(player) && player.partners.some((part, index) => part.district === districtResolved!.name && isThisPartnerHasKickToken(player, index) && part.kickOrNot === undefined)
      && prince.abilities[1] !== districtResolved!.name
      && <Button css={[dontMoveButtonPosition, glowingButton(getPlayerColor(player.role))]}
                 onClick={() => play({type: MoveType.KickOrNot, kickerRole: thiefId.role, playerToKick: false})} pRole={player.role}>{t('Don\'t Kick')}</Button>
      }

      {animationBetGold && (animationBetGold.move.role === player.role &&
        <div css={[betStyle(animationBetGold.move.gold), betSize, betPositionPlayer(positionForPartners, numberOfThieves),
          betGoldAnimation(animationBetGold.duration, city.findIndex(d => d.name === districtResolved!.name), (playerId === PlayerRole.Prince || playerId === undefined))]}/>)
      }

      {player.role === playerId && phase === Phase.Solving && isEnoughTokensSelected(player, districtResolved?.name, tokensInBankSelected, eventCard) &&
      <Button css={[validationButtonPosition, glowingButton(getPlayerColor(player.role))]} onClick={() => playTakeTokens(tokensInBankSelected!)}
              pRole={player.role}>{t('Take')}</Button>
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

const glowingTokenColoredKeyframes = (color: string) => keyframes`
  0% {
    box-shadow: 0 0 2em ${color};
  }
  80%, 100% {
    box-shadow: 0 0 0.5em ${color};
  }
`

const glowingToken = (color: string) => css`
  animation: ${glowingTokenColoredKeyframes(color)} 1s infinite alternate;
`

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

function getUniquePartnersDistrict(partnersForCards: Partner[]): DistrictName[] {
  const result: DistrictName[] = []
  for (const elem of partnersForCards) {
    if (elem.district) {
      result.push(elem.district)
    }
  }
  return [...new Set(result)].filter(d => d !== DistrictName.Jail)
}

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

const kickThisPlayerButtonPosition = css`
  font-size: 2.5em;
  text-align: center;
  margin: 0 4.08em;
`

const canDropStyle = css`
  background-color: rgba(0, 0, 0, 0.5);
  transition: background-color 0.5s linear;
`

const isOverStyle = css`
  background-color: rgba(0, 0, 0, 0.8);
  transition: background-color 0.5s linear;
`

const moveButtonPosition = css`
  position: absolute;
  width: 15%;
  height: 25%;
  top: -137%;
  right: 20%;
  font-size: 3em;
`

const dontMoveButtonPosition = css`
  position: absolute;
  width: 15%;
  height: 25%;
  top: -137%;
  right: 4%;
  font-size: 3em;
`

const validationButtonPosition = css`
  position: absolute;
  width: 13%;
  height: 23%;
  top: -136%;
  right: 19.5%;
  font-size: 3.5em;
`

const onCity = (positionForPartners: number, index: number, district: number, isEscaping: boolean) => css`
  top: ${getThiefMeepleDistrictTop(positionForPartners, index, district)}em;
  left: ${getThiefMeepleDistrictLeft(positionForPartners, index, district)}em;
  ${isEscaping && `transform:translateZ(4em) scale(1.4,1.4);`};
  ${transitionPartner};
`

const partnerHandPosition = (color: PlayerRole, meepleIndex: number) => css`
  left: ${playerPanelX(color) + 1 + meepleIndex * 4.5}em;
  top: ${playerPanelY(color) + 9}em;

  ${transitionPartner};
`

const cardsPanelPosition = css`
  position: relative;
  transform-style: preserve-3d;
  top: 0;
  left: 5%;
  width: 90%;
  height: 50%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;

`

const goldPanel = css`
  height: 100%;
  width: 60%;

  p {
    font-size: 2.5em;
    margin: 0.2em 0.5em;
    text-align: center;
  }
`

const goldZonePosition = css`
  height: 15%;
  width: 100%;
  margin: 8em 0.2em 0.2em 0.2em;
  display: flex;
  flex-direction: row;
  justify-content: center;
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

const tokenDivPosition = css`
  margin: 1em 0.5em 0.5em 0.7em;
  height: 20%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  transform-style: preserve-3d;
`

const tokenIsSelectedStyle = css`
  transform: translateZ(4em);
  transition: transform 0.2s linear;
`

const tokenSize = css`
  transition: transform 0.2s linear;
  height: 88%;
  width: 15%;
  transform-style: preserve-3d;
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