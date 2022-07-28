import GameState from '../GameState'
import GameView from '../GameView'
import PlayerRole from '../types/PlayerRole'
import MoveType from './MoveType'

type TakeBackMeeple = {
  type: MoveType.TakeBackMeeple
  player: PlayerRole
  meeple: number
}

export default TakeBackMeeple

export function takeBackMeepleMove(player: PlayerRole, meeple: number): TakeBackMeeple {
  return {type: MoveType.TakeBackMeeple, player, meeple}
}

export function takeBackMeeple(state: GameState | GameView, move: TakeBackMeeple) {
  const player = state.players.find(p => p.role === move.player)!
  player.meeples[move.meeple] = null
}
