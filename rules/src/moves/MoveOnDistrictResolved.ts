import GameState from "../GameState";
import GameView from "../GameView";
import { isThiefState, ThiefState } from "../PlayerState";
import Phase from "../types/Phase";
import MoveType from "./MoveType";

type MoveOnDistrictResolved = {
    type:MoveType.MoveOnDistrictResolved
    districtResolved:number
}

export default MoveOnDistrictResolved

export function moveOnDistrictResolved(state:GameState | GameView, move:MoveOnDistrictResolved){
    if (move.districtResolved === 0){
        (state.players.filter(isThiefState) as ThiefState[]).forEach(p => p.partner.forEach(part => part.district === state.city[move.districtResolved].name && delete part.solvingDone))
    }
    if (move.districtResolved === 6){
        delete state.districtResolved 
        state.phase = Phase.NewDay
    } else {
        delete state.city[move.districtResolved].dice
        state.districtResolved! ++
    }
}