import Move from '../moves/Move'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class CityHall extends DistrictRules {
  district = DistrictName.CityHall

  getAutomaticMoves(): Move[] {
    const moves: Move[] = this.shareGold(this.hasDayCard() ? 16 : 10)
    moves.push(...this.takeBackMeeplesMoves())
    return moves
  }
}