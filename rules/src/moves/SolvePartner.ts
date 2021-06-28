import GameState from "../GameState";
import GameView from "../GameView";
import { ThiefState } from "../PlayerState";
import DistrictName from "../types/DistrictName";
import MoveType from "./MoveType";
import {getTokensInBank} from "../Brigands"

type SolvePartner = {
    type:MoveType.SolvePartner
    thief:ThiefState
    partnerNumber:number
}

export default SolvePartner

export function solvePartner(state:GameState | GameView, move:SolvePartner){
    (state.players.find(p => p.role === move.thief.role) as ThiefState).partners[move.partnerNumber].solvingDone = true
    if (getTokensInBank(move.thief).length === 0){
        (state.players.find(p => p.role === move.thief.role) as ThiefState).partners[move.partnerNumber].tokensTaken = 1
    }

    if(state.city[state.districtResolved!].name === DistrictName.Jail){
        delete state.city[state.districtResolved!].dice
    }
}