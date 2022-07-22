import Move from '../moves/Move'
import MoveType from '../moves/MoveType'
import {ThiefState} from '../PlayerState'
import {PhaseRules} from './PhaseRules'

export default class Planning extends PhaseRules {
  isThiefActive(thief: ThiefState): boolean {
    return !thief.isReady
  }

  getAutomaticMove(): Move | void {
    if (this.getThieves().every(p => p.isReady)) {
      return {type: MoveType.MoveOnNextPhase}
    }
  }
}
