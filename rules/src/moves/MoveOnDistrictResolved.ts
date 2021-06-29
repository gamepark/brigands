import GameState from '../GameState'
import GameView, {getPrince, getThieves} from '../GameView'
import {isThiefState, PrinceState, ThiefState} from '../PlayerState'
import Phase from '../phases/Phase'
import MoveType from './MoveType'

type MoveOnDistrictResolved = {
    type:MoveType.MoveOnDistrictResolved
    districtResolved:number
}

export default MoveOnDistrictResolved

export function moveOnDistrictResolved(state:GameState | GameView, move:MoveOnDistrictResolved){
    if (move.districtResolved === 0){
        getThieves(state).filter(isThiefState).forEach(p => p.partners.forEach(part => part.district === state.city[move.districtResolved].name && delete part.solvingDone))
    }
    if (move.districtResolved === 7){
        const prince = getPrince(state)
        const thieves = getThieves(state).filter(isThiefState)
        delete state.districtResolved
        takeBackPatrols(prince)
        cleanPartners(thieves)
        cleanTokens(thieves)
        cleanAbilities(prince)
        state.players.forEach(p => p.isReady = false)

        // If state.eventDeck.length === 0 => state.phase = undefined

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
    thieves.forEach(p => p.partners.forEach(part => {
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