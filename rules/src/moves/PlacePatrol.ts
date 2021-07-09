import GameState from '../GameState'
import GameView, {getPrince} from '../GameView'
import Move from './Move'
import MoveType from './MoveType'
import MoveView from './MoveView'

type PlacePatrol = {
  type: MoveType.PlacePatrol
  patrolNumber: number
  district: number
}

export default PlacePatrol

export function placePatrol(state: GameState | GameView, move: PlacePatrol) {
  const prince = getPrince(state)
  prince.patrols[move.patrolNumber] = move.district
  if (move.patrolNumber === 2) {
    prince.gold -= 5
    prince.abilities[2] = true
  }
}

export function isPlacePatrol(move: Move | MoveView): move is PlacePatrol {
  return move.type === MoveType.PlacePatrol
}

export function isPlaceCaptain(move:Move | MoveView): move is PlacePatrol {
  return move.type === MoveType.PlacePatrol && move.patrolNumber === 2
}
