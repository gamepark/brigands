import {gainGoldMove} from '../moves/GainGold'
import Move from '../moves/Move'
import {throwDicesMove, ThrowDicesRandomized} from '../moves/PlayThrowDicesResult'
import SpendGold, {spendGoldMove} from '../moves/SpendGold'
import {takeBackMeepleMove} from '../moves/TakeBackMeeple'
import PlayerState from '../PlayerState'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class Tavern extends DistrictRules {
  district = DistrictName.Tavern

  getAutomaticMoves(): Move[] {
    if (!this.hasDayCard()) return []
    const moves: Move[] = []
    for (const player of this.state.players) {
      for (const meeple of player.meeples) {
        if (meeple === this.district) {
          moves.push(throwDicesMove(2, player.role))
        }
      }
    }
    return moves
  }

  getLegalMoves(player: PlayerState): Move[] {
    const moves: Move[] = [throwDicesMove(1, player.role)]
    if (player.gold >= 6) {
      moves.push(spendGoldMove(player.role, 6))
    }
    return moves
  }

  onThrowDices(move: ThrowDicesRandomized) {
    const player = this.state.players.find(player => player.role === move.player!)!
    this.state.nextMoves.push(gainGoldMove(move.player!, move.result.reduce((sum, dice) => sum + dice)))
    this.state.nextMoves.push(takeBackMeepleMove(player.role, player.meeples.indexOf(this.district)))
  }

  onSpendGold(move: SpendGold) {
    this.state.nextMoves.push(throwDicesMove(3, move.player))
  }
}
