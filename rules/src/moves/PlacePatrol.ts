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
    const prince : PrinceState = state.players.find(isPrinceState)! as PrinceState
    prince.patrols[move.patrolNumber] = move.district
    if (move.patrolNumber === 2){
        prince.gold -=5
        prince.abilities[2] = true
    }
}