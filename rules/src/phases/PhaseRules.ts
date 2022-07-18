import GameState from '../GameState'
import Move from '../moves/Move'
import {isThiefState, PrinceState, ThiefState} from '../PlayerState'

export abstract class PhaseRules {
  state: GameState

  constructor(state: GameState) {
    this.state = state
  }

  isPrinceActive(_prince: PrinceState): boolean {
    return false
  }

  isThiefActive(_thief: ThiefState): boolean {
    return false
  }

  getPrinceLegalMoves(_prince: PrinceState): Move[] {
    return []
  }

  getThiefLegalMoves(_thief: ThiefState): Move[] {
    return []
  }

  getAutomaticMove(): Move | void {
  }

  getThieves() {
    return this.state.players.filter(isThiefState)
  }
}