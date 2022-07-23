import DistrictName from '../districts/DistrictName'
import GameState from '../GameState'
import GameView, {getPrince} from '../GameView'
import {EventArray} from '../material/Events'
import Move from './Move'
import MoveType from './MoveType'
import MoveView from './MoveView'

type DrawEvent = { type: typeof MoveType.DrawEvent }

export default DrawEvent

export const drawEventMove: DrawEvent = {type: MoveType.DrawEvent}

export type DrawEventView = DrawEvent & {
  event: number
}

export function drawEvent(state: GameState) {
  state.event = state.eventDeck.pop()!
  applyEvent(state)
}

export function drawEventInView(state: GameView, move: DrawEventView) {
  state.event = move.event
  state.eventDeck--
  applyEvent(state)
}

function applyEvent(state: GameState | GameView) {
  const prince = getPrince(state)
  const event = EventArray[state.event]
  prince.gold += event.goldForPrince
  state.city.find(d => d.name === DistrictName.Treasure)!.gold! += event.goldForTreasure
  prince.patrols[2] = state.city[event.positionOfCaptain].name
}

export function isDrawEvent(move: Move | MoveView): move is DrawEvent {
  return move.type === MoveType.DrawEvent
}

export function getDrawEventView(state: GameState): DrawEventView {
  return {type: MoveType.DrawEvent, event: state.eventDeck[state.eventDeck.length - 1]}
}
