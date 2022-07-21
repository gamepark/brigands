import DistrictName from '../districts/DistrictName'
import GameState from '../GameState'
import GameView from '../GameView'
import PlayerRole from '../types/PlayerRole'
import MoveType from './MoveType'

type PlaceMeeple = {
  type: MoveType.PlaceMeeple
  player: PlayerRole
  district: DistrictName
  meeple: number
}

export default PlaceMeeple

export function placeMeepleMove(player: PlayerRole, district: DistrictName, meeple: number): PlaceMeeple {
  return {type: MoveType.PlaceMeeple, player, district, meeple}
}

export function placeMeeple(state: GameState | GameView, move: PlaceMeeple) {
  const player = state.players.find(p => p.role === move.player)!
  player.meeples[move.meeple] = move.district
}
