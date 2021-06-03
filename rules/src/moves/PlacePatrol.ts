import GameState from "../GameState";
import GameView from "../GameView";
import { isPrinceState, PrinceState } from "../PlayerState";
import MoveType from "./MoveType";

type PlacePatrol = {
    type:MoveType.PlacePatrol
    patrolNumber:number
    district:number
}

export default PlacePatrol

export function placePatrol(state:GameState|GameView, move:PlacePatrol){
    (state.players.find(isPrinceState)! as PrinceState).patrols[move.patrolNumber] = move.district
}