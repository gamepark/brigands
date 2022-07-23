import GameState from '../GameState'
import GameView from '../GameView'
import PlayerRole from '../types/PlayerRole'
import MoveType from './MoveType'

type TakeToken = {
  type: MoveType.TakeToken
  role: PlayerRole
}

export default TakeToken

export function takeTokenMove(role: PlayerRole): TakeToken {
  return {type: MoveType.TakeToken, role}
}

export function takeToken(state: GameState | GameView, move: TakeToken) {
  const player = state.players.find(player => player.role === move.role)!
  player.actions.push(null)
}
