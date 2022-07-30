import {getDistrictRules} from '../Brigands'
import GameState from '../GameState'
import GameView from '../GameView'
import PlayerRole from '../types/PlayerRole'
import MoveType from './MoveType'

type SpendGold = {
  type: MoveType.SpendGold
  player: PlayerRole
  gold: number
}

export default SpendGold

export function spendGoldMove(role: PlayerRole, gold: number): SpendGold {
  return {type: MoveType.SpendGold, player: role, gold}
}

export function spendGold(state: GameState | GameView, move: SpendGold) {
  const player = state.players.find(player => player.role === move.player)!
  player.gold -= move.gold
  getDistrictRules(state).onSpendGold(move)
}
