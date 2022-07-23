import DistrictName from '../districts/DistrictName'
import GameState from '../GameState'
import GameView from '../GameView'
import PlayerRole from '../types/PlayerRole'
import MoveType from './MoveType'

type PlaceToken = {
  type: MoveType.PlaceToken
  role: PlayerRole
  token: number
  district: DistrictName
}

export default PlaceToken

export function placeTokenMove(role: PlayerRole, token: number, district: DistrictName): PlaceToken {
  return {type: MoveType.PlaceToken, role, token, district}
}

export function placeToken(state: GameState | GameView, move: PlaceToken) {
  const player = state.players.find(player => player.role === move.role)!
  player.tokens[move.token] = move.district
}
