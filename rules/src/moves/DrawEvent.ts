import GameState from "../GameState";
import GameView from "../GameView";
import { EventArray } from "../material/Events";
import PlayerState, { isPrinceState, PrinceState } from "../PlayerState";
import PlayerView from "../PlayerView";
import District from "../types/District";
import DistrictName from "../types/DistrictName";
import Phase from "../types/Phase";
import PlayerRole from "../types/PlayerRole";
import { isNotThiefView } from "../types/Thief";
import Move from "./Move";
import MoveType from "./MoveType";
import MoveView from "./MoveView";

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
    state.city.find(d => d.name === DistrictName.Treasure)!.gold! += EventArray[state.event].goldForTreasure ;
    (state.players.find(isPrinceState) as PrinceState).patrols[2] = state.city[EventArray[state.event].positionOfCaptain].name
    state.phase = Phase.Planning
}

export function isDrawEvent(move: Move | MoveView): move is DrawEvent {
    return move.type === MoveType.DrawEvent
}