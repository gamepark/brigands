import GameState from "../GameState";
import GameView from "../GameView";
import { isPrinceState, PrinceState } from "../PlayerState";
import DistrictName from "../types/DistrictName";
import MoveType from "./MoveType";

type PlayHeadStart = {
    type:MoveType.PlayHeadStart
    district:number
}

export default PlayHeadStart

export function playHeadStart(state:GameState | GameView, move:PlayHeadStart){
    const prince : PrinceState = state.players.find(isPrinceState) as PrinceState ;
    prince.gold -=2
    prince.abilities[1] = move.district
}