import {MAX_ACTIONS, patrolInDistrict} from '../Brigands'
import Move from '../moves/Move'
import SpendTokens, {spendTokensMove} from '../moves/SpendTokens'
import TakeToken, {takeTokenMove} from '../moves/TakeToken'
import PlayerState from '../PlayerState'
import PlayerRole from '../types/PlayerRole'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class Jail extends DistrictRules {
  district = DistrictName.Jail

  getAutomaticMoves(): Move[] {
    if (patrolInDistrict(this.state, this.district)) {
      return [takeTokenMove(PlayerRole.Prince)]
    }
    if (this.allMeeplesSolved()) {
      // TODO: Next phase + clean meeplesStayingInJail or end of game
    }
    return []
  }

  allMeeplesSolved() {
    for (const player of this.state.players) {
      if (this.countPlayerMeeples(player) > (player.meeplesStayingInJail ?? 0)) {
        return false
      }
    }
    return true
  }

  getLegalMoves(player: PlayerState): Move[] {
    const moves: Move[] = []
    if (!patrolInDistrict(this.state, this.district)) {
      if (!player.meeplesStayingInJail || this.countPlayerMeeples(player) > player.meeplesStayingInJail) {
        if (player.tokens.length > 0) {
          moves.push(spendTokensMove(player.role))
        }
        if (player.tokens.length < MAX_ACTIONS) {
          moves.push(takeTokenMove(player.role))
        }
      }
    } else if (player.role === PlayerRole.Prince) {
      return [] // TODO: upgrade spy or judgment
    }
    return moves
  }

  onSpendTokens(move: SpendTokens) {
    return this.takeBackMeeple(move.role)
  }

  onTakeToken(move: TakeToken) {
    const player = this.state.players.find(player => player.role === move.role)!
    player.meeplesStayingInJail = (player.meeplesStayingInJail ?? 0) + 1
  }
}