import {gainGoldMove} from '../moves/GainGold'
import Move from '../moves/Move'
import {throwDicesMove, ThrowDicesRandomized} from '../moves/PlayThrowDicesResult'
import SpendGold, {spendGoldMove} from '../moves/SpendGold'
import {takeBackMeepleMove} from '../moves/TakeBackMeeple'
import PlayerState from '../PlayerState'
import {DistrictRules} from './DistrictRules'

export default class Tavern extends DistrictRules {
  getLegalMoves(player: PlayerState): Move[] {
    const moves: Move[] = [throwDicesMove(player.role, 1)]
    if (player.gold >= 6) {
      moves.push(spendGoldMove(player.role, 6))
    }
    return moves
  }

  onThrowDices(move: ThrowDicesRandomized) {
    const player = this.state.players.find(player => player.role === move.player)!
    this.state.nextMoves.push(gainGoldMove(move.player, move.result.reduce((sum, dice) => sum + dice)))
    this.state.nextMoves.push(takeBackMeepleMove(player.role, player.meeples.indexOf(this.district.name)))
  }

  onSpendGold(move: SpendGold) {
    this.state.nextMoves.push(throwDicesMove(move.player, 3))
  }
}
