import {arrestEveryone} from '../Brigands'
import {gainGoldMove} from '../moves/GainGold'
import Move from '../moves/Move'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class Treasure extends DistrictRules {
  district = DistrictName.Treasure

  getAutomaticMoves(): Move[] {
    const players = this.state.players.filter(player => player.meeples.includes(this.district))
    if (players.length > 1) {
      return arrestEveryone(this.state, this.district)
    } else {
      const moves: Move[] = [gainGoldMove(players[0].role, this.hasDayCard() ? 15 : 10)]
      moves.push(...this.takeBackMeeplesMoves())
      return moves
    }
  }
}
