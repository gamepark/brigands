import GameState from './GameState'
import {isPrinceState, isThief, isThiefState} from './PlayerState'
import PlayerView from './PlayerView'
import PartnerInHand from './types/PartnerInHand'
import PatrolInHand from './types/PatrolInHand'
import ThiefTokenInBank from './types/ThiefTokenInBank'
import ThiefTokenInHand from './types/ThiefTokenInHand'

type GameView = Omit<GameState, 'eventDeck' | 'players'> & {
  eventDeck: number
  players: PlayerView[]
  selectedPartner?: PartnerInHand
  selectedTokenInHand?: ThiefTokenInHand
  selectedTokensInBank?: ThiefTokenInBank[]
  selectedPatrol?: PatrolInHand
  selectedHeadStart?: boolean
}

export default GameView

export function getPrince(state: GameState | GameView) {
  return isGameView(state) ? state.players.find(isPrinceState)! : state.players.find(isPrinceState)!
}

export function getThieves(state: GameState | GameView) {
  return isGameView(state) ? state.players.filter(isThief) : state.players.filter(isThiefState)
}

export function isGameView(state: GameState | GameView): state is GameView {
  return typeof state.eventDeck === 'number'
}