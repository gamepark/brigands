import {getDistrictRules} from '../Brigands'
import GameState from '../GameState'
import GameView from '../GameView'
import Phase from '../phases/Phase'
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
  player.tokens.push(null)
  if (state.phase === Phase.Solving) {
    getDistrictRules(state).onTakeToken(move)
  }
}
