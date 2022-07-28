import {gainGoldMove} from '../moves/GainGold'
import Move from '../moves/Move'
import {DistrictRules} from './DistrictRules'

export default class Market extends DistrictRules {
  getAutomaticMoves(): Move[] {
    const moves: Move[] = []
    for (const player of this.state.players) {
      const meeples = this.countPlayerMeeples(player)
      if (meeples > 0) {
        moves.push(gainGoldMove(player.role, meeples === 1 ? 2 : meeples === 2 ? 6 : 12))
      }
    }
    moves.push(...this.takeBackMeeplesMoves())
    return moves
  }
}