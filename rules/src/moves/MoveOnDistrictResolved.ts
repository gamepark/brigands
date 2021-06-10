import GameState from "../GameState";
import GameView from "../GameView";
import { isPrinceState, isThiefState, PrinceState, ThiefState } from "../PlayerState";
import Phase from "../types/Phase";
import Thief from "../types/Thief";
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
        delete state.districtResolved ;
        takeBackPatrols(state.players.find(isPrinceState)! as PrinceState)
        cleanPartners(state.players.filter(isThiefState) as ThiefState[])
        state.players.forEach(p => p.isReady = false)
        state.phase = Phase.NewDay
    } else {
        delete state.city[move.districtResolved].dice
        state.districtResolved! ++
    }
}

function takeBackPatrols(prince:PrinceState){
    prince.patrols[0] = -1
    prince.patrols[1] = -1
    delete prince.patrols[2]
}

function cleanPartners(thieves:ThiefState[]){
    thieves.forEach(p => p.partner.forEach(part => {
        delete part.goldForTavern
        delete part.solvingDone
        delete part.tokensTaken
    }))
}