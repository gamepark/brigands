import DistrictName from '../districts/DistrictName'
import GameState from '../GameState'
import GameView from '../GameView'
import Move from './Move'
import MoveType from './MoveType'
import MoveView from './MoveView'

type DiscardDayCard = {
  type: typeof MoveType.DiscardDayCard
  district: DistrictName
}

export default DiscardDayCard

export function discardDayCardMove(district: DistrictName): DiscardDayCard {
  return {type: MoveType.DiscardDayCard, district}
}

export function discardDayCard(state: GameState | GameView, move: DiscardDayCard) {
  state.dayCards.splice(state.dayCards.indexOf(move.district), 1)
}

export function isDiscardDayCard(move: Move | MoveView): move is DiscardDayCard {
  return move.type === MoveType.DiscardDayCard
}
