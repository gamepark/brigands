/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import {getDistrictsCanPlaceToken} from '@gamepark/brigands/Brigands'
import DistrictName from '@gamepark/brigands/districts/DistrictName'
import GameView, {getThieves} from '@gamepark/brigands/GameView'
import BetGold, {isBetGold} from '@gamepark/brigands/moves/BetGold'
import GainGold, {isGainGold} from '@gamepark/brigands/moves/GainGold'
import {isThrowDice, ThrowDicesRandomized} from '@gamepark/brigands/moves/PlayThrowDicesResult'
import {isRevealPartnersDistrict, RevealPartnersDistrictsView} from '@gamepark/brigands/moves/RevealPartnersDistricts'
import Phase from '@gamepark/brigands/phases/Phase'
import {isPrinceState, isThief, isThiefState, PrinceState, ThiefState} from '@gamepark/brigands/PlayerState'
import Partner, {isPartner, isPartnerView} from '@gamepark/brigands/types/Partner'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import {ThiefView} from '@gamepark/brigands/types/Thief'
import {useAnimation, usePlayerId, useTutorial} from '@gamepark/react-client'
import {Letterbox} from '@gamepark/react-components'
import {useMemo, useState} from 'react'
import City from './board/City'
import DicePopUp from './board/DicePopUp'
import DistrictHelpPopUp from './board/DistrictHelpPopUp'
import PrincePanel from './board/PrincePanel'
import TavernPopUp from './board/TavernPopUp'
import ThiefPanel from './board/ThiefPanel'
import WeekCardsPanel from './board/WeekCardsPanel'
import WelcomePopUp from './board/WelcomePopUp'
import {PlayerDisplay} from './PlayerDisplay'
import BrigandsSounds from './sounds/BrigandsSounds'
import TutorialPopup from './tutorial/TutorialPopUp'
import {AudioLoader} from './utils/AudioLoader'
import {playerPanelX, playerPanelY} from './utils/styles'

type Props = {
  game: GameView
  audioLoader: AudioLoader
}

export default function GameDisplay({game, audioLoader}: Props) {

  const tutorial = useTutorial()

  const betAnimation = useAnimation<BetGold>(animation => isBetGold(animation.move))
  const diceAnimation = useAnimation<ThrowDicesRandomized>(animation => isThrowDice(animation.move))
  const gainGoldAnimation = useAnimation<GainGold>(animation => isGainGold(animation.move))
  const revealPartnersAnimation = useAnimation<RevealPartnersDistrictsView>(animation => isRevealPartnersDistrict(animation.move))

  const playerId = usePlayerId<PlayerRole>()
  const players = useMemo(() => getPlayersStartingWith(game, playerId), [game, playerId])
  const player = playerId === PlayerRole.Prince ? game.players.find(isPrinceState) : game.players.find(isThiefState)

  const partnersOfPlayerId = (playerId !== PlayerRole.Prince && playerId !== undefined) ? (players.find(p => p.role === playerId)! as ThiefState | ThiefView).partners as Partner[] : undefined

  function isTavernPopUpDisplay(playerList: (ThiefState | ThiefView)[], role: PlayerRole | undefined, phase: Phase | undefined, districtResolved: DistrictName | undefined, prince: PrinceState) {
    return (phase === Phase.Solving
        && districtResolved === DistrictName.Tavern
        && role !== undefined && role !== PlayerRole.Prince
        && (playerList.find(p => p.role === role) as ThiefState).partners.some(p => p.district === DistrictName.Tavern && p.goldForTavern === undefined)
        && playerList.filter(p => p.partners.some(part => !isPartnerView(part) && part.district === DistrictName.Tavern)).length === 0
        && !prince.patrols.some(pat => pat === DistrictName.Tavern))
      && !betAnimation && !gainGoldAnimation && !diceAnimation
  }

  const [welcomePopUpClosed, setWelcomePopUpClosed] = useState(tutorial ? true : playerId === undefined || game.deck < 5)
  const showWelcomePopup = !welcomePopUpClosed

  const [districtPopUpClosed, setDistrictPopUpClosed] = useState<true | DistrictName>(true)

  return (
    <>
      <Letterbox css={letterBoxStyle} top={0}>

        <City city={game.city}
              phase={game.phase}
              prince={players.find(isPrinceState)!}
              currentDistrict={game.currentDistrict}
              partnersOfPlayerId={game.phase === Phase.Planning ? partnersOfPlayerId : undefined}
              isPlayerReady={(game.phase === Phase.Planning && playerId !== PlayerRole.Prince && playerId !== undefined) ? players.find(p => p.role === playerId)!.isReady : undefined}
              selectedPartner={game.selectedPartner?.partnerNumber}
              selectedTokenInHand={game.selectedTokenInHand}
              selectedPatrol={game.selectedPatrol}
              selectedHeadStart={game.selectedHeadStart}
              districtsCanPlaceToken={player ? getDistrictsCanPlaceToken(player) : []}
              open={(district) => setDistrictPopUpClosed(district)}
        />

        <WeekCardsPanel deck={game.deck} dayCards={game.dayCards} city={game.city}/>

        <PrincePanel player={players.find(isPrinceState)!}
                     city={game.city}
                     phase={game.phase}
                     partnersArrestedCount={game.phase === Phase.Solving ? getThieves(game).flatMap(thief => thief.partners.filter(partner => isPartner(partner) && partner.district === game.city[game.currentDistrict!].name)).length : undefined}
                     selectedPatrol={game.selectedPatrol}
        />

        {isTavernPopUpDisplay(game.players.filter(isThief), playerId, game.phase, (game.currentDistrict !== undefined ? game.city[game.currentDistrict].name : undefined), game.players.find(isPrinceState)!) &&
        <TavernPopUp player={players.find(isThiefState)!}
        />
        }

        {game.currentDistrict !== undefined && game.city[game.currentDistrict].name !== DistrictName.Treasure && diceAnimation &&
        <DicePopUp dice={diceAnimation.move.result}
        />}

        {players.filter(isThief).map((p, index) =>
          <ThiefPanel key={index}
                      positionForPartners={index}
                      css={thiefPanelPosition(p.role)}
                      player={p}
                      phase={game.phase}
                      city={game.city}
                      numberOfThieves={players.filter(isThief).length}
                      districtResolved={game.currentDistrict === undefined ? undefined : game.city[game.currentDistrict]}
                      thieves={getThieves(game)}
                      displayedThievesOrder={players.filter(isThief).map((p) => p.role)}
                      partnersForCards={revealPartnersAnimation
                        ? revealPartnersAnimation.move.partnersObject.find(obj => obj.role === p.role)!.partners
                        : (game.phase === Phase.Planning && p.role === playerId && p.partners.every(isPartner)) === true ? p.partners : undefined
                      }
                      prince={game.players.find(isPrinceState)!}
                      partnerSelected={game.selectedPartner?.partnerNumber}
                      tokensInBankSelected={game.selectedTokensInBank}
                      deckSize={game.deck}
                      tokenInHandSelected={game.selectedTokenInHand}
                      tutorial={game.tutorial}
          />
        )}

        {game.players.map(player => <PlayerDisplay key={player.role} player={player} me={player.role === playerId} city={game.city} phase={game.phase}/>)}

        {tutorial && <TutorialPopup game={game} tutorial={tutorial}/>}

        {playerId !== undefined && showWelcomePopup && <WelcomePopUp player={player} game={game} close={() => setWelcomePopUpClosed(true)}/>}

        <BrigandsSounds audioLoader={audioLoader} phase={game.phase}/>

      </Letterbox>

      {playerId !== undefined && districtPopUpClosed !== true &&
      <DistrictHelpPopUp district={districtPopUpClosed} nbPlayers={game.players.length} color={playerId} close={() => setDistrictPopUpClosed(true)}/>}
    </>
  )
}

const thiefPanelPosition = (color: PlayerRole) => css`
  position: absolute;
  left: ${playerPanelX(color)}em;
  top: ${playerPanelY(color)}em;
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