import GameState from "../GameState";
import GameView from "../GameView";
import { ThiefState } from "../PlayerState";
import DistrictName from "../types/DistrictName";
import MoveType from "./MoveType";

type SolvePartner = {
    type:MoveType.SolvePartner
    thief:ThiefState
    partnerNumber:number
}

export default SolvePartner

export function solvePartner(state:GameState | GameView, move:SolvePartner){
    console.log("On SolvePartner")
    console.log("thief:", move.thief)
    console.log("partnerNumber", move.partnerNumber);
    (state.players.find(p => p.role === move.thief.role) as ThiefState).partner[move.partnerNumber].solvingDone = true

    if(state.city[state.districtResolved!].name === DistrictName.Jail){
        delete state.city[state.districtResolved!].dice
    }
}