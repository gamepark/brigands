import {getDistrictRules} from '../Brigands'
import GameState from '../GameState'
import GameView from '../GameView'
import PlayerRole from '../types/PlayerRole'
import MoveType from './MoveType'

type SpendTokens = {
  type: MoveType.SpendTokens
  role: PlayerRole
  tokens: number
}

export default SpendTokens

export function spendTokensMove(role: PlayerRole, tokens: number): SpendTokens {
  return {type: MoveType.SpendTokens, role, tokens}
}

export function spendTokens(state: GameState | GameView, move: SpendTokens) {
  const player = state.players.find(player => player.role === move.role)!
  for (let i = 0; i < move.tokens; i++) {
    player.tokens.splice(player.tokens.indexOf(null), 1)
  }
  getDistrictRules(state).onSpendTokens(move)
}
