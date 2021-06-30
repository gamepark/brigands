import GameState from '../GameState'
import GameView, {getPrince} from '../GameView'
import MoveType from './MoveType'

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
