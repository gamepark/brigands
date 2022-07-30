import {arrestEveryone} from '../Brigands'
import {gainGoldMove} from '../moves/GainGold'
import Move from '../moves/Move'
import {DistrictRules} from './DistrictRules'

export default class Treasure extends DistrictRules {
  getAutomaticMoves(): Move[] {
    const players = this.state.players.filter(player => player.meeples.includes(this.district.name))
    if (players.length > 1) {
      return arrestEveryone(this.state, this.district.name)
    } else {
      const moves: Move[] = [gainGoldMove(players[0].role, 10)]
      moves.push(...this.takeBackMeeplesMoves())
      return moves
    }
  }
}
