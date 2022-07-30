import {arrestEveryone} from '../Brigands'
import {gainGoldMove} from '../moves/GainGold'
import Move from '../moves/Move'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class Palace extends DistrictRules {
  getAutomaticMoves(): Move[] {
    const moves: Move[] = []
    const meeples = this.countMeeples()
    if (meeples >= 3) {
      moves.push(...arrestEveryone(this.state, DistrictName.Palace))
    } else {
      for (const player of this.state.players) {
        const playerMeeples = this.countPlayerMeeples(player)
        if (playerMeeples > 0) {
          moves.push(gainGoldMove(player.role, playerMeeples * 5))
        }
      }
      moves.push(...this.takeBackMeeplesMoves())
    }
    return moves
  }
}