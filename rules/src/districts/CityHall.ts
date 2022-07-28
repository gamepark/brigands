import {gainGoldMove} from '../moves/GainGold'
import Move from '../moves/Move'
import {DistrictRules} from './DistrictRules'

export default class CityHall extends DistrictRules {
  getAutomaticMoves(): Move[] {
    const moves: Move[] = []
    const meeples = this.countMeeples()
    const meepleShare = Math.floor(10 / meeples)
    for (const player of this.state.players) {
      const meeples = this.countPlayerMeeples(player)
      if (meeples > 0) {
        moves.push(gainGoldMove(player.role, meeples * meepleShare))
      }
    }
    moves.push(...this.takeBackMeeplesMoves())
    return moves
  }
}