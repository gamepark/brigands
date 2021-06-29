import Move from '../moves/Move'
import MoveType from '../moves/MoveType'
import {PhaseRules} from './PhaseRules'

export default class NewDay extends PhaseRules {
  getAutomaticMove(): Move | void {
    return {type: MoveType.DrawEvent}
  }
}