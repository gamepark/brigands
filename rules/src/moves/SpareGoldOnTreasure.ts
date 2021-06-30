import DistrictName from '../districts/DistrictName'
import GameState from '../GameState'
import GameView from '../GameView'
import MoveType from './MoveType'

type SpareGoldOnTreasure = {
  type: MoveType.SpareGoldOnTreasure
  gold: number
  district: DistrictName
}

export default SpareGoldOnTreasure

export function spareGoldOnTreasure(state: GameState | GameView, move: SpareGoldOnTreasure) {
  state.city.find(d => d.name === DistrictName.Treasure)!.gold! += move.gold
  delete state.city.find(d => d.name === move.district)!.dice
}