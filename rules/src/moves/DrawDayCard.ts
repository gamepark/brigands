import DistrictName from '../districts/DistrictName'
import GameState from '../GameState'
import GameView from '../GameView'
import Move from './Move'
import MoveType from './MoveType'
import MoveView from './MoveView'

type DrawDayCard = { type: typeof MoveType.DrawDayCard }

export default DrawDayCard

export const drawDayCardMove: DrawDayCard = {type: MoveType.DrawDayCard}

export type DrawDayCardView = DrawDayCard & {
  district: DistrictName
}

export function drawDayCard(state: GameState) {
  state.dayCards.push(state.deck.shift()!)
}

export function drawDayCardInView(state: GameView, move: DrawDayCardView) {
  state.dayCards.push(move.district)
  state.deck--
}

export function isDrawDayCard(move: Move | MoveView): move is DrawDayCard {
  return move.type === MoveType.DrawDayCard
}

export function getDrawEventView(state: GameState): DrawDayCardView {
  return {type: MoveType.DrawDayCard, district: state.deck[0]}
}
