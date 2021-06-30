import GameState from '../GameState'
import GameView from '../GameView'
import Phase from '../phases/Phase'
import MoveType from './MoveType'

type MoveOnNextPhase = {
  type: MoveType.MoveOnNextPhase
}

export default MoveOnNextPhase

export function moveOnNextPhase(state: GameState | GameView) {
  switch (state.phase) {
    case Phase.NewDay :
      state.phase = Phase.Planning
      break
    case Phase.Planning :
      state.phase = Phase.Patrolling
      state.players.forEach(p => p.isReady = false)
      break
    case Phase.Patrolling :
      state.phase = Phase.Solving
      state.players.forEach(p => p.isReady = false)
      break
    case Phase.Solving:
      state.phase = Phase.NewDay
      break
    default:
      console.error('Cannot Move on next phase when game is over!')
  }
}