import {arrestEveryone} from '../Brigands'
import Move from '../moves/Move'
import {throwDicesMove, ThrowDicesRandomized} from '../moves/PlayThrowDicesResult'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class Convoy extends DistrictRules {
  district = DistrictName.Convoy

  getAutomaticMoves(): Move[] {
    const meeples = this.countMeeples()
    if (meeples <= 1) {
      return arrestEveryone(this.state, this.district)
    } else {
      return [throwDicesMove(1)]
    }
  }

  onThrowDices(move: ThrowDicesRandomized) {
    const gold = 10 + move.result.reduce((sum, dice) => sum + dice)
    const moves = this.shareGold(gold)
    moves.push(...this.takeBackMeeplesMoves())
    return moves
  }
}
