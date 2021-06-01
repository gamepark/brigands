import GameState from "../GameState";
import GameView from "../GameView";
import { EventArray } from "../material/Events";
import PlayerState, { isPrinceState } from "../PlayerState";
import PlayerView from "../PlayerView";
import District from "../types/District";
import DistrictName from "../types/DistrictName";
import Phase from "../types/Phase";
import { isNotThiefView } from "../types/Thief";
import MoveType from "./MoveType";

type DrawEvent = { type:typeof MoveType.DrawEvent}

export default DrawEvent

export type DrawEventView = DrawEvent & {
    event:number
}

export function drawEvent(state:GameState){
    state.event = state.eventDeck.pop()!
    applyEvent(state)
}

export function drawEventInView(state:GameView, move:DrawEventView){
    state.event = move.event
    state.eventDeck--
    applyEvent(state)
}

function applyEvent(state: GameState | GameView) {
    (state.players as PlayerView[]).find(isPrinceState)!.gold += EventArray[state.event].goldForPrince
    state.city.find(d => d.name === DistrictName.Treasure)!.gold! += EventArray[state.event].goldForTreasure
    state.phase = Phase.Planning

    const p = (state).players.filter(isPrinceState)!
    const padz = (state).players.find(isPrinceState)!
}