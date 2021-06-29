import {getTokensInBank} from '../Brigands'
import GameState from '../GameState'
import GameView, {getThieves} from '../GameView'
import {ThiefState} from '../PlayerState'
import DistrictName from '../districts/DistrictName'
import MoveType from './MoveType'

type SolvePartner = {
    type:MoveType.SolvePartner
    thief:ThiefState
    partnerNumber:number
}

export default SolvePartner

export function solvePartner(state:GameState | GameView, move:SolvePartner){
    const thief = getThieves(state).find(p => p.role === move.thief.role)!
    thief.partners[move.partnerNumber].solvingDone = true
    if (getTokensInBank(move.thief).length === 0){
        thief.partners[move.partnerNumber].tokensTaken = 1
    } else {
        thief.partners[move.partnerNumber].tokensTaken = 0
    }

    if(state.city[state.districtResolved!].name === DistrictName.Jail){
        delete state.city[state.districtResolved!].dice
    }
}