import GameState from '../GameState'
import GameView, {getPrince} from '../GameView'
import Move from './Move'
import MoveType from './MoveType'
import MoveView from './MoveView'

type PlayHeadStart = {
  type: MoveType.PlayHeadStart
  district: number
}

export default PlayHeadStart

export function playHeadStart(state: GameState | GameView, move: PlayHeadStart) {
  const prince = getPrince(state)
  prince.gold -= 2
  prince.abilities[1] = move.district
}

export function isPlayHeadStart(move: Move | MoveView): move is PlayHeadStart {
  return move.type === MoveType.PlayHeadStart
}
