import {gainGoldMove} from '../moves/GainGold'
import Move from '../moves/Move'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class Market extends DistrictRules {
  district = DistrictName.Market

  getAutomaticMoves(): Move[] {
    const moves: Move[] = []
    for (const player of this.state.players) {
      const meeples = this.countPlayerMeeples(player)
      if (meeples > 0) {
        moves.push(gainGoldMove(player.role, this.getGain(meeples)))
      }
    }
    moves.push(...this.takeBackMeeplesMoves())
    return moves
  }

  getGain(meeples: number) {
    if (this.hasDayCard()) {
      switch (meeples) {
        case 1:
          return 2
        case 2:
          return 6
        default:
          return 12
      }
    } else {
      switch (meeples) {
        case 1:
          return 5
        case 2:
          return 10
        default:
          return 16
      }
    }
  }
}