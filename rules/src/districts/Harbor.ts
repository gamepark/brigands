import {MAX_ACTIONS} from '../Brigands'
import {gainGoldMove} from '../moves/GainGold'
import Move from '../moves/Move'
import SpendTokens, {spendTokensMove} from '../moves/SpendTokens'
import {takeBackMeepleMove} from '../moves/TakeBackMeeple'
import TakeToken, {takeTokenMove} from '../moves/TakeToken'
import PlayerState from '../PlayerState'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class Harbor extends DistrictRules {
  district = DistrictName.Harbor

  getLegalMoves(player: PlayerState): Move[] {
    const moves: Move[] = []
    if (player.tokens.length < MAX_ACTIONS) {
      moves.push(takeTokenMove(player.role))
    }
    for (let tokens = 1; tokens < player.tokens.length; tokens++) {
      if (player.tokens.length > 0) {
        moves.push(spendTokensMove(player.role, tokens))
      }
    }
    return moves
  }

  onTakeToken(move: TakeToken) {
    const player = this.state.players.find(player => player.role === move.role)!
    if (player.tokens.length < MAX_ACTIONS) {
      this.state.nextMoves.push(takeTokenMove(player.role))
    }
    this.state.nextMoves.push(takeBackMeepleMove(player.role, player.meeples.indexOf(this.district)))
  }

  onSpendTokens(move: SpendTokens) {
    const player = this.state.players.find(player => player.role === move.role)!
    this.state.nextMoves.push(gainGoldMove(player.role, move.tokens * 3))
    this.state.nextMoves.push(takeBackMeepleMove(player.role, player.meeples.indexOf(this.district)))
  }
}