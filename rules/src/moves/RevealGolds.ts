import GameState from '../GameState'
import GameView from '../GameView'
import {isThief, ThiefState} from '../PlayerState'
import MoveType from './MoveType'

type RevealGolds = {
  type: MoveType.RevealGolds
}

export type RevealGoldsView = RevealGolds & {
  goldArray: number[]
}

export default RevealGolds

export function revealGolds(state: GameState | GameView) {
  delete state.phase
}

export function revealGoldsInView(state: GameView, move: RevealGoldsView) {
  delete state.phase
  state.players.filter(isThief).forEach((thief, index) => {
    (thief as ThiefState).gold = move.goldArray[index]
  })
}

