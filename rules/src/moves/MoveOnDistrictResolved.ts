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
    if (move.districtResolved === 7){
        delete state.districtResolved ;
        takeBackPatrols(state.players.find(isPrinceState)! as PrinceState)
        cleanPartners(state.players.filter(isThiefState) as ThiefState[])
        cleanTokens(state.players.filter(isThiefState) as ThiefState[])
        cleanAbilities(state.players.find(isPrinceState)! as PrinceState)
        state.players.forEach(p => p.isReady = false)
        state.phase = Phase.NewDay
    } else {
        delete state.city[move.districtResolved].dice
        state.districtResolved! ++
    }
}

function cleanAbilities(prince:PrinceState){
    prince.abilities.forEach(a => a = false)
}

function takeBackPatrols(prince:PrinceState){
    prince.patrols[0] = -1
    prince.patrols[1] = -1
    prince.patrols[2] = -1
}

function cleanPartners(thieves:ThiefState[]){
    thieves.forEach(p => p.partner.forEach(part => {
        delete part.goldForTavern
        delete part.solvingDone
        delete part.tokensTaken
    }))
}

export function cleanTokens(thieves:ThiefState[]){
    thieves.forEach(p => {
        for (let i = 0 ; i < p.tokens.steal.length ; i++){
            if (p.tokens.steal[i] > 0){
                p.tokens.steal.splice(i,1)
            }
        }
        for (let i = 0 ; i < p.tokens.kick.length ; i++){
            if (p.tokens.kick[i] > 0){
                p.tokens.kick.splice(i,1)
            }
        }
        for (let i = 0 ; i < p.tokens.move.length ; i++){
            if (p.tokens.move[i] > 0){
                p.tokens.move.splice(i,1)
            }
        }
    })
}