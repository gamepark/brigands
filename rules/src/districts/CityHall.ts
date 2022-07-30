import Move from '../moves/Move'
import {DistrictRules} from './DistrictRules'

export default class CityHall extends DistrictRules {
  getAutomaticMoves(): Move[] {
    const moves: Move[] = this.shareGold(10)
    moves.push(...this.takeBackMeeplesMoves())
    return moves
  }
}